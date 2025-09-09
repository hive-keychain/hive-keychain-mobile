package com.mobilekeychain;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import androidx.annotation.NonNull;

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
}