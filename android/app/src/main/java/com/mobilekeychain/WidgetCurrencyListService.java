package com.mobilekeychain;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Point;
import android.graphics.Shader;
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

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.ListIterator;
import java.util.Locale;
import java.util.Random;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

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
                //2nd Fetching data as sync
                RequestFuture<JSONObject> futureHistoryPrices = RequestFuture.newFuture();
                JsonObjectRequest requestHistoryPrices = new JsonObjectRequest(Request.Method.GET,KEYCHAIN_PRICE_HISTORY_API_URL, new JSONObject(), futureHistoryPrices, futureHistoryPrices);
                Volley.newRequestQueue(context).add(requestHistoryPrices);
                try {
                    JSONObject responseHistoryPrices = futureHistoryPrices.get(); // this will block
                    currency_prices_history_data = responseHistoryPrices;
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
                //set icon dynamically
                views.setImageViewResource(R.id.widget_currency_list_currency_icon, !currency_name.contains("hive dollar") ? R.drawable.hive_icon : R.drawable.hbd_icon);
                //New Chart
                String currency_tendency = currency_usd_24h_change_value.contains("-") ? "down" : "up";
                Bitmap currency_chart = drawChart(250.0f,100.0f, currency_name,false,false, true, currency_tendency);
                //set remote view
                views.setImageViewBitmap(R.id.widget_currency_list_chart, currency_chart);
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

        public Bitmap drawChart(float bitmap_width, float bitmap_height, String currency_name, boolean drawPoints, boolean draw_as_bars, boolean drawExtraLines, String tendency) throws JSONException {
            //Data fetched array + calculations
            if(currency_name.contains("hive dollar")) currency_name = "hbd";
            JSONArray prices_array = currency_prices_history_data.getJSONArray(currency_name);
            List<Double> currency_prices_list = new ArrayList<Double>();
            //extract double from JSONObject
            for (int i = 0; i < prices_array.length(); i++) {
                currency_prices_list.add(prices_array.getDouble(i));
            }

            Double max_currency_price = Collections.max(currency_prices_list);
            Double min_currency_price = Collections.min(currency_prices_list);
            Integer count_hive_price_data = currency_prices_list.size();
            Float step_in_px = bitmap_width/ count_hive_price_data;

            //canvas/chart
            Float point_radius = 4f;
            Bitmap bitmap = Bitmap.createBitmap(Math.round(bitmap_width), Math.round(bitmap_height), Bitmap.Config.ARGB_8888);
            Canvas canvas_chart = new Canvas(bitmap);
            //flip canvas vertically
            canvas_chart.scale(1f, -1f, bitmap_width* 0.5f, bitmap_height* 0.5f);

            //Draw points loop
            Float next_step = 0.0f;
            List<FloatPoint> pointList = new ArrayList<FloatPoint>();
            Float sourceRangeMin = new Float(min_currency_price);
            Float sourceRangeMax = new Float(max_currency_price);
            Float targetRangeMin = 10.0f;
            Float targetRangeMax = 80.0f;
            //Settings line/paint related(color/width/style)
            Paint paint_chart = new Paint();
            paint_chart.setAntiAlias(true);
            paint_chart.setStrokeWidth(2f);
            Integer graph_color = Color.GREEN; //0xff00ff00
            Integer graph_line_darker_color = Color.parseColor("#00b200");
            if(tendency == "down") {
                graph_color = Color.RED;
                graph_line_darker_color = Color.parseColor("#b20000");
            }

            for (int i = 0; i < currency_prices_list.size(); i++) {
                Float roundedData = new Float(String.valueOf(currency_prices_list.get(i)));
                //normalization between 2 ranges.
                Float px = getScaledValue(roundedData, sourceRangeMin, sourceRangeMax, targetRangeMin, targetRangeMax);
                //optional
                if(drawPoints) canvas_chart.drawCircle(next_step,px,1f,paint_chart);

                FloatPoint point = new FloatPoint(next_step,px);
                pointList.add(point);
                //optional
                if(draw_as_bars) canvas_chart.drawLine(next_step,0, next_step,px,paint_chart);
                next_step += step_in_px;
            }

            ListIterator<FloatPoint> li = pointList.listIterator();
            FloatPoint firstPoint  = li.next();
            Path graph_path = new Path();
            boolean init_path = true;
            FloatPoint lastPoint = null;
            if(drawExtraLines) paint_chart.setColor(graph_line_darker_color);
            while (li.hasNext()) {
                if(li.hasNext()){
                    FloatPoint secondPoint = li.next();
                    //bellow using bezier
                    FloatPoint connection_point_1 = new FloatPoint((secondPoint.getX() + firstPoint.getX()) / 2f, firstPoint.getY());
                    FloatPoint connection_point_2 = new FloatPoint((secondPoint.getX() + firstPoint.getX()) / 2f, secondPoint.getY());
                    if(drawExtraLines) canvas_chart.drawLine(firstPoint.getX(),firstPoint.getY(),secondPoint.getX(), secondPoint.getY(), paint_chart);
                    if(init_path){
                        graph_path.moveTo(firstPoint.getX(),0);
                        //next line no bezier
//                        graph_path.lineTo(firstPoint.getX(),firstPoint.getY());

                        //bellow using bezier
                        graph_path.cubicTo(
                                connection_point_1.getX(), connection_point_1.getY(), connection_point_2.getX(), connection_point_2.getY(),
                                firstPoint.getX(), firstPoint.getY()
                        );

                        init_path = false;
                    }else{
                        //next line no bezier
//                        graph_path.lineTo(secondPoint.getX(), secondPoint.getY());

                        //bellow using bezier
                        graph_path.cubicTo(
                                connection_point_1.getX(), connection_point_1.getY(), connection_point_2.getX(), connection_point_2.getY(),
                                secondPoint.getX(), secondPoint.getY()
                        );
                    }
                    firstPoint = secondPoint;
                    lastPoint = secondPoint;
                }
            }
            //path
            //set last path point
            graph_path.lineTo(bitmap_width,0);
            graph_path.lineTo(0,0);
            graph_path.close();

            //gradient
            paint_chart.setShader(new LinearGradient(0f, 0f, 0f, bitmap_height /2, Color.TRANSPARENT, graph_color, Shader.TileMode.MIRROR));
            paint_chart.setStyle(Paint.Style.FILL_AND_STROKE);
            paint_chart.setColor(graph_color);
            canvas_chart.drawPath(graph_path, paint_chart);
            return bitmap;
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
