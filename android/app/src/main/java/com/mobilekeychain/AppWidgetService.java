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

        public void getData(){
            try {
                SharedPreferences sharedPref = context.getSharedPreferences("DATA", Context.MODE_PRIVATE);
                String appString = sharedPref.getString("appData", "");
                currency_data = new JSONObject(appString);
                Log.i("currency_data", currency_data.toString()); //TODO to remove line
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void onCreate() {
            //connect to data source if needed
            getData();
            //TODO remove line bellow as this is only tutorial's sample
            SystemClock.sleep(3000);
        }

        @Override
        public void onDataSetChanged() {
            Log.i("onDataSetChanged", "so ask new data"); //TODO remove line
            getData();
            SystemClock.sleep(1500);
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
                String currency_name = currency_data.names().getString(position).replace("_", " ");
                JSONObject valuesJsonObject = currency_data.getJSONObject(currency_data.names().getString(position));
                String currency_value_usd = "$" + valuesJsonObject.getString("usd");
                String currency_usd_24h_change_value = valuesJsonObject.getString("usd_24h_change") + "%";
                RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.appwidget_item);
                //set values for currency item
                views.setTextViewText(R.id.appwidget_currency_name, currency_name.toUpperCase());
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
                Log.i("Error: getViewAt", e.getLocalizedMessage()); //TODO remove line
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
