package app.mwaiseni

import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.os.VibrationEffect
import android.os.Vibrator
import android.provider.CalendarContract
import android.speech.RecognizerIntent
import android.view.WindowManager
import android.webkit.JavascriptInterface
import com.google.mlkit.common.model.DownloadConditions
import com.google.mlkit.common.model.RemoteModelManager
import com.google.mlkit.nl.translate.TranslateLanguage
import com.google.mlkit.nl.translate.TranslateRemoteModel
import com.google.mlkit.nl.translate.Translation
import com.google.mlkit.nl.translate.Translator
import com.google.mlkit.nl.translate.TranslatorOptions
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.net.HttpURLConnection
import java.net.URL
import java.util.Locale
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Everything the web UI can ask the phone to do. Every method is defensive:
 * a missing voice, missing Google app or missing network must never crash.
 * Asynchronous answers go back through MainActivity.callback(reqId, json).
 */
class Bridge(private val act: MainActivity) {

    private val io = Executors.newCachedThreadPool()
    private val main = Handler(Looper.getMainLooper())
    private val voice = Speech(act)
    private val translators = HashMap<String, Translator>()

    fun shutdown() {
        voice.shutdown()
        translators.values.forEach { try { it.close() } catch (_: Exception) {} }
        io.shutdown()
    }

    // ------------------------------------------------------------------ boot

    @JavascriptInterface
    fun ready(): String = act.takePendingShare()

