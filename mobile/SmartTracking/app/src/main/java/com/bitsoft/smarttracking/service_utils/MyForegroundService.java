package com.bitsoft.smarttracking.service_utils;

import static com.bitsoft.smarttracking.utils.Constants.STARTTIME;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.location.Location;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.StrictMode;
import android.util.Log;

import androidx.annotation.Nullable;

import com.bitsoft.smarttracking.utils.Constants;
import com.bitsoft.smarttracking.utils.DeviceInfo;
import com.bitsoft.smarttracking.utils.GPSTrack;
import com.bitsoft.smarttracking.utils.HttpAsynRequest;
import com.bitsoft.smarttracking.utils.NetworkConnection;
import com.codestin.background_service.ServiceMasterAnis;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.Timer;
import java.util.TimerTask;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import okhttp3.MediaType;
import okhttp3.RequestBody;

public class MyForegroundService extends ServiceMasterAnis {

    private Timer timer;
    private Handler mHandler = new Handler(Looper.getMainLooper());
    private TimerTask timerTask;
    public static final String SMARTTRACE = "smartracing";
    public static final String USERID = "userIdKey";
    public static final String USERTENANT = "userTenantKey";
    public static final String LOGINSYNC = "loginSyncKey";
    public static final String USERLAT = "userLatKey";
    public static final String USERLNG = "userLngKey";
    SharedPreferences sharedpreferences;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        startTimer();
        return super.onStartCommand(intent, flags, startId);
    }

    public void stoptimertask() {
        if (timer != null) {
            timer.cancel();
            timer = null;
        }
    }

    public void startTimer() {
        sharedpreferences = getSharedPreferences(SMARTTRACE, Context.MODE_PRIVATE);
        if (Constants.LOGINSYNC < 1) {
            Constants.LOGINSYNC = sharedpreferences.getInt(LOGINSYNC, 0);
        }
        timer = new Timer();
        timerTask = new TimerTask() {
            public void run() {
                mHandler.post(new Runnable() {
                    @Override
                    public void run() {
                        Log.d("ServiceAnis", "Service is Running");
                        if (NetworkConnection.isOnline(getApplicationContext())) {
                            informationSent(getApplicationContext());
                        }
                    }
                });
            }
        };
        timer.schedule(timerTask, Constants.LOGINSYNC * STARTTIME, Constants.LOGINSYNC * STARTTIME);
    }

    public void informationSent(Context context) {
        GPSTrack gpsTrack = new GPSTrack(context);
        if (gpsTrack.getLocation() != null) {
            Location mLastLocation = gpsTrack.getLocation();
            SharedPreferences.Editor editor = sharedpreferences.edit();
            editor.putLong("LAT", (long) mLastLocation.getLatitude());
            editor.putLong("LNG", (long) mLastLocation.getLongitude());
            editor.commit();
        }
        String mac_address = DeviceInfo.getMACAddress("wlan0");
        String android_id = DeviceInfo.getAndroidID(context);
        String os_version = System.getProperty("os.version"); // OS version
        String android_sdk = Build.VERSION.SDK;     // API Level
        String brand = Build.BRAND;          // Device
        String device_name = Build.MODEL;            // Model
        String device_manufacturer = Build.MANUFACTURER;
        int battery_life = DeviceInfo.getBatteryPercentage(context);
        JSONObject deviceInfo = new JSONObject();
        JSONArray locationList = new JSONArray();
        JSONObject locationItem = new JSONObject();
        try {

            int userid = sharedpreferences.getInt(USERID, 0);
            String tenantid = sharedpreferences.getString(USERTENANT, "n/a");
            String latitute = sharedpreferences.getString(USERLAT, "0.0");
            String longitute = sharedpreferences.getString(USERLNG, "0.0");

            deviceInfo.put("mac_address", mac_address);
            deviceInfo.put("android_id", android_id);
            deviceInfo.put("os_version", os_version);
            deviceInfo.put("android_sdk", android_sdk);
            deviceInfo.put("brand", brand);
            deviceInfo.put("device_name", device_name);
            deviceInfo.put("device_manufacturer", device_manufacturer);

            locationItem.put("charge", battery_life + "%");
            locationItem.put("lat", String.format("%.8f", Double.valueOf(latitute)));
            locationItem.put("lng", String.format("%.8f", Double.valueOf(longitute)));
            locationItem.put("datetime", new SimpleDateFormat("yyyy-MM-dd HH:mm aa", Locale.getDefault()).format(new Date()));

            locationList.put(locationItem);

            saveDeviceInfo(userid, deviceInfo, locationList, tenantid, context);

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public void saveDeviceInfo(final int id, final JSONObject deviceInfo, final JSONArray locationList, final String tenant, final Context context) {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Handler handler = new Handler(Looper.getMainLooper());
        executor.execute(() -> {
            String response = null;
            handler.post(() -> {
                Log.d("TAGGGGGGG", "Operation Started");
            });
            StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
            StrictMode.setThreadPolicy(policy);
            final MediaType mediaType = MediaType.parse("application/json; charset=utf-8");
            try {
                JSONObject obj = new JSONObject();
                obj.put("userId", id);
                obj.put("locations", locationList);
                obj.put("deviceInfo", deviceInfo);
                obj.put("tenantId", tenant);
                RequestBody body = (RequestBody) RequestBody.create(mediaType, String.valueOf(obj));
                HttpAsynRequest httpRequest = new HttpAsynRequest();
                response = httpRequest.sendRequest(body, Constants.BASEURL + Constants.SAVEURL);
            } catch (Exception e) {
                e.printStackTrace();
                response = null;
            }
            String res = response;
            handler.post(() -> {
                if (res == null || res.isEmpty()) {
                    Log.d("TAGGGGGGG", "Nullll");
                    return;
                } else {
                    try {
                        JSONObject jsonObject = new JSONObject(res);
                        String status = jsonObject.isNull("status") ? "null" : jsonObject.getString("status");
                        if (status.equals("success")) {
                            int LOGINSYNC = jsonObject.isNull("syncLocInMin") ? Constants.LOGINSYNC : jsonObject.getInt("syncLocInMin");
                            if (LOGINSYNC != Constants.LOGINSYNC) {
                                Constants.LOGINSYNC = LOGINSYNC;
                                stoptimertask();
                                startTimer();
                            }
                            Log.d("TAGGGGGGG", "SUCCESS");
                        } else {
                            Log.d("TAGGGGGGG", "Failed");
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                        Log.d("TAGGGGGGG", "Exception");
                    }
                }
            });
        });
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
