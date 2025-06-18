// WebViewContext.js
import React, {createContext, useCallback, useContext, useRef} from 'react';
import {WebView} from 'react-native-webview';

const TabContext = createContext(null);

export const TabProvider = ({children}: {children: React.ReactNode}) => {
  const webViewRef = useRef<WebView>(null);
  const tabViewRef = useRef<WebView>(null);

  const setWebViewRef = useCallback((ref: WebView) => {
    webViewRef.current = ref;
  }, []);

  const setTabViewRef = useCallback((ref: WebView) => {
    tabViewRef.current = ref;
  }, []);

  return (
    <TabContext.Provider
      value={{setWebViewRef, webViewRef, setTabViewRef, tabViewRef}}>
      {children}
    </TabContext.Provider>
  );
};

export const useTab = () => useContext(TabContext);
