import {
  Account,
  ActionPayload,
  BrowserPayload,
  KeyTypes,
  Page,
  Tab,
  TabFields,
} from 'actions/interfaces';
import {BrowserNavigation} from 'navigators/MainDrawer.types';
import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {WebView} from 'react-native-webview';
import {
  WebViewMessageEvent,
  WebViewNativeEvent,
  WebViewProgressEvent,
} from 'react-native-webview/lib/WebViewTypes';
import {UserPreference} from 'reducers/preferences.types';
import {Theme} from 'src/context/theme.context';
import {urlTransformer} from 'utils/browser';
import {BrowserConfig} from 'utils/config';
import {getAccount} from 'utils/hiveUtils';
import {
  getRequiredWifType,
  sendError,
  sendResponse,
  validateAuthority,
  validateRequest,
} from 'utils/keychain';
import {RequestError, RequestSuccess} from 'utils/keychain.types';
import {MultisigUtils} from 'utils/multisig.utils';
import {navigate, goBack as navigationGoBack} from 'utils/navigation';
import {hasPreference} from 'utils/preferences';
import {requestWithoutConfirmation} from 'utils/requestWithoutConfirmation';
import Footer from './Footer';
import HomeTab from './HomeTab';
import ProgressBar from './ProgressBar';
import RequestModalContent from './RequestModalContent';
import {DESKTOP_MODE} from './bridges/DesktopMode';
import {hive_keychain} from './bridges/HiveKeychainBridge';
import {BRIDGE_WV_INFO} from './bridges/WebviewInfo';
import RequestErr from './requestOperations/components/RequestError';

type Props = {
  data: Tab;
  active: boolean;
  manageTabs: (
    tab: Tab,
    webview: MutableRefObject<WebView> | MutableRefObject<View>,
  ) => void;
  isManagingTab: boolean;
  accounts: Account[];
  updateTab: (id: number, data: TabFields) => ActionPayload<BrowserPayload>;
  addToHistory: (history: Page) => ActionPayload<BrowserPayload>;
  history: Page[];
  navigation: BrowserNavigation;
  preferences: UserPreference[];
  favorites: Page[];
  addTab: (
    isManagingTab: boolean,
    tab: Tab,
    webview: MutableRefObject<View>,
    url?: string,
  ) => void;
  tabsNumber: number;
  orientation: string;
  isUrlModalOpen: boolean;
  theme: Theme;
  clearHistory: () => void;
};

