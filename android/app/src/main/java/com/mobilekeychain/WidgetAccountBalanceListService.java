package com.mobilekeychain;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Handler;
import android.os.SystemClock;
import android.util.Log;
import android.view.ViewGroup;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.HttpHeaderParser;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.RequestFuture;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.concurrent.ExecutionException;

public class WidgetAccountBalanceListService extends RemoteViewsService {
    private JSONObject accounts_data;

    @Override
    public RemoteViewsFactory onGetViewFactory(Intent intent) {
        return new AppWidgetItemFactory(getApplicationContext(), intent);
    }

    class AppWidgetItemFactory implements RemoteViewsFactory {
        private Context context;
        private  int appWidgetId;

        AppWidgetItemFactory(Context context, Intent intent){
                this.context = context;
                this.appWidgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID,
                        AppWidgetManager.INVALID_APPWIDGET_ID);
        }

        public void getData(){
            try {
                //account_balance_list
                SharedPreferences sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
                String appString = sharedPref.getString("appData", "");
                JSONObject data = new JSONObject(appString);
                accounts_data = new JSONObject(data.getString("account_balance_list"));
                Log.i("getData: ", accounts_data.toString()); //TODO remove line
            } catch (JSONException e) {
                Log.e("Error: ABL getData", e.getLocalizedMessage());
                e.printStackTrace();
            }
        }

        //TODO cleanup, testing get accounts
        public void getHiveAccounts() {

            //TODO in RN: pass only the same object(stringifyed) as the actual Asyncstoraged.
            //TODO here.
            //  - getData from sharedStorage.
            //  - !.show then skip, keep message of "open the app" as it is now.
            //  - if any to show:
            //      - get condenser_api.get_dynamic_global_properties as we need it to calculate bellow.
            //      - then loop the array, get the account(s) data + make the calculations
            //      - present data as expected.
            //  - handle network error if rpc or any other.
            //////
            String URL = "https://api.hive.blog";
            try {
                final JSONObject jsonBody = new JSONObject("{\"jsonrpc\":\"2.0\", \"method\":\"condenser_api.get_accounts\", \"params\":[[\"hiveio\"]], \"id\":1}");
                JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, URL, jsonBody, new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Log.i("Response", response.toString());
                    }
                }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        error.printStackTrace();
                    }
                });
                Volley.newRequestQueue(context).add(jsonObjectRequest);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            //////
        }
        //end testing

        @Override
        public void onCreate() {
            //TODO remove block bellow
                getHiveAccounts(); //Testing on widget creation only
            //end block

            //connect to data source if needed
            getData();
        }

        @Override
        public void onDataSetChanged() {
            getData();
        }

        @Override
        public void onDestroy() {
            //close data source when using DB
        }

        @Override
        public int getCount() {
            return accounts_data.length();
        }

        @Override
        public RemoteViews getViewAt(int position) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_account_balance_list_item);
            try {
                //TODO validate data bellow!.
                Log.i("Current Data: ", accounts_data.toString()); //TODO remove line
                //extract data from JSONObject stored.
                String account_name = "@" + accounts_data.names().getString(position).replace("_", " ");
                JSONObject valuesJsonObject = accounts_data.getJSONObject(accounts_data.names().getString(position));
                views.setTextViewText(R.id.widget_account_balance_list_item_account_name,  account_name);
                views.setTextViewText(R.id.widget_account_balance_list_item_hbd, valuesJsonObject.getString("hbd"));
                views.setTextViewText(R.id.widget_account_balance_list_item_hive, valuesJsonObject.getString("hive"));
                views.setTextViewText(R.id.widget_account_balance_list_item_hive_power, valuesJsonObject.getString("hive_power"));
                views.setTextViewText(R.id.widget_account_balance_list_item_hive_savings, valuesJsonObject.getString("hive_savings"));
                views.setTextViewText(R.id.widget_account_balance_list_item_hbd_savings, valuesJsonObject.getString("hbd_savings"));
                views.setTextViewText(R.id.widget_account_balance_list_item_account_value, valuesJsonObject.getString("account_value") + " USD");
                SystemClock.sleep(500);
                return views;
            } catch (JSONException e) {
                Log.e("Error: ABL getViewAt", e.getLocalizedMessage());
                e.printStackTrace();
            }
            SystemClock.sleep(500);
            return views;
        }

        @Override
        public RemoteViews getLoadingView() {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_account_balance_list_loading_view);
            return views;
        }

        @Override
        public int getViewTypeCount() {
            return 1;
        }

        @Override
        public long getItemId(int position) {
            return position;
        }

        @Override
        public boolean hasStableIds() {
            return true;
        }
    }
}
