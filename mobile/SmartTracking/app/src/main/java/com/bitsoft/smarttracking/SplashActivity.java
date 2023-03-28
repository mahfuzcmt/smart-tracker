package com.bitsoft.smarttracking;

import static android.Manifest.permission.ACCESS_COARSE_LOCATION;
import static android.Manifest.permission.ACCESS_FINE_LOCATION;
import static com.bitsoft.smarttracking.service_utils.MyForegroundService.LOGINSYNC;
import static com.bitsoft.smarttracking.service_utils.MyForegroundService.USERID;
import static com.bitsoft.smarttracking.service_utils.MyForegroundService.USERTENANT;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.StrictMode;
import android.provider.Settings;
import android.util.Log;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Toast;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import com.bitsoft.smarttracking.utils.Constants;
import com.bitsoft.smarttracking.utils.HttpAsynRequest;
import com.bitsoft.smarttracking.utils.NetworkConnection;
import com.codestin.database_service.DatabaseMasterAnis;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import okhttp3.MediaType;
import okhttp3.RequestBody;

public class SplashActivity extends AppCompatActivity {
    public static final int MY_PERMISSION_REQUEST_CODE = 7000;
    SharedPreferences sharedPreferences;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        sharedPreferences = getSharedPreferences(DatabaseMasterAnis.SMARTTRACK_DATA_CODE, Context.MODE_PRIVATE);
        hideSystemUi();
    }

    private void setUpDeviceID() {
        if (NetworkConnection.isOnline(SplashActivity.this)) {
            setUpDevieWithId(Build.ID);
        } else {
            offlineAlert();
        }
    }

    private void setUpDevieWithId(final String deviceID) {
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
                obj.put("deviceMac", deviceID);
                RequestBody body = (RequestBody) RequestBody.create(mediaType, String.valueOf(obj));
                //Log.d("URL ",Constants.BASEURL + Constants.SETDEVICEBYID);
                //Log.d("REQUEST",String.valueOf(obj));
                HttpAsynRequest httpRequest = new HttpAsynRequest();
                response = httpRequest.sendRequest(body, Constants.BASEURL + Constants.SETDEVICEBYID);
            } catch (Exception e) {
                e.printStackTrace();
                response = null;
            }
            String res = response;
            handler.post(() -> {
                if (res == null || res.isEmpty()) {
                    showRetry(deviceID);
                    return;
                } else {
                    Log.d("Resulttt ", res);
                    try {
                        JSONObject jsonObject = new JSONObject(res);
                        if (jsonObject.getString("status").equalsIgnoreCase("success")) {
                            JSONObject object = jsonObject.getJSONObject("userData");
                            int userId = object.isNull("userId") ? null : object.getInt("userId");
                            int loginSync = object.isNull("syncLocInMin") ? 0 : object.getInt("syncLocInMin");
                            String DEVICEMAC = object.isNull("deviceMac") ? null : object.getString("deviceMac");
                            String ORGNAME = object.isNull("orgName") ? null : object.getString("orgName");
                            String TENANTID = object.isNull("tenantId") ? null : object.getString("tenantId");
                            Constants.USERID = userId;
                            Constants.LOGINSYNC = loginSync;
                            Constants.DEVICEMAC = DEVICEMAC;
                            Constants.ORGNAME = ORGNAME;
                            Constants.TENANTID = TENANTID;
                            SharedPreferences.Editor editor = sharedPreferences.edit();
                            editor.putInt(USERID, Constants.USERID);
                            editor.putString(USERTENANT, Constants.TENANTID);
                            editor.putInt(LOGINSYNC, Constants.LOGINSYNC);
                            editor.apply();
                            startActivity(new Intent(SplashActivity.this, DeviceInfoActivity.class));
                            finish();
                        } else if (jsonObject.getString("status").equalsIgnoreCase("warning")) {
                            showRetry(deviceID);
                        } else {
                            showRetry(deviceID);
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                        showRetry(deviceID);
                    }
                }
            });
        });
    }

    private void showRetry(String deviceID) {
        AlertDialog.Builder dialog = new AlertDialog.Builder(this);
        dialog.setTitle("Note!");
        dialog.setMessage("You're not an authorized user with your device ID " + deviceID);
        dialog.setCancelable(false);
        dialog.setPositiveButton("Retry", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
                setUpDevieWithId(Build.ID);
            }

        });
        dialog.setNegativeButton("Close", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int which) {
                dialogInterface.dismiss();
                finishAffinity();
                System.exit(0);
            }
        });
        dialog.show();
    }

    private void hideSystemUi() {
        ActionBar actionBar = getSupportActionBar();
        if (actionBar != null) {
            actionBar.hide();
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Window w = getWindow(); // in Activity's onCreate() for insta\
            w.setFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS, WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
            w.setNavigationBarColor(Color.TRANSPARENT);
        }

    }

    @Override
    public void onBackPressed() {
        doCloseApp();
    }

    public void offlineAlert() {
        AlertDialog.Builder dialog = new AlertDialog.Builder(SplashActivity.this);
        dialog.setTitle("No Internet Connection!");
        dialog.setMessage("Please turn on WiFi or Mobile Data.");
        dialog.setCancelable(false);
        dialog.setPositiveButton("Not Now", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                dialogInterface.dismiss();
                finish();
            }
        });
        dialog.setNegativeButton("Retry", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int which) {
                dialogInterface.dismiss();
                setUpDeviceID();
            }
        });
        dialog.show();
    }

    public void doCloseApp() {
        AlertDialog.Builder dialog = new AlertDialog.Builder(SplashActivity.this);
        dialog.setTitle("Alert!");
        dialog.setMessage("Are you want to close APP?");
        dialog.setCancelable(false);
        dialog.setPositiveButton("Yes", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                dialogInterface.dismiss();
                finishAffinity();
                System.exit(0);
            }
        });
        dialog.setNegativeButton("No", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int which) {
                dialogInterface.dismiss();
            }
        });
        dialog.show();
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

    private Boolean getPermission() {
        if (ActivityCompat.checkSelfPermission(this, ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, ACCESS_COARSE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {

            ActivityCompat.requestPermissions(this, new String[]{
                            ACCESS_FINE_LOCATION,
                            ACCESS_COARSE_LOCATION}
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
                        setUpDeviceID();
                        return;
                    }
                }
            default:
                super.onRequestPermissionsResult(requestCode, permissions, grantResults);
                return;
        }
    }

    @Override
    protected void onStart() {
        super.onStart();
        if (getPermission()) {
            setUpDeviceID();
        }
    }
}