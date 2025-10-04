package com.mobilekeychain;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import androidx.annotation.NonNull;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;

public class WidgetBridge extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContextStatic;

    public WidgetBridge(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
        reactContextStatic = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "WidgetBridge";
    }

    /**
     * Emit an event to JS from any ReactContext
     */
    public static void emitCommandEvent(ReactApplicationContext reactContext, String eventName, WritableMap params) {
        if (reactContext != null) {
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
        }
    }

    /**
     * Emit event using stored static ReactApplicationContext
     */
    public static void emitCommandEventStatic(String eventName, WritableMap params) {
        emitCommandEvent(reactContextStatic, eventName, params);
    }

    @ReactMethod
    public void readAndClearPendingCommand(Promise promise) {
        try {
            android.content.Context ctx = getReactApplicationContext();
            android.content.SharedPreferences prefs = ctx.getSharedPreferences("KeychainWidget", android.content.Context.MODE_PRIVATE);
            String command = prefs.getString("pendingCommand", null);
            if (command != null) {
                prefs.edit().remove("pendingCommand").apply();
            }
            com.facebook.react.bridge.WritableMap result = com.facebook.react.bridge.Arguments.createMap();
            if (command != null) {
                result.putString("configureWidgets", "true");
            }
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("ERR_READ_PENDING", e);
        }
    }

    @ReactMethod
    public void setWidgetData(String json, Promise promise) {
        try {
            Context ctx = getReactApplicationContext();
            android.content.SharedPreferences prefs = ctx.getSharedPreferences("DATA", Context.MODE_PRIVATE);
            prefs.edit().putString("appData", json).apply();
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("ERR_SET_DATA", e);
        }
    }

    @ReactMethod
    public void refreshWidgets(String target, Promise promise) {
        try {
            Context ctx = getReactApplicationContext();
            AppWidgetManager widgetManager = AppWidgetManager.getInstance(ctx);
            ComponentName widgetComponent = new ComponentName(ctx, WidgetAccountBalanceListProvider.class);
            int[] widgetIds = widgetManager.getAppWidgetIds(widgetComponent);
            for (int widgetId : widgetIds) {
                widgetManager.notifyAppWidgetViewDataChanged(widgetId, R.id.widget_account_balance_list_stack_view);
            }
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("ERR_REFRESH_WIDGETS", e);
        }
    }

    // Required for NativeEventEmitter bridge compatibility
    @ReactMethod
    public void addListener(String eventName) {
        // No-op: RN requires this for NativeEventEmitter
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // No-op: RN requires this for NativeEventEmitter
    }
}