export default ({
  data: {url, id, icon, name},
  active,
  updateTab,
  accounts,
  navigation,
  addToHistory,
  history,
  manageTabs,
  isManagingTab,
  preferences,
  favorites,
  addTab,
  tabsNumber,
  orientation,
  isUrlModalOpen,
  clearHistory,
  theme,
}: Props) => {
  const tabData = {url, id, icon, name};
  const tabRef: MutableRefObject<WebView> = useRef(null);
  const tabParentRef: MutableRefObject<View> = useRef(null);
  const homeRef: MutableRefObject<View> = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shouldUpdateWvInfo, setShouldUpdateWvInfo] = useState(true);
  const [desktopMode, setDesktopMode] = useState(false);
  const insets = useSafeAreaInsets();

  const FOOTER_HEIGHT = BrowserConfig.FOOTER_HEIGHT + insets.bottom;
  useEffect(() => {
    if (isUrlModalOpen) {
      setShouldUpdateWvInfo(false);
    } else {
      setTimeout(() => {
        setShouldUpdateWvInfo(true);
      }, 2100);
    }
  }, [isUrlModalOpen]);

  useEffect(() => {
    // On iOS the page needs to be reloaded when changing orientation to apply desktop mode.
    if (desktopMode && active && !isManagingTab && Platform.OS === 'ios') {
      tabRef.current.reload();
    }
  }, [orientation]);
  const goBack = () => {
    if (!canGoBack) {
      return;
    }
    const {current} = tabRef;
    current && current.goBack();
  };
  const goForward = () => {
    if (!canGoForward) {
      return;
    }
    const {current} = tabRef;
    current && current.goForward();
  };

  const reload = () => {
    const {current} = tabRef;
    current && current.reload();
  };

  const clearCache = () => {
    const {current} = tabRef;
    current && current.clearCache(true);
  };

  const onLoadStart = ({
    nativeEvent: {url},
  }: {
    nativeEvent: WebViewNativeEvent;
  }) => {
    updateTab(id, {url});
  };
  const updateTabUrl = (link: string) => {
    updateTab(id, {url: link});
  };
  const onLoadProgress = ({nativeEvent: {progress}}: WebViewProgressEvent) => {
    setProgress(progress === 1 ? 0 : progress);
  };

  const onLoadEnd = ({
    nativeEvent: {canGoBack, canGoForward, loading, url},
  }: {
    nativeEvent: WebViewNativeEvent;
  }) => {
    const {current} = tabRef;
    if (Platform.OS === 'ios') {
      updateTab(id, {url});
    }
    setProgress(0);
    if (loading) {
      return;
    }
    setCanGoBack(canGoBack);
    setCanGoForward(canGoForward);
    if (current) {
      current.injectJavaScript(BRIDGE_WV_INFO);
    }
  };

  const onMessage = ({nativeEvent}: WebViewMessageEvent) => {
    const {name, request_id, data} = JSON.parse(nativeEvent.data);
    const {current} = tabRef;
    switch (name) {
      case 'swHandshake_hive':
        current.injectJavaScript(
          'window.hive_keychain.onAnswerReceived("hive_keychain_handshake")',
        );
        break;
      case 'swRequest_hive':
        if (validateRequest(data)) {
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
      case 'WV_INFO':
        const {icon, name, url} = data as TabFields;
        if (
          tabData.url !== 'about:blank' &&
          (icon !== tabData.icon || name !== tabData.name)
        ) {
          navigation.setParams({icon});
          updateTab(id, {name, icon});
          addToHistory({url, name, icon});
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

  return (
    <View
      style={[styles.container, !active || isManagingTab ? styles.hide : null]}>
      <View style={{flexGrow: 1}}>
        <ProgressBar progress={progress} />

        {url === BrowserConfig.HOMEPAGE_URL ? (
          <HomeTab
            history={history}
            favorites={favorites}
            updateTabUrl={updateTabUrl}
            clearHistory={clearHistory}
            homeRef={homeRef}
            accounts={accounts}
            theme={theme}
          />
        ) : null}
        <View
          style={
            url === BrowserConfig.HOMEPAGE_URL ? styles.hide : styles.container
          }
          ref={tabParentRef}
          collapsable={false}>
          <WebView
            source={{
              uri: url === BrowserConfig.HOMEPAGE_URL ? undefined : url,
            }}
            domStorageEnabled={true}
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
            mixedContentMode={'always'}
            ref={tabRef}
            injectedJavaScriptBeforeContentLoaded={hive_keychain}
            injectedJavaScript={desktopMode ? DESKTOP_MODE : undefined}
            mediaPlaybackRequiresUserAction={false}
            onMessage={onMessage}
            javaScriptEnabled
            geolocationEnabled
            allowsInlineMediaPlayback
            allowsFullscreenVideo
            onLoadEnd={onLoadEnd}
            onLoadStart={onLoadStart}
            onLoadProgress={onLoadProgress}
            pullToRefreshEnabled
            onError={(error) => {
              console.log('Error', error);
            }}
            onHttpError={(error) => {
              console.log('HttpError', error);
            }}
            onOpenWindow={(event) => {
              addTab(
                false,
                {url, icon, id},
                tabParentRef,
                event.nativeEvent.targetUrl,
              );
            }}
            useWebView2
          />
        </View>
      </View>
      {active && orientation === 'PORTRAIT' && (
        <Footer
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          goBack={goBack}
          goForward={goForward}
          reload={reload}
          clearCache={clearCache}
          desktopMode={desktopMode}
          toggleDesktopMode={() => {
            setDesktopMode(!desktopMode);
            tabRef.current.reload();
          }}
          addTab={() => {
            addTab(
              isManagingTab,
              {url, id, icon},
              url === BrowserConfig.HOMEPAGE_URL ? homeRef : tabParentRef,
            );
          }}
          manageTabs={() => {
            manageTabs(
              {url, id, icon},
              url === BrowserConfig.HOMEPAGE_URL ? homeRef : tabParentRef,
            );
          }}
          height={FOOTER_HEIGHT}
          tabs={tabsNumber}
          theme={theme}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flexGrow: 1, flexDirection: 'column'},
  hide: {flex: 0, opacity: 0, display: 'none', width: 0, height: 0},
});
