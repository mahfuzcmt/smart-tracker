package com.codestin.background_service;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.Nullable;

public class ServiceMasterAnis extends Service {

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        final String CHANNELID = "Foreground Service ID";
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = null;
            Notification.Builder notification = null;

            channel = new NotificationChannel(CHANNELID, CHANNELID, NotificationManager.IMPORTANCE_LOW);
            getSystemService(NotificationManager.class).createNotificationChannel(channel);
            notification = new Notification.Builder(this, CHANNELID).setContentText("Smart Tracking").setContentTitle("Smart Tracking").setSmallIcon(R.drawable.ic_launcher_background);
            startForeground(1001, notification.build());

        }
        return super.onStartCommand(intent, flags, startId);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