    @JavascriptInterface
    fun info(): String {
        val pm = act.packageManager
        val hasSpeech = try {
            pm.queryIntentActivities(Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH), 0).isNotEmpty()
        } catch (e: Exception) { false }
        return JSONObject()
            .put("version", BuildConfig.VERSION_NAME)
            .put("sdk", Build.VERSION.SDK_INT)
            .put("speech", hasSpeech)
            .put("tts", voice.available())
            .put("notifications", act.notificationsGranted())
            .toString()
    }

    // ------------------------------------------------------------------ voice out

    @JavascriptInterface
    fun speak(text: String, lang: String, rate: String, req: String) {
        voice.speak(text, lang, rate.toFloatOrNull() ?: 1.0f, req)
    }

    @JavascriptInterface
    fun stopSpeak() = voice.stop()

    @JavascriptInterface
    fun installVoices() = voice.installVoices()

    /** Engines, voices and the current choice, for the voice picker. */
    @JavascriptInterface
    fun voiceInfo(): String = try { voice.info().toString() } catch (e: Exception) { "{}" }

    /** lang = "de" | "en"; name = "" for automatic. */
    @JavascriptInterface
    fun setVoice(lang: String, name: String) = voice.setVoice(lang, name)

    /** pkg = "" for the phone's default engine. Answers {ok} when the engine is ready. */
    @JavascriptInterface
    fun setEngine(pkg: String, req: String) = voice.setEngine(pkg, req)

    // ------------------------------------------------------------------ voice in

    @JavascriptInterface
    fun listen(lang: String, prompt: String, req: String) {
        act.runOnUiThread { act.startListening(lang, prompt, req) }
    }

    // ------------------------------------------------------------------ translator (on-device)

    private fun mlLang(code: String): String =
        if (code.lowercase().startsWith("de")) TranslateLanguage.GERMAN else TranslateLanguage.ENGLISH

    private fun translator(src: String, tgt: String): Translator {
        val key = "$src>$tgt"
        return synchronized(translators) {
            translators.getOrPut(key) {
                Translation.getClient(
                    TranslatorOptions.Builder().setSourceLanguage(mlLang(src)).setTargetLanguage(mlLang(tgt)).build()
                )
            }
        }
    }

    /** Answers a request exactly once, or with [fallback] if nothing answered within [ms]. */
    private fun once(req: String, ms: Long, fallback: JSONObject): (JSONObject) -> Unit {
        val done = AtomicBoolean(false)
        val answer = { o: JSONObject -> if (done.compareAndSet(false, true)) act.callback(req, o) }
        main.postDelayed({ answer(fallback) }, ms)
        return answer
    }

    /**
     * texts = JSON array of strings. Answers {ok, out:[…]} in the same order.
     * The model download waits silently when there is no network, so never wait for it forever.
     */
    @JavascriptInterface
    fun translate(texts: String, src: String, tgt: String, req: String) {
        val answer = once(req, 45_000, JSONObject().put("ok", false).put("error", "model"))
        try {
            val arr = JSONArray(texts)
            val tr = translator(src, tgt)
            tr.downloadModelIfNeeded(DownloadConditions.Builder().build())
                .addOnSuccessListener {
                    val out = JSONArray()
                    fun step(i: Int) {
                        if (i >= arr.length()) {
                            answer(JSONObject().put("ok", true).put("out", out))
                            return
                        }
                        val s = arr.optString(i)
                        if (s.isBlank()) { out.put(""); step(i + 1); return }
                        tr.translate(s)
                            .addOnSuccessListener { t -> out.put(t); step(i + 1) }
                            .addOnFailureListener { out.put(""); step(i + 1) }
                    }
                    step(0)
                }
                .addOnFailureListener {
                    answer(JSONObject().put("ok", false).put("error", "model"))
                }
        } catch (e: Exception) {
            answer(JSONObject().put("ok", false).put("error", "failed"))
        }
    }

    /** Answers {ok:true, ready:bool}: is the German offline model on the phone? */
    @JavascriptInterface
    fun modelStatus(req: String) {
        try {
            RemoteModelManager.getInstance().getDownloadedModels(TranslateRemoteModel::class.java)
                .addOnSuccessListener { models ->
                    val have = models.map { it.language }
                    act.callback(req, JSONObject().put("ok", true).put("ready", have.contains(TranslateLanguage.GERMAN)))
                }
                .addOnFailureListener { act.callback(req, JSONObject().put("ok", false)) }
        } catch (e: Exception) {
            act.callback(req, JSONObject().put("ok", false))
        }
    }

    @JavascriptInterface
    fun downloadModel(req: String) {
        val answer = once(req, 150_000, JSONObject().put("ok", false).put("error", "model"))
        try {
            val model = TranslateRemoteModel.Builder(TranslateLanguage.GERMAN).build()
            RemoteModelManager.getInstance().download(model, DownloadConditions.Builder().build())
                .addOnSuccessListener { answer(JSONObject().put("ok", true)) }
                .addOnFailureListener { answer(JSONObject().put("ok", false).put("error", "model")) }
        } catch (e: Exception) {
            answer(JSONObject().put("ok", false).put("error", "failed"))
        }
    }

    // ------------------------------------------------------------------ camera + text recognition

    @JavascriptInterface
    fun scan(source: String, req: String) {
        act.runOnUiThread { act.startScan(source, req) }
    }

    /** Reads the text of a picture in the scans folder. Answers {ok, text, blocks:[…]}. */
    @JavascriptInterface
    fun ocr(fileName: String, req: String) {
        try {
            val file = File(act.scansDir, File(fileName).name)
            if (!file.exists()) {
                act.callback(req, JSONObject().put("ok", false).put("error", "nofile"))
                return
            }
            val image = InputImage.fromFilePath(act, Uri.fromFile(file))
            val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)
            recognizer.process(image)
                .addOnSuccessListener { result ->
                    val blocks = JSONArray()
                    result.textBlocks
                        .sortedWith(compareBy({ (it.boundingBox?.top ?: 0) / 40 }, { it.boundingBox?.left ?: 0 }))
                        .forEach { b ->
                            val lines = JSONArray()
                            b.lines.forEach { lines.put(it.text) }
                            blocks.put(JSONObject().put("text", b.text).put("lines", lines))
                        }
                    act.callback(req, JSONObject().put("ok", true).put("text", result.text).put("blocks", blocks))
                    recognizer.close()
                }
                .addOnFailureListener {
                    act.callback(req, JSONObject().put("ok", false).put("error", "ocr"))
                    recognizer.close()
                }
        } catch (e: Exception) {
            act.callback(req, JSONObject().put("ok", false).put("error", "ocr"))
        }
    }

    // ------------------------------------------------------------------ small web requests (weather, exchange rate)

    private val allowedHosts = setOf("api.open-meteo.com", "open.er-api.com")

    @JavascriptInterface
    fun httpGet(url: String, req: String) {
        io.execute {
            try {
                val u = URL(url)
                if (u.protocol != "https" || !allowedHosts.contains(u.host)) {
                    act.callback(req, JSONObject().put("ok", false).put("error", "host"))
                    return@execute
                }
                val c = u.openConnection() as HttpURLConnection
                c.connectTimeout = 8000
                c.readTimeout = 8000
                c.setRequestProperty("Accept", "application/json")
                val code = c.responseCode
                val body = (if (code in 200..299) c.inputStream else c.errorStream)?.bufferedReader()?.use { it.readText() } ?: ""
                c.disconnect()
                act.callback(req, JSONObject().put("ok", code in 200..299).put("status", code).put("body", body))
            } catch (e: Exception) {
                act.callback(req, JSONObject().put("ok", false).put("error", "network"))
            }
        }
    }

    // ------------------------------------------------------------------ phone integration

    @JavascriptInterface
    fun open(url: String): Boolean {
        var ok = false
        val latch = java.util.concurrent.CountDownLatch(1)
        act.runOnUiThread { ok = act.openExternal(url); latch.countDown() }
        try { latch.await(2, java.util.concurrent.TimeUnit.SECONDS) } catch (_: Exception) {}
        return ok
    }

    @JavascriptInterface
    fun share(text: String) {
        act.runOnUiThread {
            try {
                val i = Intent(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT, text)
                act.startActivity(Intent.createChooser(i, null))
            } catch (_: Exception) {}
        }
    }

    @JavascriptInterface
    fun calendar(title: String, startMillis: String, description: String) {
        act.runOnUiThread {
            try {
                val start = startMillis.toLongOrNull() ?: System.currentTimeMillis()
                val i = Intent(Intent.ACTION_INSERT)
                    .setData(CalendarContract.Events.CONTENT_URI)
                    .putExtra(CalendarContract.Events.TITLE, title)
                    .putExtra(CalendarContract.Events.DESCRIPTION, description)
                    .putExtra(CalendarContract.EXTRA_EVENT_BEGIN_TIME, start)
                    .putExtra(CalendarContract.EXTRA_EVENT_END_TIME, start + 60 * 60 * 1000)
                    .putExtra(CalendarContract.EXTRA_EVENT_ALL_DAY, true)
                act.startActivity(i)
            } catch (_: Exception) {}
        }
    }

    @JavascriptInterface
    fun haptic(kind: String) {
        try {
            @Suppress("DEPRECATION")
            val v = act.getSystemService(android.content.Context.VIBRATOR_SERVICE) as? Vibrator ?: return
            val effect = when (kind) {
                "ok" -> VibrationEffect.createWaveform(longArrayOf(0, 25, 60, 35), -1)
                "bad" -> VibrationEffect.createOneShot(120, 120)
                else -> VibrationEffect.createOneShot(12, 80)
            }
            v.vibrate(effect)
        } catch (_: Exception) {}
    }

    @JavascriptInterface
    fun keepAwake(on: Boolean) {
        act.runOnUiThread {
            if (on) act.window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
            else act.window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        }
    }

    @JavascriptInterface
    fun setBars(bgHex: String, lightIcons: Boolean) {
        act.runOnUiThread {
            try { act.setBars(Color.parseColor(bgHex), lightIcons) } catch (_: Exception) {}
        }
    }

    // ------------------------------------------------------------------ daily word notification

    @JavascriptInterface
    fun askNotifications(req: String) {
        act.runOnUiThread { act.askNotifications(req) }
    }

    /** words = JSON array of "German — English" strings; one is shown per day. */
    @JavascriptInterface
    fun setReminder(enabled: Boolean, hour: Int, minute: Int, words: String) {
        Reminders.save(act, enabled, hour, minute, words)
        Reminders.reschedule(act)
    }

    @JavascriptInterface
    fun exit() {
        act.runOnUiThread { act.moveTaskToBack(true) }
    }
}
