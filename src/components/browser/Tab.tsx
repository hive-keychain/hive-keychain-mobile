import {
  Account,
  ActionPayload,
  BrowserPayload,
  Page,
  Tab,
} from 'actions/interfaces';
import CustomRefreshControl from 'components/ui/CustomRefreshControl';
import {BrowserScreenProps} from 'navigators/mainDrawerStacks/Browser.types';
import React, {
  memo,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {GestureDetector} from 'react-native-gesture-handler';
import {WebView} from 'react-native-webview';
import {UserPreference} from 'reducers/preferences.types';
import {useTab} from 'src/context/tab.context';
import {Theme} from 'src/context/theme.context';
import {getAllowedBrowserNavigationUrl} from 'utils/browser.utils';
import {BrowserConfig} from 'utils/config.utils';
import HomeTab from './HomeTab';
import ProgressBar from './ProgressBar';
import {DESKTOP_MODE} from './bridges/DesktopMode';
import {
  FIND_IN_PAGE_CLEAR,
  FIND_IN_PAGE_SPA_CLEANUP,
} from './bridges/FindInPage';
import {hive_keychain} from './bridges/HiveKeychainBridge';
import {IMAGE_DOWNLOAD_SCRIPT} from './bridges/ImageDownload';
import {LINK_LONG_PRESS_SCRIPT} from './bridges/LinkLongPress';
import {BRIDGE_WV_INFO} from './bridges/WebviewInfo';
import LinkTooltip from './tab/LinkTooltip';
import {LinkTooltipState} from './tab/types';
import {useBrowserTabBridge} from './tab/useBrowserTabBridge';
import {useBrowserTabGestures} from './tab/useBrowserTabGestures';
import {useBrowserTabNavigation} from './tab/useBrowserTabNavigation';

type Props = {
  data: Tab;
  active: boolean;
  isManagingTab: boolean;
  accounts: Account[];
  updateTab: (id: number, data: Partial<Tab>) => ActionPayload<BrowserPayload>;
  addToHistory: (history: Page) => ActionPayload<BrowserPayload>;
  navigation: BrowserScreenProps['navigation'];
  preferences: UserPreference[];
  addTab: (
    isManagingTab: boolean,
    tab: Tab,
    webview: MutableRefObject<View | ScrollView>,
    url?: string,
  ) => void;
  orientation: string;
  theme: Theme;
};

export default memo(
  ({
    data,
    active,
    updateTab,
    accounts,
    navigation,
    addToHistory,
    isManagingTab,
    preferences,
    addTab,
    theme,
  }: Props) => {
    const {url, id, icon, desktop: desktopMode} = data;
    const tabRef: MutableRefObject<WebView> = useRef(null);
    const tabParentRef: MutableRefObject<ScrollView> = useRef(null);
    const homeRef: MutableRefObject<View> = useRef(null);
    const [linkTooltip, setLinkTooltip] = useState<LinkTooltipState | null>(
      null,
    );
    const {
      setWebViewRef,
      setTabViewRef,
      updateFindInPageCount,
      closeFindInPage,
    } = useTab();
    const closeLinkTooltip = () => {
      setLinkTooltip(null);
    };

    const injectedJavaScriptBeforeContentLoaded = `${hive_keychain}\n${LINK_LONG_PRESS_SCRIPT}`;
    const injectedJavaScript = desktopMode
      ? `${DESKTOP_MODE}\n${IMAGE_DOWNLOAD_SCRIPT}\n${LINK_LONG_PRESS_SCRIPT}`
      : `${IMAGE_DOWNLOAD_SCRIPT}\n${LINK_LONG_PRESS_SCRIPT}`;

    const {
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
    } = useBrowserTabNavigation({
      active,
      data,
      tabRef,
      updateTab,
      addToHistory,
      closeLinkTooltip,
      onNavigationStart: (webview) => {
        webview.injectJavaScript(FIND_IN_PAGE_CLEAR);
      },
      onNavigationEnd: (webview) => {
        webview.injectJavaScript(BRIDGE_WV_INFO);
        webview.injectJavaScript(IMAGE_DOWNLOAD_SCRIPT);
        webview.injectJavaScript(LINK_LONG_PRESS_SCRIPT);
        webview.injectJavaScript(FIND_IN_PAGE_SPA_CLEANUP);
      },
    });

    const {
      canRefresh,
      canRefreshCanvas,
      isFlutterApp,
      onMessage,
      openLinkInCurrentTab,
      openLinkInAnotherTab,
      copyLinkToClipboard,
      shareLink,
    } = useBrowserTabBridge({
      accounts,
      data,
      preferences,
      navigation,
      tabRef,
      tabParentRef,
      updateTab,
      addTab,
      updateFindInPageCount,
      closeFindInPage,
      isLoading,
      setLinkTooltip,
    });

    const gesture = useBrowserTabGestures({goBack, goForward});

    useEffect(() => {
      if (tabRef.current && active) {
        setWebViewRef(tabRef.current);
      }
      if (tabParentRef.current && active) {
        setTabViewRef(tabParentRef.current);
      }
      if (homeRef.current && active) {
        setTabViewRef(homeRef.current);
      }
    }, [active, setTabViewRef, setWebViewRef, url]);

    const refreshControl =
      Platform.OS === 'ios' ? (
        <CustomRefreshControl
          refreshing={refreshing}
          onRefresh={onPullToRefresh}
          enabled={!isFlutterApp && !canRefreshCanvas && canRefresh}
        />
      ) : (
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onPullToRefresh}
          enabled={!isFlutterApp && !canRefreshCanvas && canRefresh}
        />
      );

    return (
      <View
        style={[
          styles.container,
          !active || isManagingTab ? styles.hide : null,
        ]}>
        <View style={styles.content}>
          <ProgressBar progress={progress} />

          {url === BrowserConfig.HOMEPAGE_URL ? (
            <HomeTab
              updateTabUrl={updateTabUrl}
              homeRef={homeRef}
              accounts={accounts}
              theme={theme}
            />
          ) : null}
          <GestureDetector gesture={gesture}>
            <ScrollView
              contentContainerStyle={
                url === BrowserConfig.HOMEPAGE_URL
                  ? styles.hide
                  : styles.container
              }
              ref={tabParentRef}
              refreshControl={refreshControl}>
              {url !== BrowserConfig.HOMEPAGE_URL ? (
                <WebView
                  originWhitelist={['*']}
                  source={{uri: url}}
                  domStorageEnabled={true}
                  ref={tabRef}
                  injectedJavaScriptBeforeContentLoaded={
                    injectedJavaScriptBeforeContentLoaded
                  }
                  injectedJavaScript={injectedJavaScript}
                  mediaPlaybackRequiresUserAction={false}
                  onMessage={onMessage}
                  javaScriptEnabled
                  bounces={false}
                  pullToRefreshEnabled={false}
                  geolocationEnabled
                  allowsLinkPreview={false}
                  allowsInlineMediaPlayback
                  allowsFullscreenVideo
                  onLoadEnd={onLoadEnd}
                  onLoadStart={onLoadStart}
                  onLoadProgress={onLoadProgress}
                  onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
                  onNavigationStateChange={onNavigationStateChange}
                  onError={(error) => {
                    console.log('Error', error);
                  }}
                  onHttpError={() => {
                    // console.log('HttpError', error);
                  }}
                  onOpenWindow={(event) => {
                    const allowedNavigationUrl = getAllowedBrowserNavigationUrl(
                      event.nativeEvent.targetUrl,
                    );
                    if (!allowedNavigationUrl) {
                      return;
                    }
                    addTab(
                      false,
                      {url, icon, id},
                      tabParentRef,
                      allowedNavigationUrl.url,
                    );
                  }}
                  useWebView2
                />
              ) : null}
            </ScrollView>
          </GestureDetector>
        </View>
        <LinkTooltip
          linkTooltip={linkTooltip}
          theme={theme}
          onClose={closeLinkTooltip}
          onOpenCurrent={openLinkInCurrentTab}
          onOpenAnother={openLinkInAnotherTab}
          onCopy={copyLinkToClipboard}
          onShare={shareLink}
        />
      </View>
    );
  },
  (prevProps, nextProps) => {
    return !nextProps.active && !prevProps.active;
  },
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'column',
  },
  content: {flexGrow: 1},
  hide: {flex: 0, opacity: 0, display: 'none', width: 0, height: 0},
});
