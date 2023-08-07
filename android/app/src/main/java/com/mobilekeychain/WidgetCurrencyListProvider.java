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

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {

        for (int appWidgetId : appWidgetIds) {
            Intent intent = new Intent(context, MainActivity.class);
            final int flag =  Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE : PendingIntent.FLAG_UPDATE_CURRENT;
            PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, flag);
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_currency_list);
            views.setOnClickPendingIntent(R.id.widget_currency_list_layout, pendingIntent);

            //Code block using the refresh button as custom intent/broadcast
            intent = new Intent(context, WidgetCurrencyListProvider.class);
            intent.setAction(ACTION_WIDGET_REFRESH);
            pendingIntent = PendingIntent.getBroadcast(context, 0, intent, flag);
            views.setOnClickPendingIntent(R.id.widget_currency_list_button_refresh, pendingIntent);

            //Service for StackView
            Intent serviceIntent = new Intent(context, WidgetCurrencyListService.class);
            serviceIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
            serviceIntent.setData(Uri.parse(serviceIntent.toUri(Intent.URI_INTENT_SCHEME)));

            //Add StackView into views
            views.setRemoteAdapter(R.id.widget_currency_list_stack_view, serviceIntent);
            views.setEmptyView(R.id.widget_currency_list_stack_view, R.id.widget_currency_list_stack_empty_view);

            // Instruct the widget manager to update the widget
            appWidgetManager.updateAppWidget(appWidgetId, views);
            // Instruct the widget manager that data may have changed, so update remove views.
            appWidgetManager.notifyAppWidgetViewDataChanged(appWidgetId, R.id.widget_currency_list_stack_view);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals(ACTION_WIDGET_REFRESH)) {
            try{
                AppWidgetManager widgetManager = AppWidgetManager.getInstance(context);
                ComponentName widgetComponentCurrency = new ComponentName(context, WidgetCurrencyListProvider.class);
                int[] widgetIdsCurrency = widgetManager.getAppWidgetIds(widgetComponentCurrency);
                widgetManager.notifyAppWidgetViewDataChanged(widgetIdsCurrency, R.id.widget_currency_list_stack_view);

            } catch (Exception e) {
                Log.e("Error: REFRESH CL data", e.getLocalizedMessage());
                e.printStackTrace();
            }

        }
        super.onReceive(context, intent);
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

