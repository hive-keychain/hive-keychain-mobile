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
    public void setCommand(String command, String params){
        Log.i("Command RN ", "C: " + command + " P: " + params);
        Log.i("Command", command);
        if(command.trim().equals("update_widgets")){
            Log.i("To update", params);
            //TODO add:
            //  - all_widgets, maybe thsi can be used on the first app load.
            //  - currency_list
            //  important: to finish up
                //  - check all TODOs
                //  - clean up
                //  - overall tests.
                //  - marked PR as ready for review + ticket.
            if(params.trim().equals("account_balance_list")) {
                Log.i("Updating", params);
                //Update just WidgetAccountBalanceListProvider class
                AppWidgetManager widgetManager = AppWidgetManager.getInstance(context);
                ComponentName widgetComponent = new ComponentName(context, WidgetAccountBalanceListProvider.class);
                int[] widgetIds = widgetManager.getAppWidgetIds(widgetComponent);
                widgetManager.notifyAppWidgetViewDataChanged(widgetIds, R.id.widget_account_balance_list_stack_view);
            }
            //TODO update currency_list.
        }
    }
}
