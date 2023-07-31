package com.mobilekeychain;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.util.Log;
import android.widget.RemoteViews;

import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;

public class WidgetHiveUsersProvider extends AppWidgetProvider {
    public static String ACTION_WIDGET_APP_NAVIGATE_TO = "ActionReceiverAppNavigateTo";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        final int flag =  Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE : PendingIntent.FLAG_UPDATE_CURRENT;
        for (int appWidgetId : appWidgetIds) {
//            Intent intent = new Intent(context, MainActivity.class);
//            PendingIntent pendingIntent = PendingIntent.getActivity(context, 0,intent,flag);

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_hive_users);
//            views.setOnClickPendingIntent(R.id.widget_hive_users_button, pendingIntent);

            //Custom intent/broadcast registration
            //In app navigate to action.
            Intent intent = new Intent(context, WidgetHiveUsersProvider.class);
            intent.setAction(ACTION_WIDGET_APP_NAVIGATE_TO);
            PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 0, intent, flag);
            views.setOnClickPendingIntent(R.id.widget_hive_users_button, pendingIntent);

            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.i("WidgetHiveUser  action:", intent.getAction().toString());
        if (intent.getAction().equals(ACTION_WIDGET_APP_NAVIGATE_TO)) {
            try{
                // put new key into shared storage (send navigateTo command to app)
                WritableMap params = Arguments.createMap();
                params.putString("navigateTo", "WALLET");
                ReactApplication rnApp = (ReactApplication) context.getApplicationContext();
                ReactContext reactContext = rnApp.getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
                MainActivity.sendReactEvent(reactContext,"command_event", params);

//                int appWidgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID,
//                        AppWidgetManager.INVALID_APPWIDGET_ID);
//                AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
//                appWidgetManager.notifyAppWidgetViewDataChanged(appWidgetId, R.id.appwidget_stack_view);

                // launch app.
                //TODO here: for some reason this intent only works when the app is already running
                //  it differs from how the layout in the other widget works, so let check about this...
                //start activity
                Intent i = new Intent();
                i.setClassName(context.getPackageName(), "com.mobilekeychain.MainActivity");
                i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(i);

            } catch (Exception e) {
                Log.i("Error: navigateTo data", e.getLocalizedMessage());
                e.printStackTrace();
            }
        }
        super.onReceive(context, intent);
    }
}
