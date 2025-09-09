package com.mobilekeychain;

import android.content.Context;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
import android.widget.RemoteViews;

import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;

public class WidgetAccountBalanceListProvider extends AppWidgetProvider {

    public static String ACTION_RECEIVER_CONFIGURE_WIDGET_ACCOUNT_BALANCE_LIST = 
        "ActionReceiverConfigureWidgetAccountBalanceList";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        final int flag = PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT;

        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_account_balance_list);

            // Configure button intents
            Intent configureIntent = new Intent(context, WidgetAccountBalanceListProvider.class);
            configureIntent.setAction(ACTION_RECEIVER_CONFIGURE_WIDGET_ACCOUNT_BALANCE_LIST);
            PendingIntent configurePendingIntent = PendingIntent.getBroadcast(context, 0, configureIntent, flag);
            views.setOnClickPendingIntent(R.id.widget_account_balance_list_button_configure, configurePendingIntent);
            views.setOnClickPendingIntent(R.id.widget_account_balance_list_stack_empty_view, configurePendingIntent);

            // Service for StackView
            Intent serviceIntent = new Intent(context, WidgetAccountBalanceListService.class);
            serviceIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
            serviceIntent.setData(Uri.parse(serviceIntent.toUri(Intent.URI_INTENT_SCHEME)));
            views.setRemoteAdapter(R.id.widget_account_balance_list_stack_view, serviceIntent);
            views.setEmptyView(R.id.widget_account_balance_list_stack_view,
                               R.id.widget_account_balance_list_stack_empty_view);

            appWidgetManager.updateAppWidget(appWidgetId, views);
            appWidgetManager.notifyAppWidgetViewDataChanged(appWidgetId, R.id.widget_account_balance_list_stack_view);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);

        if (ACTION_RECEIVER_CONFIGURE_WIDGET_ACCOUNT_BALANCE_LIST.equals(intent.getAction())) {
            try {
                WritableMap params = Arguments.createMap();
                params.putString("configureWidgets", "true");

                ReactApplication rnApp = (ReactApplication) context.getApplicationContext();
                ReactContext reactContext = rnApp.getReactNativeHost()
                                                .getReactInstanceManager()
                                                .getCurrentReactContext();

                if (reactContext instanceof ReactApplicationContext) {
                    // Fire event to JS
                    WidgetBridge.emitCommandEvent((ReactApplicationContext) reactContext, "command_event", params);
                } else {
                    Log.w("WidgetBridge", "ReactContext not ready or not ReactApplicationContext, cannot emit event");
                }
            } catch (Exception e) {
                Log.e("WidgetBridge", "Error sending command event: " + e.getMessage());
            }

            // Launch MainActivity to bring app to foreground
            Intent i = new Intent();
            i.setClassName(context.getPackageName(), "com.mobilekeychain.MainActivity");
            // Pass a hint to the Activity so it can forward to JS when RN is ready
            i.putExtra("configureWidgets", true);
            // Ensure we reuse existing activity when possible so onNewIntent is called
            i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            context.startActivity(i);
        }
    }
}