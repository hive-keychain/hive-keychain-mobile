import {useFocusEffect} from '@react-navigation/native';
import {
  ActionPayload,
  BrowserPayload,
  Page,
  Tab,
} from 'actions/interfaces';
import {
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import {BackHandler} from 'react-native';
import {WebView} from 'react-native-webview';
import {
  ShouldStartLoadRequest,
  WebViewNativeEvent,
  WebViewNavigation,
  WebViewProgressEvent,
} from 'react-native-webview/lib/WebViewTypes';
import {getAllowedBrowserNavigationUrl} from 'utils/browser.utils';

const areEquivalentUrls = (a?: string, b?: string) => {
  if (!a || !b) return a === b;
  return a === b || `${a}/` === b || `${b}/` === a;
};

type Params = {
  active: boolean;
  data: Tab;
  tabRef: MutableRefObject<WebView>;
  updateTab: (id: number, data: Partial<Tab>) => ActionPayload<BrowserPayload>;
  addToHistory: (history: Page) => ActionPayload<BrowserPayload>;
  closeLinkTooltip: () => void;
  onNavigationStart?: (webview: WebView) => void;
  onNavigationEnd?: (webview: WebView) => void;
};

export const useBrowserTabNavigation = ({
  active,
  data,
  tabRef,
  updateTab,
  addToHistory,
  closeLinkTooltip,
  onNavigationStart,
  onNavigationEnd,
}: Params) => {
  const {url, id} = data;
  const [progress, setProgress] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingUrl, setPendingUrl] = useState('');
  const urlUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nativeCanGoBackRef = useRef(false);
  const nativeCanGoForwardRef = useRef(false);

  useEffect(() => {
    addToHistory({url: data.url, name: data.name, icon: data.icon});
  }, [addToHistory, data.url, data.name, data.icon]);

  const onRefresh = () => {
    setRefreshing(true);
    tabRef.current?.reload();
  };

  const onPullToRefresh = () => {
    onRefresh();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getPersistedNavigation = () => {
    const history =
      data.navigationHistory && data.navigationHistory.length
        ? data.navigationHistory
        : [data.url];
    const index =
      typeof data.navigationIndex === 'number'
        ? Math.min(Math.max(data.navigationIndex, 0), history.length - 1)
        : history.length - 1;
    return {history, index};
  };

  const goBackFallback = () => {
    const {history, index} = getPersistedNavigation();
    if (index <= 0) {
      return;
    }
    const previousUrl = history[index - 1];
    if (previousUrl && !areEquivalentUrls(previousUrl, url)) {
      updateTab(id, {url: previousUrl});
    }
  };

  const goForwardFallback = () => {
    const {history, index} = getPersistedNavigation();
    if (index >= history.length - 1) {
      return;
    }
    const nextUrl = history[index + 1];
    if (nextUrl && !areEquivalentUrls(nextUrl, url)) {
      updateTab(id, {url: nextUrl});
    }
  };

  const goBack = () => {
    const {history, index} = getPersistedNavigation();
    if (index > 0 && history.length > 1) {
      goBackFallback();
      return;
    }
    const {current} = tabRef;
    if (nativeCanGoBackRef.current && current) {
      current.goBack();
    } else {
      goBackFallback();
    }
  };

  const goForward = () => {
    const {history, index} = getPersistedNavigation();
    if (index < history.length - 1 && history.length > 1) {
      goForwardFallback();
      return;
    }
    const {current} = tabRef;
    if (nativeCanGoForwardRef.current && current) {
      current.goForward();
    } else {
      goForwardFallback();
    }
  };

  useFocusEffect(() => {
    if (!active) return;
    const backAction = () => {
      goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  });

  useEffect(() => {
    return () => {
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current);
      }
    };
  }, [active, url]);

  const debouncedUpdateUrl = (newUrl: string) => {
    const allowedNavigationUrl = getAllowedBrowserNavigationUrl(newUrl);
    if (!allowedNavigationUrl) {
      setPendingUrl('');
      setIsLoading(false);
      return;
    }

    if (urlUpdateTimeoutRef.current) {
      clearTimeout(urlUpdateTimeoutRef.current);
    }

    urlUpdateTimeoutRef.current = setTimeout(() => {
      if (!areEquivalentUrls(allowedNavigationUrl.url, url)) {
        updateTab(id, {url: allowedNavigationUrl.url});
      }
      setPendingUrl('');
      setIsLoading(false);
    }, 500);
  };

  const onLoadStart = ({nativeEvent}: {nativeEvent: WebViewNativeEvent}) => {
    const allowedNavigationUrl = getAllowedBrowserNavigationUrl(
      nativeEvent.url,
    );
    if (!allowedNavigationUrl) {
      setIsLoading(false);
      setPendingUrl('');
      return;
    }

    setIsLoading(true);
    setPendingUrl(allowedNavigationUrl.url);
    closeLinkTooltip();

    if (urlUpdateTimeoutRef.current) {
      clearTimeout(urlUpdateTimeoutRef.current);
    }

    if (tabRef.current && onNavigationStart) {
      onNavigationStart(tabRef.current);
    }
  };

  const updateTabUrl = (link: string) => {
    const allowedNavigationUrl = getAllowedBrowserNavigationUrl(link);
    if (allowedNavigationUrl) {
      updateTab(id, {url: allowedNavigationUrl.url});
    }
  };

  const onLoadProgress = ({
    nativeEvent: {progress},
  }: WebViewProgressEvent) => {
    setProgress(progress === 1 ? 0 : progress);
  };

  const onLoadEnd = ({
    nativeEvent: {loading, url},
  }: {
    nativeEvent: WebViewNativeEvent;
  }) => {
    const allowedNavigationUrl = getAllowedBrowserNavigationUrl(url);
    const {current} = tabRef;
    setProgress(0);
    setIsLoading(false);

    if (loading) {
      return;
    }

    if (!allowedNavigationUrl) {
      setPendingUrl('');
      return;
    }

    if (allowedNavigationUrl.url !== pendingUrl && pendingUrl !== '') {
      debouncedUpdateUrl(allowedNavigationUrl.url);
    } else {
      if (!areEquivalentUrls(allowedNavigationUrl.url, data.url)) {
        updateTab(id, {url: allowedNavigationUrl.url});
      }
      setPendingUrl('');
    }

    if (current && onNavigationEnd) {
      onNavigationEnd(current);
    }
  };

  const onShouldStartLoadWithRequest = ({
    url: requestUrl,
  }: ShouldStartLoadRequest) => {
    const allowedNavigationUrl = getAllowedBrowserNavigationUrl(requestUrl);
    if (allowedNavigationUrl) {
      return true;
    }

    closeLinkTooltip();
    setPendingUrl('');
    setIsLoading(false);
    return false;
  };

  const onNavigationStateChange = (navigationState: WebViewNavigation) => {
    const allowedNavigationUrl = getAllowedBrowserNavigationUrl(
      navigationState.url,
    );
    nativeCanGoBackRef.current = navigationState.canGoBack;
    nativeCanGoForwardRef.current = navigationState.canGoForward;
    if (!allowedNavigationUrl) {
      return;
    }
    if (!areEquivalentUrls(allowedNavigationUrl.url, data.url)) {
      updateTab(id, {url: allowedNavigationUrl.url});
    }
  };

  return {
    progress,
    refreshing,
    isLoading,
    updateTabUrl,
    onPullToRefresh,
    onLoadStart,
    onLoadEnd,
    onLoadProgress,
    onShouldStartLoadWithRequest,
    onNavigationStateChange,
    goBack,
    goForward,
  };
};
