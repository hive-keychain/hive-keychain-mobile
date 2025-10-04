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
            configureIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
            configureIntent.setData(Uri.parse(configureIntent.toUri(Intent.URI_INTENT_SCHEME)));
            PendingIntent configurePendingIntent = PendingIntent.getBroadcast(context, appWidgetId, configureIntent, flag);
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

        if (!ACTION_RECEIVER_CONFIGURE_WIDGET_ACCOUNT_BALANCE_LIST.equals(intent.getAction())) {
            return; // Ignore system broadcasts like APPWIDGET_UPDATE
        }

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

        // Persist the command via SharedPreferences, to be read by the app on startup/resume
        try {
            android.content.SharedPreferences prefs = context.getSharedPreferences("KeychainWidget", Context.MODE_PRIVATE);
            prefs.edit().putString("pendingCommand", "configureWidgets").apply();
        } catch (Exception e) {
            Log.w("WidgetBridge", "Failed writing pendingCommand to SharedPreferences: " + e.getMessage());
        }

        // Launch app using the package's main launch intent (handles dev/prod package names)
        try {
            Intent i = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
            if (i == null) {
                // Fallback to explicit MainActivity within current package
                i = new Intent();
                i.setClassName(context.getPackageName(), context.getPackageName() + ".MainActivity");
            }
            // Pass a hint to the Activity and ensure reuse when possible
            i.putExtra("configureWidgets", true);
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            context.startActivity(i);
        } catch (Exception e) {
            Log.e("WidgetBridge", "Failed to start MainActivity: " + e.getMessage());
        }
    }
}