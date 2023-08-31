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

        public void getSharedData(){
            try {
                SharedPreferences sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
                String appString = sharedPref.getString("appData", "");
                JSONObject data = new JSONObject(appString);
                accounts_data_RN = new JSONArray(data.getString("account_balance_list"));
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
                accountNamesToShow = accountNamesToFind;
            } catch (JSONException e) {
                Log.e("Error: ABL getData", e.getLocalizedMessage());
                e.printStackTrace();
            }
        }

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
//            getDynamicGlobalProps();
            getSharedData();
        }

        @Override
        public void onDataSetChanged() {
            Log.i("onDataSetChanged", "Executing!!!");
            getSharedData();
            Log.i("ODSC accountNamesT", accountNamesToShow.toString());
            if(accountNamesToShow.size() > 0){
                //fetch extended accounts sync -> finally will set the final accounts_data.
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
                        JSONObject responseExtAccountList = future.get(); // this will block
                        Log.i("Response ext accs:", responseExtAccountList.toString());

                        //TODO testing block if doing the global request is valid here
                        try {
                            final JSONObject jsonBodyGlobalProps = new JSONObject("{\"jsonrpc\":\"2.0\", \"method\":\"condenser_api.get_dynamic_global_properties\", \"params\":[], \"id\":1}");
                            RequestFuture<JSONObject> futureGlobalProps = RequestFuture.newFuture();
                            JsonObjectRequest requestGlobalProps = new JsonObjectRequest(Request.Method.POST, RPC_NODE_URL, jsonBodyGlobalProps, futureGlobalProps, futureGlobalProps);
                            Volley.newRequestQueue(context).add(requestGlobalProps);
                            try {
                                JSONObject responseGlobalProps = futureGlobalProps.get(); // this will block
                                Log.i("Response global props:", responseGlobalProps.toString());
                                try {
                                    JSONObject globalProps = new JSONObject(responseGlobalProps.getString("result"));
                                    Log.i("globalProps", globalProps.toString());
                                    //TODO here assign to global_props.
                                    dynamic_global_properties = globalProps;
                                } catch (JSONException e) {
                                    e.printStackTrace();
                                }
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
                        //TODO END Testing block

                        //calculations + construct the JSONObject as needed to show.
                        try {
                            JSONArray extendedAccountList = new JSONArray(responseExtAccountList.getString("result"));
                            JSONObject accData = new JSONObject();
                            Log.i("ExtAccountList", extendedAccountList.toString());
                            Log.i("TODO important", "Use those props!!");
                            for (int i = 0; i < extendedAccountList.length() ; i++) {
                                //TODO missing account_value, hive_power(check RN widget utils.)
                                JSONObject account_data = extendedAccountList.getJSONObject(i);
                                Double total_vesting_fund_hive = 0.0;
                                Double total_vesting_shares = 0.0;
                                Double hive_power = 0.0;
                                Double vesting_shares_account = 0.0;
                                if(dynamic_global_properties != null){
                                    //TODO check if need to pass to str + split to get just the number + format as double???
                                    String totalVestingFundHive = dynamic_global_properties.getString("total_vesting_fund_hive").split("\\s")[0];
                                    String totalVestingShares = dynamic_global_properties.getString("total_vesting_shares").split("\\s")[0];
                                    String vestingSharesAccount = account_data.getString("vesting_shares").split("\\s")[0];
                                    Log.i("So:", totalVestingFundHive +" // " + totalVestingShares + " // " + vestingSharesAccount);
                                    total_vesting_fund_hive = new Double(totalVestingFundHive);
                                    total_vesting_shares = new Double(totalVestingShares);
                                    vesting_shares_account = new Double(vestingSharesAccount);
                                    hive_power = (vesting_shares_account * total_vesting_fund_hive) / total_vesting_shares;
                                    Log.i("for acc:", account_data.getString("name") +"/hp: "+ hive_power);
                                    //TODO bellow
                                    // - format those values as currency I guess.
                                    // - calculate also the missing account_value
                                    // - add those new items into each accData JSONObject.
                                }
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
            String accountsDataLength = accounts_data == null ? "null" : String.valueOf(accounts_data.length());
            Log.i("WABL getCount", "count:" + accountsDataLength);
            return accounts_data != null ? accounts_data.length() : 0;


        }

        @Override
        public RemoteViews getViewAt(int position) {
            Log.i("WABL getViewAt", "running!");
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_account_balance_list_item);
            try {
                if(accounts_data == null) return views;
                String account_name = "@" + accounts_data.names().getString(position).replace("_", " ");
                JSONObject valuesJsonObject = accounts_data.getJSONObject(accounts_data.names().getString(position));
                views.setTextViewText(R.id.widget_account_balance_list_item_account_name,  account_name);
                views.setTextViewText(R.id.widget_account_balance_list_item_hbd, valuesJsonObject.getString("hbd"));
                views.setTextViewText(R.id.widget_account_balance_list_item_hive, valuesJsonObject.getString("hive"));
                views.setTextViewText(R.id.widget_account_balance_list_item_hive_power, valuesJsonObject.getString("hive_power"));
                views.setTextViewText(R.id.widget_account_balance_list_item_hive_savings, valuesJsonObject.getString("hive_savings"));
                views.setTextViewText(R.id.widget_account_balance_list_item_hbd_savings, valuesJsonObject.getString("hbd_savings"));
                views.setTextViewText(R.id.widget_account_balance_list_item_account_value, valuesJsonObject.getString("account_value") + " USD");
                return views;
            } catch (JSONException e) {
                Log.e("Error: ABL getViewAt", e.getLocalizedMessage());
                e.printStackTrace();
            }
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
