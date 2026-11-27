package app.mwaiseni

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.speech.RecognizerIntent
import android.view.ViewGroup
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.webkit.WebViewAssetLoader
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

/**
 * Thin native shell. The whole UI lives in assets/www and talks to the phone
 * (voice, translator, camera OCR, notifications) through [Bridge].
 */
class MainActivity : ComponentActivity() {

    lateinit var web: WebView
        private set
    private lateinit var root: FrameLayout
    private lateinit var bridge: Bridge

    private lateinit var speechLauncher: ActivityResultLauncher<Intent>
    private lateinit var cameraLauncher: ActivityResultLauncher<Uri>
    private lateinit var galleryLauncher: ActivityResultLauncher<String>
    private lateinit var notifLauncher: ActivityResultLauncher<String>

    private var speechReq: String? = null
    private var scanReq: String? = null
    private var notifReq: String? = null
    private var cameraFile: String? = null

    /** Something shared into the app before the page was ready. */
    @Volatile
    private var pendingShare: JSONObject? = null
    @Volatile
    private var pageReady = false

    val scansDir: File by lazy { File(cacheDir, "scans").apply { mkdirs() } }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        WindowCompat.setDecorFitsSystemWindows(window, false)

        cameraFile = savedInstanceState?.getString("cameraFile")

