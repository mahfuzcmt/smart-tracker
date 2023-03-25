package com.bitsoft.smarttracking.utils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

public class Constants {
    public static int STARTTIME=1000;
    public static int USERID=0;
    public static int LOGINSYNC=0;
    public static String TENANTID=null;
    public static String ORGNAME=null;
    public static String DEVICEMAC=null;
    public static String DATE12HR="yyyy-MM-dd hh:mm a";
    public static String DATEINTHR="yyyy-MM-dd'T'HH:mm:ss'Z'";

    public static String BASEURL="http://45.86.70.142:8080/st/";
   // public static String BASEURL="http://45.86.70.142:8080/st/location";
    public static String SETDEVICEBYID="client/getByDeviceMac";
    public static String SAVEURL="location/save";
    public static String LISTURL="location/list?";

    public static String formateDate(String strdate){
        Calendar cal = Calendar.getInstance();
        SimpleDateFormat format = new SimpleDateFormat(Constants.DATEINTHR);
        SimpleDateFormat strformat = new SimpleDateFormat(Constants.DATE12HR);
        try {
            Date date = format.parse(strdate);
            cal.setTime(date);
            cal.setTimeZone(TimeZone.getTimeZone("Asia/Dhaka"));
            if(Constants.DATEINTHR.equals(Constants.DATEINTHR))cal.add(Calendar.HOUR, 6);
            return strformat.format(cal.getTime());
        } catch (ParseException e) {
            return strdate;
        }
    }

}
