package com.mobilekeychain;

import static android.app.PendingIntent.FLAG_IMMUTABLE;

import android.app.Dialog;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.RemoteViews;
import android.content.SharedPreferences;
import android.widget.Toast;

import androidx.annotation.Nullable;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONStringer;

/**
 * Implementation of App Widget functionality.
 */
public class NewAppWidget extends AppWidgetProvider {

    // our actions for our buttons
    public static String ACTION_WIDGET_REFRESH = "ActionReceiverRefresh";
    public static String ACTION_WIDGET_LAUNCH_APP = "ActionReceiverLunchApp";

    private DeviceEventManagerModule.RCTDeviceEventEmitter nEmitter = null;


    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
                                int appWidgetId, RemoteViews views) {

        try {
            SharedPreferences sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
            String appString = sharedPref.getString("appData", "{\"HIVE\":'Loading data',\"HBD\":'Loading data'}");
            JSONObject appData = new JSONObject(appString);

            // Construct the RemoteViews object
//            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.new_app_widget);
            views.setTextViewText(R.id.appwidget_currency_value, appData.getString("HIVE"));
            //TODO change logic, store both values + finish + continue.
//            views.setTextViewText(R.id.appwidget_text2, appData.getString("HBD"));

            // Instruct the widget manager to update the widget
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // There may be multiple widgets active, so update all of them
        // Perform this loop procedure for each widget that belongs to this
        // provider.
        for (int i=0; i < appWidgetIds.length; i++) {
            int appWidgetId = appWidgetIds[i];
            // Create an Intent to launch ExampleActivity
            Intent active = new Intent(context, MainActivity.class);
            active.setAction(ACTION_WIDGET_LAUNCH_APP);
            PendingIntent pendingIntent = PendingIntent.getBroadcast(context,0,active,FLAG_IMMUTABLE);
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.new_app_widget);
            views.setOnClickPendingIntent(R.id.widget_layout, pendingIntent);

            active = new Intent(context, MainActivity.class);
            active.setAction(ACTION_WIDGET_REFRESH);
            pendingIntent = PendingIntent.getBroadcast(context,0,active,FLAG_IMMUTABLE);
            views = new RemoteViews(context.getPackageName(), R.layout.new_app_widget);
            views.setOnClickPendingIntent(R.id.appwidget_button_refresh, pendingIntent);

            updateAppWidget(context, appWidgetManager,appWidgetId, views);
        }

//        //TODO for now just send a message to RN app on each update iteration
//        WritableMap params = Arguments.createMap();
//        params.putString("currency", "update_values");
//        ReactApplication rnApp = (ReactApplication) context.getApplicationContext();
//        ReactContext reactContext = rnApp.getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
//        MainActivity.sendReactEvent(reactContext,"command_event", params);
//        //end TODO
    }

    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals(ACTION_WIDGET_REFRESH)) {
            Log.i("onReceive", ACTION_WIDGET_REFRESH);
        } else if (intent.getAction().equals(ACTION_WIDGET_LAUNCH_APP)) {
            Log.i("onReceive", ACTION_WIDGET_LAUNCH_APP);
        } else {
            super.onReceive(context, intent);
        }
    };

    @Override
    public void onEnabled(Context context) {
        // Enter relevant functionality for when the first widget is created
        super.onEnabled(context);
        Toast.makeText(context, "widget created!!!", Toast.LENGTH_LONG).show();

    }

    @Override
    public void onDisabled(Context context) {
        // Enter relevant functionality for when the last widget is disabled
        super.onEnabled(context);
    }

    //TODO decide with quentin if will be used or not
//    @Override
//    public void onAppWidgetOptionsChanged(Context context, AppWidgetManager appWidgetManager, int appWidgetId, Bundle newOptions) {
////        super.onAppWidgetOptionsChanged(context, appWidgetManager, appWidgetId, newOptions); //TODO clean up
//        RemoteViews views = new RemoteViews(context.getPackageName(),R.layout.new_app_widget);
//
//        int minWidth = newOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH);
//        int maxWidth = newOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MAX_WIDTH);
//        int minHeight = newOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT);
//        int maxHeight = newOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MAX_HEIGHT);
//
//        //TODO cleanup code
////        String dimensions = "Minwidth:" + minWidth + "|Maxwidth:" + maxWidth + "|Minheight:" + minHeight + "|Max height:" + maxHeight;
////        Toast.makeText(context, dimensions, Toast.LENGTH_LONG).show();
//
//        if(maxHeight < 100){
//            views.setViewVisibility(R.id.keychain_logo_mini, View.VISIBLE);
//            views.setViewVisibility(R.id.keychain_logo_big, View.GONE);
//        }else{
//            views.setViewVisibility(R.id.keychain_logo_mini, View.GONE);
//            views.setViewVisibility(R.id.keychain_logo_big, View.VISIBLE);
//        }
//
//        appWidgetManager.updateAppWidget(appWidgetId,views);
//    }
}

