package com.bitsoft.smarttracking;

import android.content.DialogInterface;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.StrictMode;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.bitsoft.smarttracking.adapter.LocAdapter;
import com.bitsoft.smarttracking.model.LocModel;
import com.bitsoft.smarttracking.utils.Constants;
import com.bitsoft.smarttracking.utils.HttpAsynRequest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import okhttp3.MediaType;
import okhttp3.RequestBody;

public class ListActivity extends AppCompatActivity {

    ArrayList<LocModel> locModelArrayList;
    LocAdapter locAdapter;
    ListView listViewLoc;
    ProgressBar progressBar;
    TextView loadingText, emptyText;
    AlertDialog waitingDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_list);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        listViewLoc = (ListView) findViewById(R.id.loc_list_view);
        emptyText = (TextView) findViewById(R.id.empty_text);
        listViewLoc.setVisibility(View.GONE);
        emptyText.setVisibility(View.VISIBLE);
        locModelArrayList = new ArrayList<>();
        AlertDialog.Builder dialog = new AlertDialog.Builder(ListActivity.this);
        dialog.setCancelable(false);
        LayoutInflater inflater1 = LayoutInflater.from(ListActivity.this);
        View signin_layout_driver = inflater1.inflate(R.layout.loading_layout, null);
        progressBar = signin_layout_driver.findViewById(R.id.simpleProgressBar);
        loadingText = signin_layout_driver.findViewById(R.id.loading_title);
        loadingText.setText("Please wait...");
        dialog.setView(signin_layout_driver);
        waitingDialog = dialog.create();
        getLocationList(Constants.TENANTID, true);
    }

    private void getLocationList(final String tenantId, final boolean isAll) {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Handler handler = new Handler(Looper.getMainLooper());
        executor.execute(() -> {
            String response = null;
            handler.post(() -> {
                waitingDialog.show();
                Log.d("TAGGGGGGG", "Operation Started");
            });
            StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
            StrictMode.setThreadPolicy(policy);
            final MediaType mediaType = MediaType.parse("application/json; charset=utf-8");
            try {
                JSONObject obj = new JSONObject();
                obj.put("tenantId", tenantId);
                obj.put("isAll", isAll);
                RequestBody body = (RequestBody) RequestBody.create(mediaType, String.valueOf(obj));
                // Log.d("URL ",Constants.BASEURL + Constants.LISTURL);
                //Log.d("REQUEST",String.valueOf(obj));
                HttpAsynRequest httpRequest = new HttpAsynRequest();
                response = httpRequest.sendRequest(body, Constants.BASEURL + Constants.LISTURL);
            } catch (Exception e) {
                e.printStackTrace();
                response = null;
            }
            String res = response;
            handler.post(() -> {
                waitingDialog.dismiss();
                if (res == null || res.isEmpty()) {
                    showRetry(tenantId, isAll, "Null! Something went error, Please try again");
                    return;
                } else {
                    Log.d("Resulttt ", res);
                    try {
                        JSONObject jsonObject = new JSONObject(res);
                        if (jsonObject.getString("status").equalsIgnoreCase("success")) {
                            JSONArray list = jsonObject.getJSONArray("locationLogs");
                            if (list.length() > 0) {
                                locModelArrayList = new ArrayList<>();
                                for (int j = 0; j < list.length(); j++) {
                                    JSONObject locData = list.getJSONObject(j);
                                    LocModel locModel = new LocModel(
                                            locData.isNull("lat") ? 0 : locData.getLong("lat"),
                                            locData.isNull("lng") ? 0 : locData.getLong("lng"),
                                            locData.isNull("address") ? "" : locData.getString("address"),
                                            locData.isNull("charge") ? "" : locData.getString("charge"),
                                            locData.isNull("created") ? "" : locData.getString("created"),
                                            locData.isNull("userId") ? 0 : locData.getInt("userId"),
                                            locData.isNull("fullName") ? "" : locData.getString("fullName"),
                                            locData.isNull("contactNo") ? "" : locData.getString("contactNo"),
                                            locData.isNull("imagePath") ? "" : locData.getString("imagePath"),
                                            locData.isNull("designation") ? "" : locData.getString("designation")
                                    );
                                    locModelArrayList.add(locModel);
                                }
                                locAdapter = new LocAdapter(ListActivity.this, locModelArrayList);
                                listViewLoc.setAdapter(locAdapter);
                                listViewLoc.setVisibility(View.VISIBLE);
                                emptyText.setVisibility(View.GONE);
                            } else {
                                listViewLoc.setVisibility(View.GONE);
                                emptyText.setVisibility(View.VISIBLE);
                            }

                        } else if (jsonObject.getString("status").equalsIgnoreCase("warning")) {
                            showRetry(tenantId, isAll, "Waring! Something went error, Please try again");
                        } else {
                            showRetry(tenantId, isAll, "ERROR! Something went error, Please try again");
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                        showRetry(tenantId, isAll, "Exception! Something went error, Please try again");
                    }
                }
            });
        });
    }

    private void showRetry(String tenantId, boolean isAll, String msg) {
        AlertDialog.Builder dialog = new AlertDialog.Builder(this);
        dialog.setTitle("Note!");
        dialog.setMessage(msg);
        dialog.setCancelable(false);
        dialog.setPositiveButton("Retry", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
                getLocationList(tenantId, isAll);
            }

        });
        dialog.setNegativeButton("Close", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int which) {
                dialogInterface.dismiss();
            }
        });
        dialog.show();
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                onBackPressed();
                return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        finish();
    }
}