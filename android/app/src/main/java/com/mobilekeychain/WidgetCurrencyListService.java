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

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Random;
import java.util.concurrent.ExecutionException;

public class WidgetCurrencyListService extends RemoteViewsService {
    private JSONObject currency_data;
    private JSONObject currency_prices_history_data;
    private final String KEYCHAIN_PRICE_API_URL = "https://api.hive-keychain.com/hive/v2/price";
    private final String KEYCHAIN_PRICE_HISTORY_API_URL = "https://api.hive-keychain.com/hive/v2/price-history";
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
                //TODO add new request from https://api.hive-keychain.com/hive/v2/price-history
                //Fetching data as sync
                RequestFuture<JSONObject> futureHistoryPrices = RequestFuture.newFuture();
                JsonObjectRequest requestHistoryPrices = new JsonObjectRequest(Request.Method.GET,KEYCHAIN_PRICE_HISTORY_API_URL, new JSONObject(), futureHistoryPrices, futureHistoryPrices);
                Volley.newRequestQueue(context).add(requestHistoryPrices);
                try {
                    JSONObject responseHistoryPrices = futureHistoryPrices.get(); // this will block
                    currency_prices_history_data = responseHistoryPrices;
                    Log.i("responseHistoryPrices", responseHistoryPrices.toString());
                    //TODO use this data.
                    //end new request
                } catch (InterruptedException e) {
                    // exception handling
                    Log.e("Fetch Int excep", e.getLocalizedMessage());
                } catch (ExecutionException e) {
                    Log.e("WCL Execp:", e.getLocalizedMessage());
                    // exception handling
                }
                //End fetching sync
                //end new request
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

                //TODO bellow pass to its own function or class, should return the bitmap.
                //definitions
                Float bitmap_width = 200.0f;
                Float bitmap_height = 100.0f;
                Float high_24h = 1.0f;
                Float low_24h = 0.5f;

                //temp data array + calculations
                List<Double> hive_prices_list = Arrays.asList(0.2739,0.2741,0.2741,0.2729,0.273,0.2732,0.2738,0.2734,0.2731,0.2738,0.2722,0.2725,0.2728,0.2729,0.2725,0.2729,0.2735,0.2783,0.2739,0.2778,0.2781,0.2755,0.2743,0.2738,0.2748,0.2744,0.2743,0.2746,0.2746,0.2744,0.2734,0.274,0.2743,0.2748,0.2748,0.2747,0.2775,0.2754,0.2754,0.275,0.2747,0.2747,0.2776,0.2748,0.2742,0.2743,0.2735,0.2739);
                //take only 24 prices
                hive_prices_list = hive_prices_list.subList(0,hive_prices_list.size()/2);
                Log.i("new count::", String.valueOf(hive_prices_list.size()));

                Double max_hive_price = Collections.max(hive_prices_list);
                Double min_hive_price = Collections.min(hive_prices_list);
                Integer count_hive_price_data = hive_prices_list.size();
                Float step_in_px = bitmap_width/ count_hive_price_data;
                Log.i("Range:", "max:" + max_hive_price + "/ min:" + min_hive_price);
                Log.i("total count:", String.valueOf(count_hive_price_data));
                Log.i("step px:", String.valueOf(step_in_px));

                //canvas/chart
                Float point_radius = 4f;
                Bitmap bitmap = Bitmap.createBitmap(Math.round(bitmap_width), Math.round(bitmap_height), Bitmap.Config.ARGB_8888);
                Canvas canvas_chart = new Canvas(bitmap);
                //TODO important before drawing the canvas flip vertically
//                canvas_chart.scale(-1f, 1f, bitmap_width, bitmap_height);
                canvas_chart.scale(1f, -1f, bitmap_width* 0.5f, bitmap_height* 0.5f);

                //Background canvas color
                canvas_chart.drawColor(getResources().getColor(R.color.light_blue_50));
                Paint paint_chart = new Paint();
                //line related
                paint_chart.setAntiAlias(true);
                paint_chart.setStrokeWidth(3f);
                paint_chart.setColor(Color.BLACK);
                paint_chart.setStyle(Paint.Style.STROKE);

                //draw axis lines
//                canvas_chart.drawLine(0, 0, 0, bitmap_height, paint_chart);
//                canvas_chart.drawLine(0, bitmap_height, bitmap_width, bitmap_height, paint_chart);

                //TODO commented bellow as no need if range dynamic
                //draw reference line at 1 using offset.
//                Float offset_x_axis_unity = Float.valueOf(bitmap_height /2);
//                paint_chart.setTextSize(10.0f);
//                canvas_chart.drawText("1", 5, offset_x_axis_unity - 10, paint_chart);
//                paint_chart.setColor(getResources().getColor(R.color.teal_700));
//                canvas_chart.drawLine(0,offset_x_axis_unity,bitmap_width,offset_x_axis_unity,paint_chart);

                //Draw points loop for now reducing to 1 hour = 24 prices.
                Float next_step = 0.0f;
                Float count = 0.0f;
                for (int i = 0; i < hive_prices_list.size(); i++) {
                    Random rand = new Random();
                    Double randomY = rand.nextDouble() * (max_hive_price - min_hive_price) + min_hive_price;
                    BigDecimal roundedY = new BigDecimal(randomY).setScale(4, RoundingMode.HALF_UP);
                    Float roundedData = new Float(String.valueOf(roundedY));
                    //linear interpolation
                    Float px = getScaledValue(roundedData, new Float(min_hive_price),new Float(max_hive_price),20.0f,80.0f);
                    //end linear
//                    Double px = 100 * ((randomY - min_hive_price) / max_hive_price);
                    Log.i("roundedY", String.valueOf(roundedY));
                    Log.i("Px translation", String.valueOf(px));
                    //drawing points
                    canvas_chart.drawCircle(next_step,px,2f,paint_chart);
                    //drawing as bars
                    canvas_chart.drawLine(next_step,0, next_step,px,paint_chart);
                    next_step += step_in_px;
                }

                //set remote view
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

        public Float getScaledValue(float value, float sourceRangeMin, float sourceRangeMax, float targetRangeMin, float targetRangeMax) {
            float targetRange = targetRangeMax - targetRangeMin;
            float sourceRange = sourceRangeMax - sourceRangeMin;
            return (value - sourceRangeMin) * targetRange / sourceRange + targetRangeMin;
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
