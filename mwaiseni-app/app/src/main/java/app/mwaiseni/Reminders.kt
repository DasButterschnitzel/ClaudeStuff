package app.mwaiseni

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import org.json.JSONArray
import java.util.Calendar

/** A gentle "word of the day" notification, once a day at the time she chose. */
object Reminders {
    private const val PREFS = "reminder"
    private const val CHANNEL = "daily_word"

    fun save(ctx: Context, enabled: Boolean, hour: Int, minute: Int, words: String) {
        ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
            .putBoolean("enabled", enabled)
            .putInt("hour", hour.coerceIn(0, 23))
            .putInt("minute", minute.coerceIn(0, 59))
            .putString("words", words)
            .apply()
    }

    private fun pending(ctx: Context): PendingIntent = PendingIntent.getBroadcast(
        ctx, 1, Intent(ctx, ReminderReceiver::class.java),
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )

    fun reschedule(ctx: Context) {
        try {
            val p = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            val am = ctx.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val pi = pending(ctx)
            am.cancel(pi)
            if (!p.getBoolean("enabled", false)) return
            val cal = Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, p.getInt("hour", 9))
                set(Calendar.MINUTE, p.getInt("minute", 0))
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
                if (timeInMillis <= System.currentTimeMillis() + 60_000) add(Calendar.DAY_OF_YEAR, 1)
            }
            am.setInexactRepeating(AlarmManager.RTC_WAKEUP, cal.timeInMillis, AlarmManager.INTERVAL_DAY, pi)
        } catch (_: Exception) {
        }
    }

    fun show(ctx: Context) {
        try {
            val p = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
            if (!p.getBoolean("enabled", false)) return
            val words = try { JSONArray(p.getString("words", "[]")) } catch (e: Exception) { JSONArray() }
            val day = (System.currentTimeMillis() / 86_400_000L).toInt()
            val word = if (words.length() > 0) words.optString(day % words.length()) else "Guten Tag — Good day"

            val nm = ctx.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            if (Build.VERSION.SDK_INT >= 26) {
                val ch = NotificationChannel(CHANNEL, ctx.getString(R.string.channel_daily), NotificationManager.IMPORTANCE_DEFAULT)
                ch.description = ctx.getString(R.string.channel_daily_desc)
                nm.createNotificationChannel(ch)
            }
            val open = PendingIntent.getActivity(
                ctx, 2,
                Intent(ctx, MainActivity::class.java).putExtra("go", "learn").addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP),
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            val n = android.app.Notification.Builder(ctx, CHANNEL)
                .setSmallIcon(R.drawable.ic_notify)
                .setColor(0xFFE8590C.toInt())
                .setContentTitle("🇩🇪 Word of the day")
                .setContentText(word)
                .setStyle(android.app.Notification.BigTextStyle().bigText("$word\n\nTap for 5 minutes of German. You can do it! 💪"))
                .setContentIntent(open)
                .setAutoCancel(true)
                .build()
            nm.notify(1001, n)
        } catch (_: Exception) {
        }
    }
}

class ReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        Reminders.show(context)
    }
}

class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        Reminders.reschedule(context)
    }
}
