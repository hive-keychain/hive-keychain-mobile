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

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.concurrent.ExecutionException;

public class WidgetAccountBalanceListService extends RemoteViewsService {
    private JSONObject accounts_data;
    private JSONArray accounts_data_RN;
    private ArrayList<String> accountNamesToShow;
    private JSONObject dynamic_global_properties;
    private final String RPC_NODE_URL = "https://api.hive.blog";

    @Override
    public RemoteViewsFactory onGetViewFactory(Intent intent) {
        return new AppWidgetItemFactory(getApplicationContext(), intent);
    }

    class AppWidgetItemFactory implements RemoteViewsFactory {
        private final  Context context;
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
                accounts_data_RN = new JSONArray(data.getString("account_balance_list"));
                Log.i("getData, accs RN ", accounts_data_RN.toString()); //TODO remove line
                //TODO cleanup
                //Check what to fetch will finally set accountNamesToShow
                //iterate and show
                ArrayList<String> accountNamesToFind = new ArrayList<String>();
                for (int i = 0; i < accounts_data_RN.length(); i++) {
                    try {
                        JSONObject account = accounts_data_RN.getJSONObject(i);
                        Log.i("Account: ", account.toString());
                        if(account.getBoolean("show") == true){
                            accountNamesToFind.add(account.getString("name"));
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
                //TODO validate if at least 1 acc to find.
                accountNamesToShow = accountNamesToFind;
                Log.i("getData/accountNamesTo",accountNamesToFind.toString());
            } catch (JSONException e) {
                Log.e("Error: ABL getData", e.getLocalizedMessage());
                e.printStackTrace();
            }
        }

        //TODO cleanup, testing get accounts
        public void getHiveAccounts(ArrayList<String> accountNames) {

            //TODO in RN: pass only the same object(stringify) as the actual Asyncstoraged.
            //TODO here.
            //  - getData from sharedStorage.
            //  - !.show then skip, keep message of "open the app" as it is now.
            //  - if any to show:
            //      - get condenser_api.get_dynamic_global_properties as we need it to calculate bellow.
            //      - then loop the array, create a new array with when show === true.
            //          - get the account(s) data, using this new array + make the calculations
            //              - for each account: hive, hbd, hive_power, hive_savings, hbd_savings, account_value, avatar(optional check in RN widget config popup, as it may consume more data in phone)
            //          - present data as expected.
            //  - handle network error if rpc or any other.
            //  - try to refactor, using only one request that returns a JSONObject or empty, etc.
            //////

            try {
                String json = String.format("{" +
                        "\"jsonrpc\":\"2.0\"," +
                        " \"method\":\"condenser_api.get_accounts\"," +
                        " \"params\":[%s]," +
                        " \"id\":1}",accountNames.toString());
                Log.i("json", json);
                final JSONObject jsonBody = new JSONObject(json);
                JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, RPC_NODE_URL, jsonBody, new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Log.i("Response", response.toString());
                        try {
                            JSONArray extendedAccountList = new JSONArray(response.getString("result"));
                            JSONObject accData = new JSONObject();
                            Log.i("ExtAccountList", extendedAccountList.toString());
                            for (int i = 0; i < extendedAccountList.length() ; i++) {
                                //TODO missing account_value, hive_power(check RN widget utils.)
                                JSONObject account_data = extendedAccountList.getJSONObject(i);
                                Log.i("extended acc", account_data.toString());
                                accData.put(account_data.getString("name"),
                                        new JSONObject()
                                                .put("hive", account_data.getString("balance"))
                                                .put("hbd", account_data.getString("hbd_balance"))
                                                .put("hive_savings", account_data.getString("savings_balance"))
                                                .put("hbd_savings", account_data.getString("savings_hbd_balance"))
                                                .put("hive_power", "1000 HP")
                                                .put("account_value", "1,000.00")
                                        );
                            }
                            Log.i("accData", accData.toString());
                            accounts_data = accData;
//                            Log.i("Finally accounts_data", accounts_data.toString());
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
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

        //TODO somehow mahe it return the value: JSONObject || {}(if error or null)
        public void getDynamicGlobalProps(){
            try {
                String URL = "https://api.hive.blog";
                final JSONObject jsonBody = new JSONObject("{\"jsonrpc\":\"2.0\", \"method\":\"condenser_api.get_dynamic_global_properties\", \"params\":[], \"id\":1}");
                JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, URL, jsonBody, new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        Log.i("Response", "get_dynamic_global_properties" + "/" + response.toString());
                            try {
                                dynamic_global_properties = response.getJSONObject("result");
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
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
        }

        @Override
        public void onCreate() {
            getDynamicGlobalProps();
            getData();
        }

        @Override
        public void onDataSetChanged() {
            Log.i("onDataSetChanged", "Executing!!!");
            //TODo may need some kind of validation at first run?
            getData();
            Log.i("ODSC accountNamesT", accountNamesToShow.toString());
            if(accountNamesToShow.size() > 0){
                //fetch extended accounts sync -> finally will set the final accounts_data.
                //Fetching data as sync
                String json = String.format("{" +
                        "\"jsonrpc\":\"2.0\"," +
                        " \"method\":\"condenser_api.get_accounts\"," +
                        " \"params\":[%s]," +
                        " \"id\":1}",accountNamesToShow.toString());
                Log.i("json", json);
                final JSONObject jsonBody;
                try {
                    jsonBody = new JSONObject(json);
                    RequestFuture<JSONObject> future = RequestFuture.newFuture();
                    JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST,RPC_NODE_URL, jsonBody, future, future);
                    Volley.newRequestQueue(context).add(request);
                    try {
                        JSONObject response = future.get(); // this will block
                        //
                        Log.i("Response", response.toString());
                        try {
                            JSONArray extendedAccountList = new JSONArray(response.getString("result"));
                            JSONObject accData = new JSONObject();
                            Log.i("ExtAccountList", extendedAccountList.toString());
                            for (int i = 0; i < extendedAccountList.length() ; i++) {
                                //TODO missing account_value, hive_power(check RN widget utils.)
                                JSONObject account_data = extendedAccountList.getJSONObject(i);
                                Log.i("extended acc", account_data.toString());
                                accData.put(account_data.getString("name"),
                                        new JSONObject()
                                                .put("hive", account_data.getString("balance"))
                                                .put("hbd", account_data.getString("hbd_balance"))
                                                .put("hive_savings", account_data.getString("savings_balance"))
                                                .put("hbd_savings", account_data.getString("savings_hbd_balance"))
                                                .put("hive_power", "1000 HP")
                                                .put("account_value", "1,000.00")
                                );
                            }
                            Log.i("accData", accData.toString());
                            accounts_data = accData;
//                            Log.i("Finally accounts_data", accounts_data.toString());
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        //
                    } catch (InterruptedException e) {
                        // exception handling
                        Log.e("Fetch Int excep", e.getLocalizedMessage());
                    } catch (ExecutionException e) {
                        // exception handling
                        Log.e("ODSC exception ex", e.getLocalizedMessage());
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                //End fetching sync
            }else{
                accounts_data = null;
            }
            //TODO what if no data to show? reset?
        }

        @Override
        public void onDestroy() {
            //close data source when using DB
        }

        @Override
        public int getCount() {
            return accounts_data != null ? accounts_data.length() : 0;
        }

        @Override
        public RemoteViews getViewAt(int position) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_account_balance_list_item);
            try {
//                //TODO testing validation here
//                if(accounts_data == null || accounts_data.length() < 1) return views;

                //TODO validate data bellow!.
                if(accounts_data == null) return views;
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
                //TODO bellow commented to see if this is why sometimes do not update properly
//                SystemClock.sleep(500);
                return views;
            } catch (JSONException e) {
                Log.e("Error: ABL getViewAt", e.getLocalizedMessage());
                e.printStackTrace();
            }
//            SystemClock.sleep(500);
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
