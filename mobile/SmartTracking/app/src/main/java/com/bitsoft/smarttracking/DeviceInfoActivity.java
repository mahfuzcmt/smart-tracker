package com.bitsoft.smarttracking;

import static android.Manifest.permission.ACCESS_COARSE_LOCATION;
import static android.Manifest.permission.ACCESS_FINE_LOCATION;
import static android.Manifest.permission.READ_EXTERNAL_STORAGE;
import static android.Manifest.permission.WRITE_EXTERNAL_STORAGE;
import static com.bitsoft.smarttracking.service_utils.MyForegroundService.USERLAT;
import static com.bitsoft.smarttracking.service_utils.MyForegroundService.USERLNG;

import android.app.ActivityManager;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.Typeface;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.net.wifi.WifiManager;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.bitsoft.smarttracking.service_utils.MyBroadcastReceiver;
import com.bitsoft.smarttracking.service_utils.MyForegroundService;
import com.bitsoft.smarttracking.utils.Constants;
import com.bitsoft.smarttracking.utils.DeviceInfo;
import com.bitsoft.smarttracking.utils.GPSTrack;
import com.bitsoft.smarttracking.utils.NetworkConnection;
import com.bitsoft.smarttracking.utils.UtilMac;
import com.codestin.database_service.DatabaseMasterAnis;

