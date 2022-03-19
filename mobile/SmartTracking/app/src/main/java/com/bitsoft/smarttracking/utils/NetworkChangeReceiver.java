package com.bitsoft.smarttracking.utils;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import static com.bitsoft.smarttracking.utils.NetworkConnection.isOnline;

public class NetworkChangeReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent)
    {
        try
        {
            if (isOnline(context)) {
                //netAlert(true);
            } else {
                //netAlert(false);
            }
        } catch (NullPointerException e) {
           // netAlert(false);
            e.printStackTrace();
        }
    }
}
