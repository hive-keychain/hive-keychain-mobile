package com.mobilekeychain;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.SystemClock;
import android.util.Log;
import android.view.View;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;
import androidx.core.content.ContextCompat;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.RequestFuture;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ExecutionException;

public class WidgetCurrencyListService extends RemoteViewsService {
    private JSONObject currency_data;
    private final String KEYCHAIN_PRICE_API_URL = "https://api.hive-keychain.com/hive/v2/price";
    private static final List<String> not_showing_currency_list = Arrays.asList("bitcoin");

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

        @Override
        public void onCreate() {}

        @Override
        public void onDataSetChanged() {
            Log.i("ODSC Currencies", "Should Update!"); //TODO remove
            //Fetching data as sync
            RequestFuture<JSONObject> future = RequestFuture.newFuture();
            JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET,KEYCHAIN_PRICE_API_URL, new JSONObject(), future, future);
            Volley.newRequestQueue(context).add(request);
            try {
                JSONObject response = future.get(); // this will block
                //removing currencies from array list
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                    not_showing_currency_list.forEach((currency) -> {
                        if(response.has(currency)){
                            response.remove(currency);
                        }
                    });
                }
                currency_data = response;
            } catch (InterruptedException e) {
                // exception handling
                Log.e("Fetch Int excep", e.getLocalizedMessage());
            } catch (ExecutionException e) {
                // exception handling
                if(e.getLocalizedMessage().contains("Unable to resolve host")){
                    currency_data = null; //reset as no internet
                    //no internet data enabled
                    RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_currency_list);
                    views.setTextViewText(R.id.widget_currency_list_stack_empty_view, "Please enable internet & retry refresh");
                    views.setTextViewTextSize(R.id.widget_currency_list_stack_empty_view,1,12);
                    AppWidgetManager widgetManager = AppWidgetManager.getInstance(context);
                    ComponentName widgetComponentCurrency = new ComponentName(context, WidgetCurrencyListProvider.class);
                    int[] widgetIdsCurrency = widgetManager.getAppWidgetIds(widgetComponentCurrency);
                    widgetManager.updateAppWidget(widgetIdsCurrency,views);
                }
            }
            //End fetching sync
        }

        @Override
        public void onDestroy() {
            //close data source when using DB
        }

        @Override
        public int getCount() {
            String currencyDataLength = currency_data == null ? "null" : String.valueOf(currency_data.length());
            Log.i("WCL service getCount", "count:" + currencyDataLength);
            return currency_data == null ? 0 : currency_data.length();

        }

        @Override
        public RemoteViews getViewAt(int position) {
            Log.i("WCL getViewAt", "pos: " + position); //TODO remove
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_currency_list_item);
            try {
                //extract data from JSONObject stored.
                String currency_name = currency_data.names().getString(position).replace("_", " ");
                    JSONObject valuesJsonObject = currency_data.getJSONObject(currency_data.names().getString(position));
                    //formatting
                    NumberFormat nf = NumberFormat.getCurrencyInstance(new Locale("en", "US"));
                    String currency_value_usd = nf.format(valuesJsonObject.getDouble("usd"));
                    String currency_usd_24h_change_value = String.format("%.2f", valuesJsonObject.getDouble("usd_24h_change")) + "%";
                    //set values for currency item
                    views.setTextViewText(R.id.widget_currency_list_item_currency_name, currency_name.toUpperCase());
                    views.setTextViewText(R.id.widget_currency_list_item_currency_value_usd, currency_value_usd);
                    views.setTextViewText(R.id.widget_currency_list_item_currency_usd_24h_change_value, currency_usd_24h_change_value);
                    //logic to change icons + color
                    if (currency_usd_24h_change_value.contains("-")) {
                        views.setTextColor(R.id.widget_currency_list_item_currency_usd_24h_change_value, ContextCompat.getColor(context, R.color.red));
                        views.setViewVisibility(R.id.widget_currency_list_item_icon_direction_down, View.VISIBLE);
                        views.setViewVisibility(R.id.widget_currency_list_item_icon_direction_up, View.GONE);
                    } else {
                        views.setTextColor(R.id.widget_currency_list_item_currency_usd_24h_change_value, ContextCompat.getColor(context, R.color.green));
                        views.setViewVisibility(R.id.widget_currency_list_item_icon_direction_up, View.VISIBLE);
                        views.setViewVisibility(R.id.widget_currency_list_item_icon_direction_down, View.GONE);
                    }
                    //TODO commented bellow while fixing the update issue!
//                    SystemClock.sleep(500);
            } catch (JSONException e) {
                Log.e("Error: CL getViewAt", e.getLocalizedMessage());
                e.printStackTrace();
            }
            SystemClock.sleep(800);
            return views;
//            SystemClock.sleep(500);
//            return views;
        }

        @Override
        public RemoteViews getLoadingView() {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_currency_list_loading_view);
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
