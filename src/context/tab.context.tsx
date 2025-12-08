// WebViewContext.js
import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { WebView } from "react-native-webview";

const TabContext = createContext(null);

export const TabProvider = ({ children }: { children: React.ReactNode }) => {
  const webViewRef = useRef<WebView>(null);
  const tabViewRef = useRef<WebView>(null);
  const [findInPageCount, setFindInPageCount] = useState({ count: 0, current: 0 });

  const setWebViewRef = useCallback((ref: WebView) => {
    webViewRef.current = ref;
  }, []);

  const setTabViewRef = useCallback((ref: WebView) => {
    tabViewRef.current = ref;
  }, []);

  const updateFindInPageCount = useCallback((count: number, current: number) => {
    setFindInPageCount({ count, current });
  }, []);

  return (
    <TabContext.Provider
      value={{ 
        setWebViewRef, 
        webViewRef, 
        setTabViewRef, 
        tabViewRef,
        findInPageCount,
        updateFindInPageCount
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

export const useTab = () => useContext(TabContext);
