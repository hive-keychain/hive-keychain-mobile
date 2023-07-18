package com.mobilekeychain;

import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.SystemClock;
import android.util.Log;
import android.view.View;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;

import androidx.core.content.ContextCompat;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Map;

public class AppWidgetService extends RemoteViewsService {
    private JSONObject currency_data;

    @Override
    public RemoteViewsFactory onGetViewFactory(Intent intent) {
        return new AppWidgetItemFactory(getApplicationContext(), intent);
    }

    class AppWidgetItemFactory implements RemoteViewsFactory {
        private Context context;
        private  int appWidgetId;
        private String[] exampleData = {"one", "two", "three"};
        private ArrayList currencyValues;

        AppWidgetItemFactory(Context context, Intent intent){
                this.context = context;
                this.appWidgetId = intent.getIntExtra(AppWidgetManager.EXTRA_APPWIDGET_ID,
                        AppWidgetManager.INVALID_APPWIDGET_ID);
        }

        @Override
        public void onCreate() {
            //connect to data source if needed
            try {
                SharedPreferences sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
                String appString = sharedPref.getString("appData", "");
                currency_data = new JSONObject(appString);

//                for(int i = 0; i<appData.names().length(); i++){
//                    String key = appData.names().getString(i);
//                    JSONObject value = appData.getJSONObject(appData.names().getString(i));
//                    Log.v("DATA_CURRENCY", "key = " + key + " value = " + value.toString());
//                    Log.v("DATA_CURRENCY",key + " " + value.getString("usd") + " " + value.getString("usd_24h_change"));
//                    currency_list_values.add(new CurrencyData(key,value.getString("usd"), value.getString("usd_24h_change")));
//                }
//                Log.v("currency_list_values", currency_list_values[0]);
            } catch (JSONException e) {
                e.printStackTrace();
            }
            //TODO remove line bellow as this is only tutorial's sample
            SystemClock.sleep(3000);
        }

        @Override
        public void onDataSetChanged() {

        }

        @Override
        public void onDestroy() {
            //close data source when using DB
        }

        @Override
        public int getCount() {
            return currency_data.names().length();
        }

        @Override
        public RemoteViews getViewAt(int position) {
            try {
                //extract data from JSONObject stored.
                String currency_name = currency_data.names().getString(position);
                JSONObject valuesJsonObject = currency_data.getJSONObject(currency_data.names().getString(position));
                String currency_value_usd = valuesJsonObject.getString("usd");
                String currency_usd_24h_change_value = valuesJsonObject.getString("usd_24h_change");
                RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.appwidget_item);
                views.setTextViewText(R.id.appwidget_item_text, currency_name);
                //set values for currency item
                views.setTextViewText(R.id.appwidget_currency_name, currency_name);
                views.setTextViewText(R.id.appwidget_currency_value_usd, currency_value_usd);
                views.setTextViewText(R.id.appwidget_currency_usd_24h_change_value,currency_usd_24h_change_value);
                //logic to change icons + color
                if(currency_usd_24h_change_value.contains("-")){
                    views.setTextColor(R.id.appwidget_currency_usd_24h_change_value, ContextCompat.getColor(context, R.color.red));
                    views.setViewVisibility(R.id.appwidget_icon_direction_down, View.VISIBLE);
                    views.setViewVisibility(R.id.appwidget_icon_direction_up, View.GONE);
                }else{
                    views.setTextColor(R.id.appwidget_currency_usd_24h_change_value, ContextCompat.getColor(context, R.color.green));
                    views.setViewVisibility(R.id.appwidget_icon_direction_up, View.VISIBLE);
                    views.setViewVisibility(R.id.appwidget_icon_direction_down, View.GONE);
                }
                //TODO remove line bellow, this is only sample tutorial
                SystemClock.sleep(500);
                return views;
            } catch (JSONException e) {
                e.printStackTrace();
            }
            //TODO is this right thing to do here??
            return null;
        }

        @Override
        public RemoteViews getLoadingView() {
            return null;
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
