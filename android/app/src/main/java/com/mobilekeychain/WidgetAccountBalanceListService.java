package com.mobilekeychain;

import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.SystemClock;
import android.util.Log;
import android.view.ViewGroup;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;
import org.json.JSONException;
import org.json.JSONObject;

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
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void onCreate() {
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
                //extract data from JSONObject stored.
                String account_name = "@" + accounts_data.names().getString(position).replace("_", " ");
                JSONObject valuesJsonObject = accounts_data.getJSONObject(accounts_data.names().getString(position));
                Log.i("account_name", account_name); //TODO delete
                Log.i("valuesJsonObject", valuesJsonObject.toString()); //TODO delete
                views.setTextViewText(R.id.widget_account_balance_list_item_account_name,  account_name);
                views.setTextViewText(R.id.widget_account_balance_list_item_hbd, valuesJsonObject.getString("hbd"));
                views.setTextViewText(R.id.widget_account_balance_list_item_hive, valuesJsonObject.getString("hive"));
                views.setTextViewText(R.id.widget_account_balance_list_item_hive_power, valuesJsonObject.getString("hive_power"));
                views.setTextViewText(R.id.widget_account_balance_list_item_hive_savings, valuesJsonObject.getString("hive_savings"));
                views.setTextViewText(R.id.widget_account_balance_list_item_hbd_savings, valuesJsonObject.getString("hbd_savings"));
                views.setTextViewText(R.id.widget_account_balance_list_item_account_value, valuesJsonObject.getString("account_value") + " USD"); //TODO...
                SystemClock.sleep(500);
                return views;
            } catch (JSONException e) {
                Log.i("Error: getViewAt", e.getLocalizedMessage());
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
