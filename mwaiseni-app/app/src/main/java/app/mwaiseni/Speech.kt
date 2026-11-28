package app.mwaiseni

import android.content.Context
import android.content.Intent
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.speech.tts.Voice
import org.json.JSONArray
import org.json.JSONObject
import java.util.Locale
import java.util.concurrent.ConcurrentHashMap

/**
 * Text-to-speech that sounds as good as the phone allows.
 *
 * Android's default is often a weak engine or a low-quality voice. This picks the engine
 * (Google's when installed), then the best installed voice per language, remembers a voice
 * she picked herself, and falls back to a local voice when an online voice has no network.
 */
class Speech(private val act: MainActivity) {

    companion object {
        const val GOOGLE = "com.google.android.tts"
    }

    private data class Job(val text: String, val lang: String, val rate: Float, val req: String, val voice: String? = null)

    private val prefs = act.getSharedPreferences("speech", Context.MODE_PRIVATE)
    private val main = Handler(Looper.getMainLooper())
    private val jobs = ConcurrentHashMap<String, Job>()
    private val retried = ConcurrentHashMap.newKeySet<String>()

    @Volatile private var tts: TextToSpeech? = null
    @Volatile private var ready = false
    @Volatile private var failed = false
    @Volatile private var enginePkg: String? = null
    @Volatile private var pending: Job? = null
    @Volatile private var engineReq: String? = null
    private var gen = 0
    private val defaults = HashMap<String, String?>()   // engine's own default voice per language

    init {
        main.post { start(preferredEngine(), false) }
    }

    fun shutdown() {
        try { tts?.stop(); tts?.shutdown() } catch (_: Exception) {}
    }

    // ---------------------------------------------------------------- engines

    /** Installed text-to-speech engines: package → label. */
    fun engines(): List<Pair<String, String>> = try {
        val pm = act.packageManager
        pm.queryIntentServices(Intent(TextToSpeech.Engine.INTENT_ACTION_TTS_SERVICE), 0)
            .map { it.serviceInfo.packageName to it.loadLabel(pm).toString() }
            .distinctBy { it.first }
    } catch (e: Exception) {
        emptyList()
    }

    private fun preferredEngine(): String? {
        val installed = engines().map { it.first }
        val saved = prefs.getString("engine", null)
        if (!saved.isNullOrEmpty() && saved in installed) return saved
        if (GOOGLE in installed) return GOOGLE          // the most natural voices on Android
        return null                                        // whatever the phone uses
    }

    /** Must run on the main thread. */
    private fun start(pkg: String?, isFallback: Boolean) {
        val my = ++gen
        ready = false
        failed = false
        defaults.clear()
        try { tts?.stop(); tts?.shutdown() } catch (_: Exception) {}
        enginePkg = pkg
        val listener = TextToSpeech.OnInitListener { status -> main.post { onInit(my, status, pkg, isFallback) } }
        tts = try {
            if (pkg != null) TextToSpeech(act.applicationContext, listener, pkg)
            else TextToSpeech(act.applicationContext, listener)
        } catch (e: Exception) {
            null
        }
        if (tts == null) {
            if (pkg != null && !isFallback) start(null, true) else finishInit(false)
        }
    }

