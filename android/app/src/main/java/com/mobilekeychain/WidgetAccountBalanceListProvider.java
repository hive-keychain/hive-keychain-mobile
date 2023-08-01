package com.mobilekeychain;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.util.Log;
import android.widget.RemoteViews;

import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;

public class WidgetAccountBalanceListProvider extends AppWidgetProvider {
    public static String ACTION_WIDGET_APP_NAVIGATE_TO = "ActionReceiverAppNavigateTo";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        final int flag =  Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE : PendingIntent.FLAG_UPDATE_CURRENT;
        for (int appWidgetId : appWidgetIds) {

            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_account_balance_list);

            //Custom intent/broadcast registration
            //In app navigate to action.
            Intent intent = new Intent(context, WidgetAccountBalanceListProvider.class);
            intent.setAction(ACTION_WIDGET_APP_NAVIGATE_TO);
            PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 0, intent, flag);
            views.setOnClickPendingIntent(R.id.widget_account_balance_list_button_configure, pendingIntent);

            //Service for StackView
            Intent serviceIntent = new Intent(context, WidgetAccountBalanceListService.class);
            serviceIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
            serviceIntent.setData(Uri.parse(serviceIntent.toUri(Intent.URI_INTENT_SCHEME)));

            //Add StackView into views
            views.setRemoteAdapter(R.id.widget_account_balance_list_stack_view, serviceIntent);
            views.setEmptyView(R.id.widget_account_balance_list_stack_view, R.id.widget_account_balance_list_stack_empty_view);

            appWidgetManager.updateAppWidget(appWidgetId, views);
            // Instruct the widget manager that data may have changed, so update remove views.
            appWidgetManager.notifyAppWidgetViewDataChanged(appWidgetId, R.id.widget_account_balance_list_stack_view);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.i("WidgetHiveUser  action:", intent.getAction().toString());
        if (intent.getAction().equals(ACTION_WIDGET_APP_NAVIGATE_TO)) {
            try{
                // put new key into shared storage (send navigateTo command to app)
                WritableMap params = Arguments.createMap();
//                params.putString("navigateTo", "WALLET"); //TODO useful command in case navigation is needed at anytime
                params.putString("configureWidgets", "true"); //TODO useful as  is the one making the configuration in app.
                ReactApplication rnApp = (ReactApplication) context.getApplicationContext();
                ReactContext reactContext = rnApp.getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
                MainActivity.sendReactEvent(reactContext,"command_event", params);

                // launch app.
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
