package com.mobilekeychain;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.os.SystemClock;
import android.util.Log;
import android.view.View;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;
import android.widget.Toast;

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
        public void onCreate() {
        }

        @Override
        public void onDataSetChanged() {
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
                Log.e("WCL Execp:", e.getLocalizedMessage());
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
            return currency_data == null ? 0 : currency_data.length();

        }

        @Override
        public RemoteViews getViewAt(int position) {
            RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_currency_list_item);
            try {
                //validation
                if(currency_data == null) return views;
                //extract data from JSONObject stored.
                String currency_name = currency_data.names().getString(position).replace("_", " ");
                JSONObject valuesJsonObject = currency_data.getJSONObject(currency_data.names().getString(position));
                //formatting
                NumberFormat nf = NumberFormat.getCurrencyInstance(new Locale("en", "US"));
                String currency_value_usd = nf.format(valuesJsonObject.getDouble("usd"));
                String currency_usd_24h_change_value = String.format("%.2f", valuesJsonObject.getDouble("usd_24h_change")) + "%";
                //validate & remove the -
                String currency_change_no_minus = currency_usd_24h_change_value.contains("-") ? currency_usd_24h_change_value.split("\\-")[1] : currency_usd_24h_change_value;
                //set values for currency item
                views.setTextViewText(R.id.widget_currency_list_item_currency_name, currency_name.toUpperCase());
                views.setTextViewText(R.id.widget_currency_list_item_currency_value_usd, currency_value_usd);
                views.setTextViewText(R.id.widget_currency_list_item_currency_usd_24h_change_value, currency_change_no_minus);
                //TODO important:
                //  - find if possible to use the MPAndroidChart if not in widget -> remove implementation.
                //TODO 24h_low, 24h_high should come from BE, for testing added.
                // - keep working in this.
                Float high_24h = 1.0f;
                Float low_24h = 0.5f;
                //canvas/chart
                Float point_radius = 4f;
                Integer bitmap_width = 200;
                Integer bitmap_height = 100;
                Bitmap bitmap = Bitmap.createBitmap(bitmap_width, bitmap_height, Bitmap.Config.ARGB_8888);
                Canvas canvas_chart = new Canvas(bitmap);
                //Background canvas color
                canvas_chart.drawColor(getResources().getColor(R.color.light_blue_50));
                Paint paint_chart = new Paint();
                //line related
                paint_chart.setAntiAlias(true);
                paint_chart.setStrokeWidth(3f);
                paint_chart.setColor(Color.BLACK);
                paint_chart.setStyle(Paint.Style.STROKE);
                //draw axis lines
                canvas_chart.drawLine(0, 0, 0, bitmap_height, paint_chart);
                canvas_chart.drawLine(0, bitmap_height, bitmap_width, bitmap_height, paint_chart);
                //draw reference line at 1 using offset.
                Float offset_x_axis_unity = Float.valueOf(bitmap_height /2);
                paint_chart.setTextSize(10.0f);
                canvas_chart.drawText("1", 5, offset_x_axis_unity - 10, paint_chart);
                paint_chart.setColor(getResources().getColor(R.color.teal_700));
                canvas_chart.drawLine(0,offset_x_axis_unity,bitmap_width,offset_x_axis_unity,paint_chart);
                //Draw points
                // high
                paint_chart.setColor(getResources().getColor(R.color.green));
                Float add_x_axis = 50.0f;
                Float high_y_point = high_24h < 1.0f ? offset_x_axis_unity + (high_24h * offset_x_axis_unity) : (high_24h * offset_x_axis_unity) - offset_x_axis_unity;
                Log.i("high_y_point", high_y_point.toString()); //TODO remove line
                canvas_chart.drawCircle( high_24h * 10 + add_x_axis, high_y_point, point_radius, paint_chart);
                //low
                paint_chart.setColor(getResources().getColor(R.color.red));
                Float low_y_point = low_24h < 1.0f ? offset_x_axis_unity + (low_24h * offset_x_axis_unity) : offset_x_axis_unity - (low_24h * offset_x_axis_unity);
                Log.i("low_y_point", low_y_point.toString()); //TODO remove line
                canvas_chart.drawCircle( add_x_axis * 3, low_y_point, point_radius, paint_chart);
                views.setImageViewBitmap(R.id.widget_currency_list_chart, bitmap);
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
            } catch (JSONException e) {
                Log.e("Error: CL getViewAt", e.getLocalizedMessage());
                e.printStackTrace();
            }
            try {
                Thread.sleep(600);
            } catch (InterruptedException e) {
                Log.e("ErrorWCL Int Excep", e.getLocalizedMessage());
                e.printStackTrace();
            }
            return views;
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