    private fun onInit(my: Int, status: Int, pkg: String?, isFallback: Boolean) {
        if (my != gen) return
        if (status != TextToSpeech.SUCCESS) {
            if (pkg != null && !isFallback) { start(null, true); return }   // chosen engine broken: use the phone's default
            finishInit(false)
            return
        }
        if (pkg == null) enginePkg = try { tts?.defaultEngine } catch (e: Exception) { null }
        tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
            override fun onStart(id: String) {}
            override fun onDone(id: String) {
                jobs.remove(id); retried.remove(id)
                act.callback(id, JSONObject().put("ok", true))
            }
            @Deprecated("Deprecated in Java")
            override fun onError(id: String) = failJob(id, TextToSpeech.ERROR)
            override fun onError(id: String, code: Int) = failJob(id, code)
            override fun onStop(id: String, interrupted: Boolean) {
                jobs.remove(id); retried.remove(id)
                act.callback(id, JSONObject().put("ok", false).put("error", "stopped"))
            }
        })
        finishInit(true)
    }

    private fun finishInit(ok: Boolean) {
        ready = ok
        failed = !ok
        engineReq?.let { act.callback(it, JSONObject().put("ok", ok)) }
        engineReq = null
        val p = pending
        pending = null
        if (p != null) {
            if (ok) speakNow(p, false) else act.callback(p.req, JSONObject().put("ok", false).put("error", "notts"))
        }
    }

    /** Switch engine ("" = phone default). Answers when the new engine is ready. */
    fun setEngine(pkg: String, req: String) {
        prefs.edit().putString("engine", pkg).remove("voice_de").remove("voice_en").apply()
        main.post {
            engineReq?.let { act.callback(it, JSONObject().put("ok", false)) }
            engineReq = req
            start(pkg.ifEmpty { null }, false)
        }
    }

    // ---------------------------------------------------------------- voices

    private fun installed(v: Voice): Boolean =
        !(v.features?.contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED) ?: false)

    private fun voicesFor(lang: String): List<Voice> = try {
        (tts?.voices ?: emptySet()).filter { it.locale.language == lang && !it.name.endsWith("-language") }
    } catch (e: Exception) {
        emptyList()
    }

    private fun online(): Boolean = try {
        val cm = act.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val caps = cm.getNetworkCapabilities(cm.activeNetwork)
        caps != null && caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)
    } catch (e: Exception) {
        false
    }

    /** The voice the engine itself would use for this language (usually a good one). */
    private fun engineDefault(loc: Locale): String? {
        val key = loc.toLanguageTag()
        if (defaults.containsKey(key)) return defaults[key]
        val name = try {
            val t = tts
            if (t != null && t.setLanguage(loc) >= TextToSpeech.LANG_AVAILABLE) t.voice?.name else null
        } catch (e: Exception) {
            null
        }
        defaults[key] = name
        return name
    }

    private fun bestLocal(loc: Locale): Voice? {
        val local = voicesFor(loc.language).filter { installed(it) && !it.isNetworkConnectionRequired }
        if (local.isEmpty()) return null
        val def = engineDefault(loc)
        return local.maxWithOrNull(
            compareBy<Voice>({ it.locale.country.equals(loc.country, true) }, { it.quality }, { it.name == def }, { -it.latency })
        )
    }

    private fun pickVoice(loc: Locale, forceLocal: Boolean): Voice? {
        val all = voicesFor(loc.language)
        if (!forceLocal) {
            val saved = prefs.getString("voice_${loc.language}", null)
            val v = all.firstOrNull { it.name == saved }
            if (v != null && installed(v) && (!v.isNetworkConnectionRequired || online())) return v
        }
        bestLocal(loc)?.let { return it }
        if (forceLocal || !online()) return null
        return all.filter { it.isNetworkConnectionRequired && it.locale.country.equals(loc.country, true) }
            .maxByOrNull { it.quality }
            ?: all.filter { it.isNetworkConnectionRequired }.maxByOrNull { it.quality }
    }

    fun setVoice(lang: String, name: String) {
        if (name.isEmpty()) prefs.edit().remove("voice_$lang").apply()
        else prefs.edit().putString("voice_$lang", name).apply()
    }

    // ---------------------------------------------------------------- speaking

    fun speak(text: String, lang: String, rate: Float, req: String) {
        val job = Job(text, lang, rate, req)
        if (failed && !ready) {
            act.callback(req, JSONObject().put("ok", false).put("error", "notts"))
            return
        }
        if (!ready) {
            pending?.let { act.callback(it.req, JSONObject().put("ok", false).put("error", "stopped")) }
            pending = job
            return
        }
        speakNow(job, false)
    }

    private fun speakNow(job: Job, forceLocal: Boolean) {
        val t = tts
        if (t == null) {
            act.callback(job.req, JSONObject().put("ok", false).put("error", "notts"))
            return
        }
        try {
            val loc = Locale.forLanguageTag(job.lang)
            val v = pickVoice(loc, forceLocal)
            var ok = v != null && t.setVoice(v) == TextToSpeech.SUCCESS
            if (!ok) {
                val res = t.setLanguage(loc)
                if (res == TextToSpeech.LANG_MISSING_DATA || res == TextToSpeech.LANG_NOT_SUPPORTED) {
                    act.callback(job.req, JSONObject().put("ok", false).put("error", "novoice"))
                    return
                }
                ok = true
            }
            t.setSpeechRate(job.rate)
            t.setPitch(1.0f)
            jobs[job.req] = job.copy(voice = if (v != null) v.name else null)
            val params = Bundle()
            val r = t.speak(job.text, TextToSpeech.QUEUE_FLUSH, params, job.req)
            if (r != TextToSpeech.SUCCESS) {
                jobs.remove(job.req)
                act.callback(job.req, JSONObject().put("ok", false).put("error", "tts"))
            }
        } catch (e: Exception) {
            jobs.remove(job.req)
            act.callback(job.req, JSONObject().put("ok", false).put("error", "tts"))
        }
    }

    private fun failJob(id: String, code: Int) {
        val job = jobs.remove(id)
        val networkTrouble = code == TextToSpeech.ERROR_NETWORK || code == TextToSpeech.ERROR_NETWORK_TIMEOUT ||
            code == TextToSpeech.ERROR_NOT_INSTALLED_YET || code == TextToSpeech.ERROR_SERVICE
        if (job != null && networkTrouble && retried.add(id)) {
            main.post { speakNow(job, true) }        // try once more with a voice that lives on the phone
            return
        }
        retried.remove(id)
        act.callback(id, JSONObject().put("ok", false).put("error", "tts"))
    }

    fun stop() {
        try { tts?.stop() } catch (_: Exception) {}
    }

    fun available(): Boolean = !failed || ready

    /** Opens the engine's own screen for downloading voices. */
    fun installVoices() {
        main.post {
            val pkg = enginePkg
            val tries = listOfNotNull(
                Intent(TextToSpeech.Engine.ACTION_INSTALL_TTS_DATA).apply { if (pkg != null) setPackage(pkg) },
                Intent(TextToSpeech.Engine.ACTION_INSTALL_TTS_DATA),
                Intent("com.android.settings.TTS_SETTINGS")
            )
            for (i in tries) {
                try {
                    act.startActivity(i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
                    return@post
                } catch (_: Exception) {
                }
            }
        }
    }

    // ---------------------------------------------------------------- info for the settings screen

    fun info(): JSONObject {
        val o = JSONObject().put("ready", ready).put("failed", failed && !ready)
        val engines = engines()
        o.put("engine", enginePkg ?: "")
        o.put("engineLabel", engines.firstOrNull { it.first == enginePkg }?.second ?: "")
        o.put("google", engines.any { it.first == GOOGLE })
        o.put("engines", JSONArray().apply { engines.forEach { put(JSONObject().put("pkg", it.first).put("label", it.second)) } })
        o.put("online", online())
        if (!ready) return o
        for ((lang, loc) in listOf("de" to Locale.GERMANY, "en" to Locale.UK)) {
            val chosen = prefs.getString("voice_$lang", "") ?: ""
            val auto = pickVoice(loc, false)?.name ?: ""
            val arr = JSONArray()
            voicesFor(lang)
                .sortedWith(compareBy<Voice>({ !it.locale.country.equals(loc.country, true) }, { it.isNetworkConnectionRequired }, { -it.quality }, { it.name }))
                .forEach { v ->
                    arr.put(
                        JSONObject().put("name", v.name).put("country", v.locale.country)
                            .put("quality", v.quality).put("network", v.isNetworkConnectionRequired)
                            .put("installed", installed(v))
                    )
                }
            o.put(lang, JSONObject().put("voices", arr).put("chosen", chosen).put("auto", auto))
        }
        return o
    }
}
