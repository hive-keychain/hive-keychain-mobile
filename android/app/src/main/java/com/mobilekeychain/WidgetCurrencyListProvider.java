package com.mobilekeychain;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
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

/**
 * Implementation of App Widget functionality.
 */
public class WidgetCurrencyListProvider extends AppWidgetProvider {

    public static String ACTION_WIDGET_REFRESH = "ActionReceiverRefresh";
    public static String ACTION_WIDGET_LAUNCH_APP = "ActionWidgetLaunchApp";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        Log.i("onUpdate WCL", "Called!!"); //TODO remove line
        Log.i("WCL appWidgetIds", appWidgetIds.toString());
        final int flag = PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT;
        for (int appWidgetId : appWidgetIds) {
//            Intent intent = new Intent(context, MainActivity.class);
//            final int flag =  Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE : PendingIntent.FLAG_UPDATE_CURRENT;
//            PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);

            //Code block using the refresh button as custom intent/broadcast
            Intent refreshIntent = new Intent(context, WidgetCurrencyListProvider.class);
            refreshIntent.setAction(ACTION_WIDGET_REFRESH);
            PendingIntent refreshPendingIntent = PendingIntent.getBroadcast(context, 0, refreshIntent, flag);

            //Code block using the layout click as custom intent/broadcast
            Intent openAppIntent = new Intent(context, WidgetCurrencyListProvider.class);
            openAppIntent.setAction(ACTION_WIDGET_LAUNCH_APP);
            PendingIntent openAppPendingIntent = PendingIntent.getBroadcast(context, 0, openAppIntent, flag);

            //Service for StackView
            Intent serviceIntent = new Intent(context, WidgetCurrencyListService.class);
            serviceIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
            serviceIntent.setData(Uri.parse(serviceIntent.toUri(Intent.URI_INTENT_SCHEME)));

            //Declare remove views + add button config click
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_currency_list);
            //refresh button
            views.setOnClickPendingIntent(R.id.widget_currency_list_button_refresh, refreshPendingIntent);
            //open app layout
            views.setOnClickPendingIntent(R.id.widget_currency_list_layout, openAppPendingIntent);
            //Add StackView into views
            views.setRemoteAdapter(R.id.widget_currency_list_stack_view, serviceIntent);
            views.setEmptyView(R.id.widget_currency_list_stack_view, R.id.widget_currency_list_stack_empty_view);

            // Instruct the widget manager to update the widget
            appWidgetManager.updateAppWidget(appWidgetId, views);
            // Instruct the widget manager that data may have changed, so update remove views.
            appWidgetManager.notifyAppWidgetViewDataChanged(appWidgetId, R.id.widget_currency_list_stack_view);
        }
        //TODO testing to see if this line bellow fix the update issue!
        super.onUpdate(context,appWidgetManager,appWidgetIds);
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        //TODO testing if moving the constructor first solve the update issue!
        super.onReceive(context, intent);
        if (intent.getAction().equals(ACTION_WIDGET_REFRESH)) {
            try{
                AppWidgetManager widgetManager = AppWidgetManager.getInstance(context);
                ComponentName widgetComponentCurrency = new ComponentName(context, WidgetCurrencyListProvider.class);
                int[] widgetIdsCurrency = widgetManager.getAppWidgetIds(widgetComponentCurrency);
                widgetManager.notifyAppWidgetViewDataChanged(widgetIdsCurrency, R.id.widget_currency_list_stack_view);
                Log.i("Clicked", "Should Update!" + widgetIdsCurrency); //TODO remove

            } catch (Exception e) {
                Log.e("Error: REFRESH CL data", e.getLocalizedMessage());
                e.printStackTrace();
            }

        }
        if(intent.getAction().equals(ACTION_WIDGET_LAUNCH_APP)){
            Log.i("WCL onReceive", "launch app!");
            // launch app start activity
            Intent i = new Intent();
            i.setClassName(context.getPackageName(), "com.mobilekeychain.MainActivity");
            i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(i);
        }
    };

    @Override
    public void onEnabled(Context context) {
        // Enter relevant functionality for when the first widget is created
        super.onEnabled(context);
    }

    @Override
    public void onDisabled(Context context) {
        // Enter relevant functionality for when the last widget is disabled
        super.onEnabled(context);
    }
}

