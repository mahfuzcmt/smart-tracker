package com.bitsoft.smarttracking.utils;

import android.content.Context;
import android.util.Log;

import java.net.InetAddress;
import java.net.NetworkInterface;
import java.util.Collections;
import java.util.List;

import static android.content.Context.WIFI_SERVICE;

public class UtilMac {
    public static String getMACAddress(String interfaceName) {
        try {
            List<NetworkInterface> interfaces = Collections.list(NetworkInterface.getNetworkInterfaces());
            for (NetworkInterface intf : interfaces) {
                if (interfaceName != null) {
                    if(intf.getName().equalsIgnoreCase(interfaceName)){
                        byte[] mac = intf.getHardwareAddress();
                        if (mac == null) return null;
                        StringBuilder buf = new StringBuilder();
                        for (byte aMac : mac) buf.append(String.format("%02X:", aMac));
                        if (buf.length() > 0) buf.deleteCharAt(buf.length() - 1);
                        return buf.toString();
                    }
                }
            }
            Log.d("SMART: ", ">>>>>>>>>>>No WiFi<<<<<<<<<<<<");
            return null;
        } catch (Exception ignored) {
            Log.d("SMART: ", ignored.getMessage());
            return null;
        } // for now eat exceptions
    }

    public static String getIPAddress(boolean useIPv4) {
        try {
            List<NetworkInterface> interfaces = Collections.list(NetworkInterface.getNetworkInterfaces());
            for (NetworkInterface intf : interfaces) {
                List<InetAddress> addrs = Collections.list(intf.getInetAddresses());
                for (InetAddress addr : addrs) {
                    if (!addr.isLoopbackAddress()) {
                        String sAddr = addr.getHostAddress();
                        boolean isIPv4 = sAddr.indexOf(':')<0;

                        if (useIPv4) {
                            if (isIPv4)
                                return sAddr;
                        } else {
                            if (!isIPv4) {
                                int delim = sAddr.indexOf('%'); // drop ip6 zone suffix
                                return delim<0 ? sAddr.toUpperCase() : sAddr.substring(0, delim).toUpperCase();
                            }
                        }
                    }
                }
            }
        } catch (Exception ignored) { } // for now eat exceptions
        return "";
    }

    public String GetDeviceipMobileData(){
        try {
            for (java.util.Enumeration<java.net.NetworkInterface> en = java.net.NetworkInterface.getNetworkInterfaces(); en.hasMoreElements();) {
                java.net.NetworkInterface networkinterface = en.nextElement();
                for (java.util.Enumeration<java.net.InetAddress> enumIpAddr = networkinterface.getInetAddresses(); enumIpAddr.hasMoreElements();) {
                    java.net.InetAddress inetAddress = enumIpAddr.nextElement();
                    if (!inetAddress.isLoopbackAddress()) {
                        return inetAddress.getHostAddress().toString();
                    }
                }
            }
        } catch (Exception ex) {
            Log.e("Current IP", ex.toString());
        }
        return null;
    }


    public String GetDeviceipWiFiData(Context context){
        android.net.wifi.WifiManager wm = (android.net.wifi.WifiManager)  context.getSystemService(WIFI_SERVICE);
        @SuppressWarnings("deprecation")
        String ip = android.text.format.Formatter.formatIpAddress(wm.getConnectionInfo().getIpAddress());
        return ip;
    }
}
