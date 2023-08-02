package com.mobilekeychain;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;

public class SharedStorage extends ReactContextBaseJavaModule {
    ReactApplicationContext context;

    public SharedStorage(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Override
    public String getName() {
        return "SharedStorage";
    }

    @ReactMethod
    public void set(String message) {
        SharedPreferences.Editor editor = context.getSharedPreferences("DATA", Context.MODE_PRIVATE).edit();
        editor.putString("appData", message);
        editor.commit();

        //CHANGE TO THE NAME OF YOUR WIDGET
        Intent intent = new Intent(getCurrentActivity().getApplicationContext(), WidgetCurrencyListProvider.class);
        intent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
        //CHANGE TO THE NAME OF YOUR WIDGET
        int[] ids = AppWidgetManager.getInstance(getCurrentActivity().getApplicationContext()).getAppWidgetIds(new ComponentName(getCurrentActivity().getApplicationContext(), WidgetCurrencyListProvider.class));
        intent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids);
        getCurrentActivity().getApplicationContext().sendBroadcast(intent);

    }

    @ReactMethod
    public void setCommand(String command) {
        Log.i("Command from RN: ", command);
        //TODO possible way to handle widget updates separately:
        //  - add two separate widget_[class-provider]_update & invoke them when nedded
        if(command.equals("update_widgets")){
            //Update just WidgetAccountBalanceListProvider class
            AppWidgetManager widgetManager = AppWidgetManager.getInstance(context);
            ComponentName widgetComponent = new ComponentName(context, WidgetAccountBalanceListProvider.class);
            int[] widgetIds = widgetManager.getAppWidgetIds(widgetComponent);
            Intent update = new Intent();
            update.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, widgetIds);
            update.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
            context.sendBroadcast(update);
        }
    }
}
