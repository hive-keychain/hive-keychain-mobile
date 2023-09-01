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
    public static String ACTION_RECEIVER_CONFIGURE_WIDGET_ACCOUNT_BALANCE_LIST = "ActionReceiverConfigureWidgetAccountBalanceList";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        final int flag = PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT;
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_account_balance_list);

            //Custom intent/broadcast registration
            Intent configureIntent = new Intent(context, WidgetAccountBalanceListProvider.class);
            configureIntent.setAction(ACTION_RECEIVER_CONFIGURE_WIDGET_ACCOUNT_BALANCE_LIST);
            PendingIntent configurePendingIntent = PendingIntent.getBroadcast(context, 0, configureIntent, flag);
            views.setOnClickPendingIntent(R.id.widget_account_balance_list_button_configure, configurePendingIntent);

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
        super.onUpdate(context,appWidgetManager,appWidgetIds);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        if(intent.getAction().equals(ACTION_RECEIVER_CONFIGURE_WIDGET_ACCOUNT_BALANCE_LIST)){
            // put new key into shared storage + send configureWidgets command to RN app)
            if(Utils.isAppRunning(context, context.getPackageName())) {
                try {
                    WritableMap params = Arguments.createMap();
                    params.putString("configureWidgets", "true");
                    ReactApplication rnApp = (ReactApplication) context.getApplicationContext();
                    ReactContext reactContext = rnApp.getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
                    MainActivity.sendReactEvent(reactContext, "command_event", params);
                } catch (Exception e){
                    Log.e("Exception WABL config", e.getLocalizedMessage());
                }
            }

            // launch app start activity
            Intent i = new Intent();
            i.setClassName(context.getPackageName(), "com.mobilekeychain.MainActivity");
            i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(i);
        }
    }

    @Override
    public void onEnabled(Context context) {
        // Enter relevant functionality for when the first widget is created
        super.onEnabled(context);
    }
}