        root = FrameLayout(this)
        root.setBackgroundColor(ContextCompat.getColor(this, R.color.bg))
        web = WebView(this)
        web.setBackgroundColor(Color.TRANSPARENT)
        web.overScrollMode = WebView.OVER_SCROLL_NEVER
        root.addView(
            web,
            FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT)
        )
        setContentView(root)

        ViewCompat.setOnApplyWindowInsetsListener(root) { v, insets ->
            val bars = insets.getInsets(
                WindowInsetsCompat.Type.systemBars() or
                    WindowInsetsCompat.Type.displayCutout() or
                    WindowInsetsCompat.Type.ime()
            )
            v.setPadding(bars.left, bars.top, bars.right, bars.bottom)
            WindowInsetsCompat.CONSUMED
        }

        registerLaunchers()
        if (BuildConfig.DEBUG) WebView.setWebContentsDebuggingEnabled(true)

        bridge = Bridge(this)
        val loader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .addPathHandler("/scans/", WebViewAssetLoader.InternalStoragePathHandler(this, scansDir))
            .build()

        web.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            mediaPlaybackRequiresUserGesture = false
            allowFileAccess = false
            allowContentAccess = false
            textZoom = 100
            setSupportZoom(false)
        }
        web.isVerticalScrollBarEnabled = false
        web.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? =
                loader.shouldInterceptRequest(request.url)

            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                val url = request.url
                if (url.host == WebViewAssetLoader.DEFAULT_DOMAIN) return false
                openExternal(url.toString())
                return true
            }
        }
        web.addJavascriptInterface(bridge, "NativeBridge")

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                web.evaluateJavascript("(window.__back ? window.__back() : false)") { handled ->
                    if (handled != "true") moveTaskToBack(true)
                }
            }
        })

        cleanOldScans()
        // Only a fresh launch carries something new; a recreated activity would replay an old share.
        if (savedInstanceState == null && (intent.flags and Intent.FLAG_ACTIVITY_LAUNCHED_FROM_HISTORY) == 0) {
            handleIntent(intent)
        }
        Reminders.reschedule(this)

        web.loadUrl("https://${WebViewAssetLoader.DEFAULT_DOMAIN}/assets/www/index.html")
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        outState.putString("cameraFile", cameraFile)
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        handleIntent(intent)
    }

    override fun onDestroy() {
        bridge.shutdown()
        root.removeView(web)
        web.destroy()
        super.onDestroy()
    }

    // ---------------------------------------------------------------- intents in

    private fun handleIntent(intent: Intent?) {
        intent ?: return
        try {
            when (intent.action) {
                Intent.ACTION_PROCESS_TEXT -> {
                    val t = intent.getCharSequenceExtra(Intent.EXTRA_PROCESS_TEXT)?.toString()
                    if (!t.isNullOrBlank()) deliverShare(JSONObject().put("type", "text").put("text", t))
                }
                Intent.ACTION_SEND -> {
                    val type = intent.type ?: ""
                    if (type.startsWith("image/")) {
                        @Suppress("DEPRECATION")
                        val uri = intent.getParcelableExtra<Uri>(Intent.EXTRA_STREAM)
                        if (uri != null) {
                            val name = copyToScans(uri)
                            if (name != null) deliverShare(JSONObject().put("type", "image").put("file", name))
                        }
                    } else {
                        val t = intent.getStringExtra(Intent.EXTRA_TEXT)
                        if (!t.isNullOrBlank()) deliverShare(JSONObject().put("type", "text").put("text", t))
                    }
                }
                else -> {
                    val go = intent.getStringExtra("go")
                    if (!go.isNullOrBlank()) deliverShare(JSONObject().put("type", "go").put("route", go))
                }
            }
        } catch (e: Exception) {
            // A broken share must never crash the app.
        }
    }

    private fun deliverShare(obj: JSONObject) {
        if (pageReady) event("share", obj) else pendingShare = obj
    }

    /** Called by the page once it has booted; returns anything that was shared into the app. */
    fun takePendingShare(): String {
        pageReady = true
        val p = pendingShare
        pendingShare = null
        return p?.toString() ?: ""
    }

    // ---------------------------------------------------------------- launchers

    private fun registerLaunchers() {
        speechLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { res ->
            val req = speechReq ?: return@registerForActivityResult
            speechReq = null
            val list = if (res.resultCode == Activity.RESULT_OK)
                res.data?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS) else null
            if (list.isNullOrEmpty()) {
                callback(req, JSONObject().put("ok", false).put("error", "cancelled"))
            } else {
                callback(req, JSONObject().put("ok", true).put("results", JSONArray(list)))
            }
        }
        cameraLauncher = registerForActivityResult(ActivityResultContracts.TakePicture()) { ok ->
            val name = cameraFile
            cameraFile = null
            val req = scanReq
            scanReq = null
            val valid = ok && name != null && File(scansDir, name).length() > 0
            if (req != null) {
                if (valid) callback(req, JSONObject().put("ok", true).put("file", name))
                else callback(req, JSONObject().put("ok", false).put("error", "cancelled"))
            } else if (valid) {
                // Activity was recreated while the camera was open: hand the photo to the page anyway.
                deliverShare(JSONObject().put("type", "image").put("file", name))
            }
        }
        galleryLauncher = registerForActivityResult(ActivityResultContracts.GetContent()) { uri ->
            val req = scanReq
            scanReq = null
            val name = if (uri != null) copyToScans(uri) else null
            if (req != null) {
                if (name != null) callback(req, JSONObject().put("ok", true).put("file", name))
                else callback(req, JSONObject().put("ok", false).put("error", "cancelled"))
            } else if (name != null) {
                deliverShare(JSONObject().put("type", "image").put("file", name))
            }
        }
        notifLauncher = registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
            val req = notifReq
            notifReq = null
            if (req != null) callback(req, JSONObject().put("ok", granted))
        }
    }

    fun startListening(lang: String, prompt: String, req: String) {
        val i = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, lang)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, lang)
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5)
            if (prompt.isNotBlank()) putExtra(RecognizerIntent.EXTRA_PROMPT, prompt)
        }
        try {
            speechReq = req
            speechLauncher.launch(i)
        } catch (e: ActivityNotFoundException) {
            speechReq = null
            callback(req, JSONObject().put("ok", false).put("error", "unavailable"))
        } catch (e: Exception) {
            speechReq = null
            callback(req, JSONObject().put("ok", false).put("error", "failed"))
        }
    }

    fun startScan(source: String, req: String) {
        try {
            scanReq = req
            if (source == "camera") {
                val name = "scan_${System.currentTimeMillis()}.jpg"
                val file = File(scansDir, name)
                cameraFile = name
                val uri = FileProvider.getUriForFile(this, "$packageName.files", file)
                cameraLauncher.launch(uri)
            } else {
                galleryLauncher.launch("image/*")
            }
        } catch (e: Exception) {
            scanReq = null
            cameraFile = null
            callback(req, JSONObject().put("ok", false).put("error", "unavailable"))
        }
    }

    fun askNotifications(req: String) {
        if (Build.VERSION.SDK_INT < 33 || notificationsGranted()) {
            callback(req, JSONObject().put("ok", true))
            return
        }
        try {
            notifReq = req
            notifLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
        } catch (e: Exception) {
            notifReq = null
            callback(req, JSONObject().put("ok", false))
        }
    }

    fun notificationsGranted(): Boolean =
        Build.VERSION.SDK_INT < 33 ||
            ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) ==
            PackageManager.PERMISSION_GRANTED

    // ---------------------------------------------------------------- helpers

    private fun copyToScans(uri: Uri): String? = try {
        val name = "pick_${System.currentTimeMillis()}.jpg"
        contentResolver.openInputStream(uri)?.use { input ->
            File(scansDir, name).outputStream().use { out -> input.copyTo(out) }
        }
        if (File(scansDir, name).length() > 0) name else null
    } catch (e: Exception) {
        null
    }

    private fun cleanOldScans() {
        try {
            val files = scansDir.listFiles()?.sortedByDescending { it.lastModified() } ?: return
            files.drop(30).forEach { it.delete() }
        } catch (_: Exception) {
        }
    }

    fun openExternal(url: String): Boolean {
        return try {
            val uri = Uri.parse(url)
            val intent = when (uri.scheme) {
                "tel" -> Intent(Intent.ACTION_DIAL, uri)
                "mailto", "sms", "smsto" -> Intent(Intent.ACTION_SENDTO, uri)
                "http", "https", "geo", "market", "whatsapp" -> Intent(Intent.ACTION_VIEW, uri)
                else -> return false
            }
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            startActivity(intent)
            true
        } catch (e: Exception) {
            false
        }
    }

    fun setBars(bg: Int, lightIcons: Boolean) {
        root.setBackgroundColor(bg)
        val c = WindowCompat.getInsetsController(window, root)
        c.isAppearanceLightStatusBars = lightIcons
        c.isAppearanceLightNavigationBars = lightIcons
    }

    /** Answer a request made from JavaScript. */
    fun callback(req: String, payload: JSONObject) {
        val js = "window.__native && window.__native(${JSONObject.quote(req)}, $payload)"
        runOnUiThread { if (::web.isInitialized) web.evaluateJavascript(js, null) }
    }

    /** Push an unsolicited event to JavaScript. */
    fun event(name: String, payload: JSONObject) {
        val js = "window.__nativeEvent && window.__nativeEvent(${JSONObject.quote(name)}, $payload)"
        runOnUiThread { if (::web.isInitialized) web.evaluateJavascript(js, null) }
    }
}
