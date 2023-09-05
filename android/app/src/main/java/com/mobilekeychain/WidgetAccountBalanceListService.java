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
import android.widget.Toast;

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
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.concurrent.ExecutionException;

public class WidgetAccountBalanceListService extends RemoteViewsService {
    private JSONObject accounts_data;
    private JSONObject currency_data;
    private JSONArray accounts_data_RN;
    private ArrayList<String> accountNamesToShow;
    private JSONObject dynamic_global_properties;
    private final String RPC_NODE_URL = "https://api.hive.blog";
    private final String KEYCHAIN_PRICE_API_URL = "https://api.hive-keychain.com/hive/v2/price";

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
                if(appString.length() == 0) return;
                JSONObject data = new JSONObject(appString);
                accounts_data_RN = new JSONArray(data.getString("account_balance_list"));
                ArrayList<String> accountNamesToFind = new ArrayList<String>();
                for (int i = 0; i < accounts_data_RN.length(); i++) {
                    try {
                        JSONObject account = accounts_data_RN.getJSONObject(i);
                        if(account.getBoolean("show") == true){
                            accountNamesToFind.add(account.getString("name"));
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                        Log.e("WABL JSON exec", e.getLocalizedMessage());
                    }
                }
                accountNamesToShow = accountNamesToFind;
            } catch (JSONException e) {
                Log.e("Error: ABL getData", e.getLocalizedMessage());
                e.printStackTrace();
            }
        }
        @Override
        public void onCreate() {
            getSharedData();
            //TODO testing bellow to no matter what fire the dataChanged, issue: calling twice getSharedData??
//            onDataSetChanged();
        }

        @Override
        public void onDataSetChanged() {
            getSharedData();
            if(accountNamesToShow != null && accountNamesToShow.size() > 0){
                //fetch extended accounts sync -> finally will set the final accounts_data.
                String json = String.format("{" +
                        "\"jsonrpc\":\"2.0\"," +
                        " \"method\":\"condenser_api.get_accounts\"," +
                        " \"params\":[%s]," +
                        " \"id\":1}",accountNamesToShow.toString());
                final JSONObject jsonBody;
                try {
                    jsonBody = new JSONObject(json);
                    RequestFuture<JSONObject> future = RequestFuture.newFuture();
                    JsonObjectRequest request = new JsonObjectRequest(Request.Method.POST,RPC_NODE_URL, jsonBody, future, future);
                    Volley.newRequestQueue(context).add(request);
                    try {
                        JSONObject responseExtAccountList = future.get(); // this will block

                        //Second Request, get global_props
                        try {
                            final JSONObject jsonBodyGlobalProps = new JSONObject("{\"jsonrpc\":\"2.0\", \"method\":\"condenser_api.get_dynamic_global_properties\", \"params\":[], \"id\":1}");
                            RequestFuture<JSONObject> futureGlobalProps = RequestFuture.newFuture();
                            JsonObjectRequest requestGlobalProps = new JsonObjectRequest(Request.Method.POST, RPC_NODE_URL, jsonBodyGlobalProps, futureGlobalProps, futureGlobalProps);
                            Volley.newRequestQueue(context).add(requestGlobalProps);
                            try {
                                JSONObject responseGlobalProps = futureGlobalProps.get(); // this will block

                                try {
                                    JSONObject globalProps = new JSONObject(responseGlobalProps.getString("result"));
                                    dynamic_global_properties = globalProps;
                                    //Third request, prices.
                                    RequestFuture<JSONObject> futureCurrencies = RequestFuture.newFuture();
                                    JsonObjectRequest requestCurrencies = new JsonObjectRequest(Request.Method.GET,KEYCHAIN_PRICE_API_URL, new JSONObject(), futureCurrencies, futureCurrencies);
                                    Volley.newRequestQueue(context).add(requestCurrencies);
                                    try {
                                        JSONObject responseCurrencies = futureCurrencies.get(); // this will block
                                        currency_data = responseCurrencies;
                                    } catch (InterruptedException e) {
                                        // exception handling
                                        Log.e("Int Excep currencies", e.getLocalizedMessage());
                                    } catch (ExecutionException e) {
                                        // exception handling
                                        Log.e("Exec Excep currencies", e.getLocalizedMessage());
                                    }
                                    //END third request

                                } catch (JSONException e) {
                                    e.printStackTrace();
                                    Log.e("JSON Excep currencies", e.getLocalizedMessage());
                                }
                            } catch (InterruptedException e) {
                                // exception handling
                                Log.e("Int Excep get_dynamic", e.getLocalizedMessage());
                            } catch (ExecutionException e) {
                                // exception handling
                                Log.e("Excep get_dynamic", e.getLocalizedMessage());
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                            Log.e("JSON Excep get_dynamic", e.getLocalizedMessage());
                        }
                        //End Second Request, get global_props

                        //calculations + construct the JSONObject as needed to show.
                        try {
                            JSONArray extendedAccountList = new JSONArray(responseExtAccountList.getString("result"));
                            JSONObject accData = new JSONObject();
                            for (int i = 0; i < extendedAccountList.length() ; i++) {
                                JSONObject account_data = extendedAccountList.getJSONObject(i);
                                accData.put(account_data.getString("name"),
                                        new JSONObject()
                                                .put("hive", account_data.getString("balance").split("\\s")[0])
                                                .put("hbd", account_data.getString("hbd_balance").split("\\s")[0])
                                                .put("hive_savings", account_data.getString("savings_balance").split("\\s")[0])
                                                .put("hbd_savings", account_data.getString("savings_hbd_balance").split("\\s")[0])
                                                .put("hive_power", new DecimalFormat("0.00").format(Utils.toHp(account_data,dynamic_global_properties)))
                                                .put("account_value", Utils.getAccountValue(account_data,currency_data,dynamic_global_properties))
                                );
                            }
                            accounts_data = accData;
                        } catch (JSONException e) {
                            e.printStackTrace();
                            Log.e("JSON Excep calculations", e.getLocalizedMessage());
                        }
                        //end calculations
                    } catch (InterruptedException e) {
                        // exception handling
                        Log.e("Int Excep get_accounts", e.getLocalizedMessage());
                    } catch (ExecutionException e) {
                        // exception handling
                        Log.e("Excep get_accounts", e.getLocalizedMessage());
                        if(e.getLocalizedMessage().contains("Unable to resolve host")){
                            accounts_data = null; //reset as no internet
                            //no internet data enabled
                            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_account_balance_list);
                            views.setTextViewText(R.id.widget_account_balance_list_stack_empty_view, "Please enable internet & retry refresh");
                            views.setTextViewTextSize(R.id.widget_account_balance_list_stack_empty_view,1,12);
                            AppWidgetManager widgetManager = AppWidgetManager.getInstance(context);
                            ComponentName widgetComponentAccountBalance = new ComponentName(context, WidgetAccountBalanceListProvider.class);
                            int[] widgetIdsAccountBalance = widgetManager.getAppWidgetIds(widgetComponentAccountBalance);
                            widgetManager.updateAppWidget(widgetIdsAccountBalance,views);
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                    Log.e("JSON exc get_accounts", e.getLocalizedMessage());
                }
                //End fetching sync
            }else{
                accounts_data = null;
            }
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
                if(accounts_data == null) return views;
                String account_name = "@" + accounts_data.names().getString(position).replace("_", " ");
                JSONObject valuesJsonObject = accounts_data.getJSONObject(accounts_data.names().getString(position));
                views.setTextViewText(R.id.widget_account_balance_list_item_account_name,  account_name);
                views.setTextViewText(R.id.widget_account_balance_list_item_hbd, valuesJsonObject.getString("hbd"));
                views.setTextViewText(R.id.widget_account_balance_list_item_hive, valuesJsonObject.getString("hive"));
                views.setTextViewText(R.id.widget_account_balance_list_item_hive_power, valuesJsonObject.getString("hive_power"));
                views.setTextViewText(R.id.widget_account_balance_list_item_hive_savings, valuesJsonObject.getString("hive_savings"));
                views.setTextViewText(R.id.widget_account_balance_list_item_hbd_savings, valuesJsonObject.getString("hbd_savings"));
                views.setTextViewText(R.id.widget_account_balance_list_item_account_value, valuesJsonObject.getString("account_value"));
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
