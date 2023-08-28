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
import android.widget.RemoteViews;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

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
    public void setData(String message) {
        SharedPreferences.Editor editor = context.getSharedPreferences("DATA", Context.MODE_PRIVATE).edit();
        Log.i("Message Received: ", message); //TODO remove line
        editor.putString("appData", message);
        editor.commit();
    }

    @ReactMethod
    public void setCommand(String command, String params){
        Log.i("Command Received: ", command + "/" + params); //TODO remove line
        if(command.trim().equals("update_widgets")){
            AppWidgetManager widgetManager = AppWidgetManager.getInstance(context);
            if(params.trim().equals("account_balance_list")) {
                //Update just WidgetAccountBalanceListProvider class
                ComponentName widgetComponent = new ComponentName(context, WidgetAccountBalanceListProvider.class);
                int[] widgetIds = widgetManager.getAppWidgetIds(widgetComponent);
                widgetManager.notifyAppWidgetViewDataChanged(widgetIds, R.id.widget_account_balance_list_stack_view);
                Log.i("To update sent", "it should update account_balance_list"); //TODO remove line
            }
            if(params.trim().equals("all_widgets")){
                //Update all widgets
                ComponentName widgetComponentCurrency = new ComponentName(context, WidgetCurrencyListProvider.class);
                int[] widgetIdsCurrency = widgetManager.getAppWidgetIds(widgetComponentCurrency);
                ComponentName widgetComponentAccount = new ComponentName(context, WidgetAccountBalanceListProvider.class);
                int[] widgetIdsAccount = widgetManager.getAppWidgetIds(widgetComponentAccount);

                widgetManager.notifyAppWidgetViewDataChanged(widgetIdsAccount, R.id.widget_account_balance_list_stack_view);
                widgetManager.notifyAppWidgetViewDataChanged(widgetIdsCurrency, R.id.widget_currency_list_stack_view);
            }
            if(params.trim().equals("currency_list")){
                //Update just WidgetCurrencyList class
                ComponentName widgetComponent = new ComponentName(context, WidgetCurrencyListProvider.class);
                int[] widgetIds = widgetManager.getAppWidgetIds(widgetComponent);
                widgetManager.notifyAppWidgetViewDataChanged(widgetIds, R.id.widget_currency_list_stack_view);
            }
        }
    }
}
