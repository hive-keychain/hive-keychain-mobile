import {useFocusEffect} from '@react-navigation/native';
import {showFloatingBar, toggleHideFloatingBar} from 'actions/floatingBar';
import {
  Account,
  ActionPayload,
  BrowserPayload,
  KeyTypes,
  Page,
  Tab,
} from 'actions/interfaces';
import Icon from 'components/hive/Icon';
import CustomRefreshControl from 'components/ui/CustomRefreshControl';
import * as Clipboard from 'expo-clipboard';
import {BrowserScreenProps} from 'navigators/mainDrawerStacks/Browser.types';
import React, {
  memo,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  BackHandler,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {runOnJS} from 'react-native-reanimated';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import {
  ShouldStartLoadRequest,
  WebViewMessageEvent,
  WebViewNativeEvent,
  WebViewProgressEvent,
} from 'react-native-webview/lib/WebViewTypes';
import {UserPreference} from 'reducers/preferences.types';
import {useTab} from 'src/context/tab.context';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {ProviderEvent} from 'src/enums/providerEvent.enum';
import {RequestError, RequestSuccess} from 'src/interfaces/keychain.interface';
import {getColors} from 'src/styles/colors';
import {button_link_primary_small} from 'src/styles/typography';
import {store} from 'store';
import {
  getAllowedBrowserNavigationUrl,
  urlTransformer,
} from 'utils/browser.utils';
import {BrowserConfig} from 'utils/config.utils';
import {getAccount} from 'utils/hive.utils';
import {downloadFromUrl} from 'utils/image.utils';
import {
  getRequestTitle,
  getRequiredWifType,
  sendError,
  sendResponse,
  validateAuthority,
  validateRequest,
} from 'utils/keychain.utils';
import {translate} from 'utils/localize';
import {MultisigUtils} from 'utils/multisig.utils';
import {navigate, goBack as navigationGoBack} from 'utils/navigation.utils';
import {hasPreference} from 'utils/preferences.utils';
import {requestWithoutConfirmation} from 'utils/requestWithoutConfirmation.utils';
import HomeTab from './HomeTab';
import MediaDownloadModal from './MediaDownloadModal';
import ProgressBar from './ProgressBar';
import RequestModalContent from './RequestModalContent';
import {DESKTOP_MODE} from './bridges/DesktopMode';
import {
  FIND_IN_PAGE_CLEAR,
  FIND_IN_PAGE_SPA_CLEANUP,
} from './bridges/FindInPage';
import {hive_keychain} from './bridges/HiveKeychainBridge';
import {IMAGE_DOWNLOAD_SCRIPT} from './bridges/ImageDownload';
import {LINK_LONG_PRESS_SCRIPT} from './bridges/LinkLongPress';
import {BRIDGE_WV_INFO} from './bridges/WebviewInfo';
import RequestErr from './requestOperations/components/RequestError';

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

const LINK_TOOLTIP_WIDTH = 240;
const LINK_TOOLTIP_HEIGHT = 184;
const LINK_TOOLTIP_MARGIN = 0;
const LINK_TOOLTIP_LINK_GAP_ABOVE = 0;
const LINK_TOOLTIP_LINK_GAP_BELOW = 25;

type LinkTooltipState = {
  url: string;
  x: number;
  y: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

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
    orientation,
    theme,
  }: Props) => {
    const {url, id, icon, name, desktop: desktopMode} = data;
    const tabRef: MutableRefObject<WebView> = useRef(null);
    const tabParentRef: MutableRefObject<ScrollView> = useRef(null);
    const homeRef: MutableRefObject<View> = useRef(null);
    const [progress, setProgress] = useState(0);
    const insets = useSafeAreaInsets();
    const [canRefresh, setCanRefresh] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const {
      setWebViewRef,
      setTabViewRef,
      updateFindInPageCount,
      closeFindInPage,
    } = useTab();
    const [isFlutterApp, setIsFlutterApp] = useState(false);
    const [canRefreshCanvas, setCanRefreshCanvas] = useState(true);
    const [flutterDomain, setFlutterDomain] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [pendingUrl, setPendingUrl] = useState('');
    const [linkTooltip, setLinkTooltip] = useState<LinkTooltipState | null>(
      null,
    );
    const urlUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const nativeCanGoBackRef = useRef(false);
    const nativeCanGoForwardRef = useRef(false);
    const {width: screenWidth, height: screenHeight} = useWindowDimensions();
    const injectedJavaScriptBeforeContentLoaded = `${hive_keychain}\n${LINK_LONG_PRESS_SCRIPT}`;
    const injectedJavaScript = desktopMode
      ? `${DESKTOP_MODE}\n${IMAGE_DOWNLOAD_SCRIPT}\n${LINK_LONG_PRESS_SCRIPT}`
      : `${IMAGE_DOWNLOAD_SCRIPT}\n${LINK_LONG_PRESS_SCRIPT}`;
    const areEquivalentUrls = (a?: string, b?: string) => {
      if (!a || !b) return a === b;
      return a === b || `${a}/` === b || `${b}/` === a;
    };
    useEffect(() => {
      addToHistory({url: data.url, name: data.name, icon: data.icon});
    }, [data.url, data.name, data.icon]);
    const onRefresh = () => {
      setRefreshing(true);
      tabRef.current?.reload(); // reload the WebView
    };
    const colorPalette = getColors(theme);
    const styles = getStyles(insets, theme);
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

    // Debounced URL update to handle redirects
    const debouncedUpdateUrl = (newUrl: string) => {
      const allowedNavigationUrl = getAllowedBrowserNavigationUrl(newUrl);
      if (!allowedNavigationUrl) {
        setPendingUrl('');
        setIsLoading(false);
        return;
      }

      // Clear any existing timeout
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current);
      }

      // Set a new timeout to update the URL after a short delay
      urlUpdateTimeoutRef.current = setTimeout(() => {
        if (!areEquivalentUrls(allowedNavigationUrl.url, url)) {
          updateTab(id, {url: allowedNavigationUrl.url});
        }
        setPendingUrl('');
        setIsLoading(false);
      }, 500); // 500ms delay to allow redirects to complete
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
      setLinkTooltip(null);

      // Clear any pending URL update
      if (urlUpdateTimeoutRef.current) {
        clearTimeout(urlUpdateTimeoutRef.current);
      }

      // Clear Find in Page highlights when navigation starts
      const {current} = tabRef;
      if (current) {
        current.injectJavaScript(FIND_IN_PAGE_CLEAR);
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

      // If the final URL is different from what we started loading, it might be a redirect
      if (allowedNavigationUrl.url !== pendingUrl && pendingUrl !== '') {
        // Use debounced update for potential redirects
        debouncedUpdateUrl(allowedNavigationUrl.url);
      } else {
        // Normal navigation, update immediately
        if (!areEquivalentUrls(allowedNavigationUrl.url, data.url)) {
          updateTab(id, {url: allowedNavigationUrl.url});
        }
        setPendingUrl('');
      }

      if (current) {
        current.injectJavaScript(BRIDGE_WV_INFO);
        current.injectJavaScript(IMAGE_DOWNLOAD_SCRIPT);
        current.injectJavaScript(LINK_LONG_PRESS_SCRIPT);
        // Clear Find in Page highlights and hook into history API for SPA navigation
        current.injectJavaScript(FIND_IN_PAGE_SPA_CLEANUP);
      }
    };

    const downloadImage = async (imageUrl: string) => {
      if (Platform.OS === 'android') {
        // Show modal for Android
        await downloadFromUrl(imageUrl, (onSave, onShare) => {
          navigate('ModalScreen', {
            name: 'MediaDownload',
            fixedHeight: 0.4,
            modalContent: (
              <MediaDownloadModal
                onSave={() => {
                  onSave(() => {
                    navigationGoBack();
                  });
                }}
                onShare={() => {
                  onShare();
                  navigationGoBack();
                }}
                onCancel={() => {
                  navigationGoBack();
                }}
              />
            ),
            onForceCloseModal: () => {
              navigationGoBack();
            },
          });
        });
      } else {
        // iOS - direct share
        await downloadFromUrl(imageUrl);
      }
    };

    const onMessage = ({nativeEvent}: WebViewMessageEvent) => {
      let messageData;
      try {
        messageData = JSON.parse(nativeEvent.data);
      } catch (error) {
        console.error('Error parsing WebView message:', error);
        return;
      }

      const {
        name: messageName,
        request_id,
        data,
        isAtTop,
        isAtTopOfCanvas,
        showNavigationBar,
        isFlutterCanvasApp,
        domain,
        imageUrl,
        linkUrl,
        x,
        y,
      } = messageData;
      const {current} = tabRef;
      switch (messageName) {
        case ProviderEvent.SCROLL:
          if (canRefresh !== isAtTop) setCanRefresh(isAtTop);
          if (canRefreshCanvas !== isAtTopOfCanvas)
            setCanRefreshCanvas(isAtTopOfCanvas);
          showNavigationBar !== undefined &&
            store.dispatch(showFloatingBar(showNavigationBar));
          break;
        case ProviderEvent.FLUTTER_CHECK:
          if (domain === flutterDomain && isFlutterApp === true) return;
          if (domain !== flutterDomain) setFlutterDomain(domain);
          if (isFlutterApp !== isFlutterCanvasApp) {
            setIsFlutterApp(isFlutterCanvasApp);
          }
          break;
        case ProviderEvent.HANDSHAKE:
          current.injectJavaScript(
            'window.hive_keychain.onAnswerReceived("hive_keychain_handshake")',
          );
          break;
        case ProviderEvent.REQUEST:
          if (validateRequest(data)) {
            data.title = getRequestTitle(data);
            const validateAuth = validateAuthority(accounts, data);
            if (validateAuth.valid) {
              showOperationRequestModal(request_id, data);
            } else {
              sendError(tabRef, {
                error: 'user_cancel',
                message: 'Request was canceled by the user.',
                data,
                request_id,
              });
              navigate('ModalScreen', {
                name: `Operation_${data.type}`,
                modalContent: (
                  <RequestErr
                    onClose={() => {
                      navigationGoBack();
                    }}
                    error={validateAuth.error}
                  />
                ),
              });
            }
          } else {
            sendError(tabRef, {
              error: 'incomplete',
              message: 'Incomplete data or wrong format',
              data,
              request_id,
            });
          }
          break;
        case 'FIND_IN_PAGE_COUNT':
          // Handle find in page count updates
          {
            const findCount = messageData.count;
            const findCurrent = messageData.current;
            if (
              updateFindInPageCount &&
              typeof findCount === 'number' &&
              typeof findCurrent === 'number'
            ) {
              updateFindInPageCount(findCount, findCurrent);
            }
          }
          break;
        case 'FIND_IN_PAGE_NAVIGATION':
          // Close Find in Page modal when navigation occurs
          if (closeFindInPage) {
            closeFindInPage();
          }
          break;
        case ProviderEvent.INFO:
          if (
            data.url !== 'about:blank' &&
            (icon !== data.icon || name !== data.name) &&
            !isLoading
          ) {
            navigation.setParams({icon: data.icon});
            updateTab(id, {name: data.name, icon: data.icon});
          }
          break;
        case ProviderEvent.IMAGE_DOWNLOAD:
          if (imageUrl) {
            downloadImage(imageUrl);
          }
          break;
        case ProviderEvent.LINK_LONG_PRESS:
          if (typeof linkUrl === 'string' && linkUrl.length) {
            setLinkTooltip({
              url: linkUrl,
              x: typeof x === 'number' ? x : LINK_TOOLTIP_MARGIN,
              y: typeof y === 'number' ? y : LINK_TOOLTIP_MARGIN,
            });
          }
          break;
      }
    };
    const showOperationRequestModal = async (request_id: number, data: any) => {
      const {username, domain, type} = data;
      const keyType = getRequiredWifType(data);

      if (
        keyType !== KeyTypes.active &&
        hasPreference(
          preferences,
          username,
          urlTransformer(domain).hostname,
          type,
        ) &&
        username
      ) {
        const selectedAccount = await getAccount(username);
        const user = {
          ...accounts.find((account) => account.name === username),
          account: selectedAccount,
        };
        const [multisig] = await MultisigUtils.getMultisigInfo(keyType, user!);
        requestWithoutConfirmation(
          accounts,
          {...data, request_id},
          (obj: RequestSuccess) => {
            sendResponse(tabRef, obj);
          },
          (obj: RequestError) => {
            sendError(tabRef, obj);
          },
          false,
          {multisig: multisig as boolean, fromWallet: false},
        );
      } else {
        const onForceCloseModal = () => {
          navigationGoBack();
          sendError(tabRef, {
            error: 'user_cancel',
            message: 'Request was canceled by the user.',
            data,
            request_id,
          });
        };
        navigate('ModalScreen', {
          name: `Operation_${data.type}`,
          modalContent: (
            <RequestModalContent
              request={{...data, request_id}}
              accounts={accounts}
              onForceCloseModal={onForceCloseModal}
              sendError={(obj: RequestError) => {
                sendError(tabRef, obj);
              }}
              sendResponse={(obj: RequestSuccess) => {
                sendResponse(tabRef, obj);
              }}
            />
          ),
          onForceCloseModal,
        });
      }
    };

    const swipeLeft = Gesture.Pan()
      .onEnd((event) => {
        const {velocityX} = event;
        if (velocityX < -300) {
          runOnJS(goForward)();
        }
      })
      .hitSlop({
        right: 0,
        width: BrowserConfig.EDGE_THRESHOLD,
      })
      .activeOffsetX([-10, 10]);

    const swipeRight = Gesture.Pan()
      .onEnd((event) => {
        const {velocityX} = event;
        if (velocityX > 300) {
          runOnJS(goBack)();
        }
      })
      .hitSlop({
        left: 0,
        width: BrowserConfig.EDGE_THRESHOLD,
      })
      .activeOffsetX([-10, 10]);

    const dispatchToggleHideFloatingBar = () => {
      store.dispatch(toggleHideFloatingBar());
    };

    const doubleTouch = Gesture.Tap()
      .minPointers(2)
      .onEnd(() => {
        runOnJS(dispatchToggleHideFloatingBar)();
      });

    const swipeOrDoubleTouch = Gesture.Simultaneous(
      swipeLeft,
      swipeRight,
      doubleTouch,
    );

    useEffect(() => {
      if (tabRef?.current && active) setWebViewRef(tabRef.current);
      if (tabParentRef?.current && active) setTabViewRef(tabParentRef.current);
      if (homeRef?.current && active) setTabViewRef(homeRef.current);

      // Cleanup timeout on unmount
      return () => {
        if (urlUpdateTimeoutRef.current) {
          clearTimeout(urlUpdateTimeoutRef.current);
        }
      };
    }, [tabRef, homeRef, active, url]);

    const closeLinkTooltip = () => {
      setLinkTooltip(null);
    };

    const openLinkInCurrentTab = (nextUrl: string) => {
      setLinkTooltip(null);
      const allowedNavigationUrl = getAllowedBrowserNavigationUrl(nextUrl);
      if (allowedNavigationUrl) {
        updateTab(id, {url: allowedNavigationUrl.url});
      }
    };

    const openLinkInAnotherTab = (nextUrl: string) => {
      setLinkTooltip(null);
      const allowedNavigationUrl = getAllowedBrowserNavigationUrl(nextUrl);
      if (!allowedNavigationUrl) {
        return;
      }
      setTimeout(() => {
        addTab(false, {url, icon, id}, tabParentRef, allowedNavigationUrl.url);
      }, 0);
    };

    const copyLinkToClipboard = async (nextUrl: string) => {
      setLinkTooltip(null);
      try {
        await Clipboard.setStringAsync(nextUrl);
      } catch (error) {
        console.error('Error copying URL:', error);
      }
    };

    const shareLink = async (nextUrl: string) => {
      setLinkTooltip(null);
      try {
        await Share.share({
          message: nextUrl,
          url: nextUrl,
        });
      } catch (error) {
        console.error('Error sharing URL:', error);
      }
    };

    const onShouldStartLoadWithRequest = ({
      url: requestUrl,
    }: ShouldStartLoadRequest) => {
      const allowedNavigationUrl = getAllowedBrowserNavigationUrl(requestUrl);
      if (allowedNavigationUrl) {
        return true;
      }

      setLinkTooltip(null);
      setPendingUrl('');
      setIsLoading(false);
      return false;
    };

    const tooltipLeft = linkTooltip
      ? clamp(
          linkTooltip.x - LINK_TOOLTIP_WIDTH / 2,
          LINK_TOOLTIP_MARGIN,
          Math.max(
            LINK_TOOLTIP_MARGIN,
            screenWidth - LINK_TOOLTIP_WIDTH - LINK_TOOLTIP_MARGIN,
          ),
        )
      : LINK_TOOLTIP_MARGIN;
    const tooltipTop = (() => {
      if (!linkTooltip) {
        return LINK_TOOLTIP_MARGIN;
      }
      const maxTop = Math.max(
        LINK_TOOLTIP_MARGIN,
        screenHeight - LINK_TOOLTIP_HEIGHT - LINK_TOOLTIP_MARGIN,
      );
      const belowTop = linkTooltip.y + LINK_TOOLTIP_LINK_GAP_BELOW;
      const aboveTop =
        linkTooltip.y - LINK_TOOLTIP_HEIGHT - LINK_TOOLTIP_LINK_GAP_ABOVE;
      const shouldPreferAbove =
        belowTop > maxTop || linkTooltip.y > screenHeight * 0.65;
      let preferredTop = shouldPreferAbove ? aboveTop : belowTop;
      if (
        shouldPreferAbove &&
        preferredTop < LINK_TOOLTIP_MARGIN &&
        belowTop <= maxTop
      ) {
        preferredTop = belowTop;
      }
      return clamp(preferredTop, LINK_TOOLTIP_MARGIN, maxTop);
    })();

    return (
      <View
        style={[
          styles.container,
          !active || isManagingTab ? styles.hide : null,
        ]}>
        <View style={{flexGrow: 1}}>
          <ProgressBar progress={progress} />

          {url === BrowserConfig.HOMEPAGE_URL ? (
            <HomeTab
              updateTabUrl={updateTabUrl}
              homeRef={homeRef}
              accounts={accounts}
              theme={theme}
            />
          ) : null}
          <GestureDetector gesture={swipeOrDoubleTouch}>
            <ScrollView
              contentContainerStyle={
                url === BrowserConfig.HOMEPAGE_URL
                  ? styles.hide
                  : styles.container
              }
              ref={tabParentRef}
              refreshControl={
                Platform.OS === 'ios' ? (
                  <CustomRefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                      onRefresh();
                      setTimeout(() => setRefreshing(false), 1000);
                    }}
                    enabled={!isFlutterApp && !canRefreshCanvas && canRefresh}
                  />
                ) : (
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                      onRefresh();
                      setTimeout(() => setRefreshing(false), 1000);
                    }}
                    enabled={!isFlutterApp && !canRefreshCanvas && canRefresh}
                  />
                )
              }>
              {url !== BrowserConfig.HOMEPAGE_URL ? (
                <WebView
                  originWhitelist={['*']}
                  source={{
                    uri: url,
                  }}
                  domStorageEnabled={true}
                  allowFileAccess={true}
                  allowUniversalAccessFromFileURLs={true}
                  mixedContentMode={'always'}
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
                  onNavigationStateChange={(navigationState) => {
                    const allowedNavigationUrl = getAllowedBrowserNavigationUrl(
                      navigationState.url,
                    );
                    nativeCanGoBackRef.current = navigationState.canGoBack;
                    nativeCanGoForwardRef.current =
                      navigationState.canGoForward;
                    if (!allowedNavigationUrl) {
                      return;
                    }
                    if (
                      !areEquivalentUrls(allowedNavigationUrl.url, data.url)
                    ) {
                      updateTab(id, {url: allowedNavigationUrl.url});
                    }
                  }}
                  onError={(error) => {
                    console.log('Error', error);
                  }}
                  onHttpError={(error) => {
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
        {linkTooltip ? (
          <>
            <Pressable
              style={styles.linkTooltipBackdrop}
              onPress={closeLinkTooltip}
            />
            <View
              style={[
                styles.linkTooltipContainer,
                {left: tooltipLeft, top: tooltipTop},
              ]}>
              <TouchableOpacity
                style={styles.linkTooltipAction}
                activeOpacity={0.8}
                onPress={() => openLinkInCurrentTab(linkTooltip.url)}>
                <View style={styles.linkTooltipActionContent}>
                  <Icon
                    theme={theme}
                    name={Icons.OPEN}
                    width={16}
                    height={16}
                    color={colorPalette.secondaryText}
                  />
                  <Text style={styles.linkTooltipActionText}>
                    {translate('browser.link_long_press.open')}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.linkTooltipDivider} />
              <TouchableOpacity
                style={styles.linkTooltipAction}
                activeOpacity={0.8}
                onPress={() => openLinkInAnotherTab(linkTooltip.url)}>
                <View style={styles.linkTooltipActionContent}>
                  <Icon
                    theme={theme}
                    name={Icons.ADD_TAB}
                    width={16}
                    height={16}
                    color={colorPalette.secondaryText}
                  />
                  <Text style={styles.linkTooltipActionText}>
                    {translate('browser.link_long_press.open_in_another_tab')}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.linkTooltipDivider} />
              <TouchableOpacity
                style={styles.linkTooltipAction}
                activeOpacity={0.8}
                onPress={() => copyLinkToClipboard(linkTooltip.url)}>
                <View style={styles.linkTooltipActionContent}>
                  <Icon
                    theme={theme}
                    name={Icons.COPY}
                    width={16}
                    height={16}
                    color={colorPalette.secondaryText}
                  />
                  <Text style={styles.linkTooltipActionText}>
                    {translate('browser.link_long_press.copy_link')}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.linkTooltipDivider} />
              <TouchableOpacity
                style={styles.linkTooltipAction}
                activeOpacity={0.8}
                onPress={() => shareLink(linkTooltip.url)}>
                <View style={styles.linkTooltipActionContent}>
                  <Icon
                    theme={theme}
                    name={Icons.SHARE}
                    width={16}
                    height={16}
                    color={colorPalette.secondaryText}
                  />
                  <Text style={styles.linkTooltipActionText}>
                    {translate('common.share')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </View>
    );
  },
  (prevProps, nextProps) => {
    return !nextProps.active && !prevProps.active;
  },
);

const getStyles = (insets: EdgeInsets, theme: Theme) => {
  const colors = getColors(theme);
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      flexDirection: 'column',
    },
    hide: {flex: 0, opacity: 0, display: 'none', width: 0, height: 0},
    linkTooltipBackdrop: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 20,
    },
    linkTooltipContainer: {
      position: 'absolute',
      width: LINK_TOOLTIP_WIDTH,
      backgroundColor: colors.secondaryCardBgColor,
      borderWidth: 1,
      borderColor: colors.cardBorderColor,
      borderRadius: 10,
      overflow: 'hidden',
      zIndex: 21,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    linkTooltipAction: {
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    linkTooltipActionContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    linkTooltipActionText: {
      ...button_link_primary_small,
      color: colors.secondaryText,
      marginLeft: 10,
      flexShrink: 1,
    },
    linkTooltipDivider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.cardBorderColor,
    },
  });
};
