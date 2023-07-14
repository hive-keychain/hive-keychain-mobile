package com.mobilekeychain;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.RemoteViews;
import android.content.SharedPreferences;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;
/**
 * Implementation of App Widget functionality.
 */
public class NewAppWidget extends AppWidgetProvider {

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
                                int appWidgetId, RemoteViews views) {

        try {
            SharedPreferences sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
            String appString = sharedPref.getString("appData", "{\"HIVE\":'Loading data',\"HBD\":'Loading data'}");
            JSONObject appData = new JSONObject(appString);

            // Construct the RemoteViews object
//            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.new_app_widget);
            views.setTextViewText(R.id.appwidget_text1, appData.getString("HIVE"));
            views.setTextViewText(R.id.appwidget_text2, appData.getString("HBD"));
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
            Intent intent = new Intent(context, MainActivity.class);
            PendingIntent pendingIntent = PendingIntent.getActivity(
                    /* context = */ context,
                    /* requestCode = */ 0,
                    /* intent = */ intent,
                    /* flags = */ PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );

            // Get the layout for the widget and attach an on-click listener
            // to layout
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.new_app_widget);
            views.setOnClickPendingIntent(R.id.widget_layout, pendingIntent);

            // call updateAppWidget inner method
            //what about the views?? should pass as well too?
            updateAppWidget(context, appWidgetManager,appWidgetId, views);
        }
    }

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

    @Override
    public void onAppWidgetOptionsChanged(Context context, AppWidgetManager appWidgetManager, int appWidgetId, Bundle newOptions) {
//        super.onAppWidgetOptionsChanged(context, appWidgetManager, appWidgetId, newOptions); //TODO clean up
        RemoteViews views = new RemoteViews(context.getPackageName(),R.layout.new_app_widget);

        int minWidth = newOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH);
        int maxWidth = newOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MAX_WIDTH);
        int minHeight = newOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT);
        int maxHeight = newOptions.getInt(AppWidgetManager.OPTION_APPWIDGET_MAX_HEIGHT);

        //TODO cleanup code
//        String dimensions = "Minwidth:" + minWidth + "|Maxwidth:" + maxWidth + "|Minheight:" + minHeight + "|Max height:" + maxHeight;
//        Toast.makeText(context, dimensions, Toast.LENGTH_LONG).show();

        if(maxHeight < 100){
            views.setViewVisibility(R.id.keychain_logo_mini, View.VISIBLE);
            views.setViewVisibility(R.id.keychain_logo_big, View.GONE);
        }else{
            views.setViewVisibility(R.id.keychain_logo_mini, View.GONE);
            views.setViewVisibility(R.id.keychain_logo_big, View.VISIBLE);
        }

        appWidgetManager.updateAppWidget(appWidgetId,views);
    }
}

