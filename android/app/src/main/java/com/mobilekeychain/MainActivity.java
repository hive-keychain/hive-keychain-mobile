package com.mobilekeychain;
import android.content.Context;
import android.os.Bundle; // <- add this necessary import

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.zoontek.rnbootsplash.RNBootSplash; // <- add this necessary import

import com.facebook.react.ReactActivity;
import android.content.Intent; // <--- import
import android.content.res.Configuration; // <--- import
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.Nullable;

public class MainActivity extends ReactActivity {

  private Context context;

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
   
  @Override
  protected String getMainComponentName() {
    return "mobileKeychain";
  }
  @Override
      public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }
     @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState); // or super.onCreate(null) with react-native-screens
    RNBootSplash.init(R.drawable.bootsplash, MainActivity.this); // display the generated bootsplash.xml drawable over our MainActivity
    context = getApplicationContext();
    Toast.makeText(context, "Created app!!", Toast.LENGTH_LONG).show();
  }

  public static void sendReactEvent(ReactContext reactContext,
                                    String eventName,
                                    @Nullable WritableMap params) {
    reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
  }


  public void refreshCurrencyData(View view) {
    //TODO for now just send a message to RN app on each update iteration
//        WritableMap params = Arguments.createMap();
//        params.putString("currency", "update_values");
//        AppWidgetProvider appWidgetProvider = new AppWidgetProvider();
//        ReactApplication rnApp = (ReactApplication)  appWidgetProvider.c .context.getApplicationContext();
//        ReactContext reactContext = rnApp.getReactNativeHost().getReactInstanceManager().getCurrentReactContext();
//        MainActivity.sendReactEvent(reactContext,"command_event", params);
    //end TODO
//    Toast.makeText(context, "Clicked!", Toast.LENGTH_LONG).show();
  }
}