public class DeviceInfoActivity extends AppCompatActivity {
    public static final int MY_PERMISSION_REQUEST_CODE = 7000;
    WifiManager wifiManager;
    LinearLayout infoLayout;
    SharedPreferences sharedPreferences;
    Intent mServiceIntent;
    private MyForegroundService mYourService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_device_info);
        sharedPreferences = getSharedPreferences(DatabaseMasterAnis.SMARTTRACK_DATA_CODE, Context.MODE_PRIVATE);
        wifiManager = (WifiManager) getApplicationContext().getSystemService(Context.WIFI_SERVICE);
        infoLayout = (LinearLayout) findViewById(R.id.device_info_layout);
        getDeviceInfo();
        if (getPermission()) {
            locationUpdate();
        }
        mYourService = new MyForegroundService();
        mServiceIntent = new Intent(this, mYourService.getClass());
        if (!isMyServiceRunning(mYourService.getClass())) {
            startService(mServiceIntent);
        }
        Toast.makeText(getApplicationContext(), "Service Start after " + Constants.LOGINSYNC + " Minutes", Toast.LENGTH_SHORT).show();
    }

    private boolean isMyServiceRunning(Class<?> serviceClass) {
        ActivityManager manager = (ActivityManager) getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : manager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                Log.i("Service status", "Running");
                return true;
            }
        }
        Log.i("Service status", "Not running");
        return false;
    }

    private void locationUpdate() {
        GPSTrack gpsTrack = new GPSTrack(getApplicationContext());
        if (gpsTrack.getLocation() != null) {
            SharedPreferences.Editor editor = sharedPreferences.edit();
            editor.putString(USERLAT, String.valueOf(gpsTrack.getLocation().getLatitude()));
            editor.putString(USERLNG, String.valueOf(gpsTrack.getLocation().getLongitude()));
            editor.commit();
        }
    }

    private void getDeviceInfo() {
        String wMac = "Unavailable", ipaddress = "Unavailable";
        ConnectivityManager connectivityManager = (ConnectivityManager) this.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = connectivityManager.getActiveNetworkInfo();

        String status = "DISCONNECTED", networkType = "Unavailable";
        if (NetworkConnection.isOnline(DeviceInfoActivity.this)) {
            status = "CONNECTED";
            networkType = networkInfo.getTypeName();
            ipaddress = UtilMac.getIPAddress(true);
        }
        if (wifiManager.isWifiEnabled()) {
            wMac = UtilMac.getMACAddress("wlan0");

        }
        int battery_life = DeviceInfo.getBatteryPercentage(getApplicationContext());
        String androidID = Settings.Secure.getString(getContentResolver(), Settings.Secure.ANDROID_ID);
        String CONSTATE[] = {"Connection Status", status};
        String CONTYPE[] = {"Connection Type", networkType};
        String ANDROID[] = {"Android ID", androidID};
        String ID[] = {"Device ID", Build.ID};
        String WLANMAC[] = {"MAC Address", wMac};
        String IP[] = {"IP Address", ipaddress};
        String OSNAME[] = {"OS Name ", System.getProperty("os.name")};
        String RELEASE[] = {"Android Version", Build.VERSION.RELEASE};
        String DEVICE[] = {"Device Name", Build.DEVICE};
        String BATTERY[] = {"Battery Charge", battery_life + "%"};
        String APILEVEL[] = {"API Level", Build.VERSION.SDK_INT + ""};
        String MODEL[] = {"Model", Build.MODEL};
        String BRAND[] = {"Brand", Build.BRAND};
        String MANUFACTURER[] = {"Manufacturer", Build.MANUFACTURER};
        infoLayout.removeAllViews();
        String[][] deviceInfo = {CONSTATE, CONTYPE, WLANMAC, IP, ANDROID, ID, RELEASE, APILEVEL, DEVICE, BATTERY, OSNAME, MODEL, BRAND, MANUFACTURER};
        buildInfoLayout(deviceInfo, DeviceInfoActivity.this);
    }

    private void buildInfoLayout(String[][] deviceInfo, Context deviceInfoActivity) {
        for (int j = 0; j < deviceInfo.length; j++) {
            LinearLayout singleInfo = new LinearLayout(deviceInfoActivity);
            singleInfo.setLayoutParams(new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT));
            singleInfo.setOrientation(LinearLayout.HORIZONTAL);
            singleInfo.setWeightSum(1);
            TextView tv1 = new TextView(deviceInfoActivity);
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.MATCH_PARENT);
            params.weight = 0.4f;
            tv1.setPadding(0, 5, 0, 10);
            tv1.setLayoutParams(params);
            tv1.setGravity(Gravity.RIGHT);
            tv1.setTextSize(16);
            tv1.setText(deviceInfo[j][0] + " :");
            tv1.setTextColor(Color.BLACK);
            tv1.setTypeface(null, Typeface.BOLD);
            TextView tv2 = new TextView(deviceInfoActivity);
            LinearLayout.LayoutParams params2 = new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.MATCH_PARENT);
            params2.weight = 0.6f;
            tv2.setPadding(10, 5, 0, 10);
            tv2.setLayoutParams(params2);
            tv2.setGravity(Gravity.LEFT);
            tv2.setText(deviceInfo[j].length == 1 ? "N/A" : deviceInfo[j][1]);
            tv2.setTextSize(18);
            tv2.setTextColor(Color.BLACK);
            singleInfo.addView(tv1);
            singleInfo.addView(tv2);
            singleInfo.setBackground(ContextCompat.getDrawable(deviceInfoActivity, R.drawable.layout_bottom_border));
            infoLayout.addView(singleInfo);
        }
    }

    private Boolean getPermission() {
        if (ActivityCompat.checkSelfPermission(this, ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(this, ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(this, WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED
                && ActivityCompat.checkSelfPermission(this, READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED
        ) {

            ActivityCompat.requestPermissions(this, new String[]{
                            ACCESS_FINE_LOCATION,
                            ACCESS_COARSE_LOCATION,
                            WRITE_EXTERNAL_STORAGE,
                            READ_EXTERNAL_STORAGE}
                    , MY_PERMISSION_REQUEST_CODE);
            return false;
        } else {
            return true;
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions,
                                           int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case MY_PERMISSION_REQUEST_CODE:
                for (int i = 0; i < grantResults.length; i++) {
                    if (grantResults.length > 0 && grantResults[i] == PackageManager.PERMISSION_DENIED) {
                        showAlert("Permission Denied", "Please goto settings and give permission");
                        return;
                    } else if (grantResults.length > 0 && grantResults[i] == PackageManager.PERMISSION_GRANTED) {
                        locationUpdate();
                    }

                }
            default:
                super.onRequestPermissionsResult(requestCode, permissions, grantResults);
                return;
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.list:
                startActivity(new Intent(this, ListActivity.class));
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    private void showAlert(String title, final String msg) {
        AlertDialog.Builder dialog = new AlertDialog.Builder(this);
        dialog.setTitle(title);
        dialog.setMessage(msg);
        dialog.setCancelable(false);

        dialog.setPositiveButton("Go to Settings", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
                openPermissionSettings();

            }

        });
        dialog.setNegativeButton("No", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int which) {
                dialogInterface.dismiss();
                Toast.makeText(getApplicationContext(), msg, Toast.LENGTH_SHORT).show();
            }
        });
        dialog.show();
    }

    private void openPermissionSettings() {
        Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse(("package:" + getPackageName())));
        intent.addCategory(Intent.CATEGORY_DEFAULT);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);

    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        finish();
    }

    @Override
    protected void onDestroy() {
        Intent broadcastIntent = new Intent();
        broadcastIntent.setAction("restartservice");
        broadcastIntent.setClass(this, MyBroadcastReceiver.class);
        this.sendBroadcast(broadcastIntent);
        super.onDestroy();
    }
}