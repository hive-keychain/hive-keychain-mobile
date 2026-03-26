import {
  Account,
  ActionPayload,
  BrowserPayload,
  KeyTypes,
  Tab,
} from 'actions/interfaces';
import * as Clipboard from 'expo-clipboard';
import {BrowserScreenProps} from 'navigators/mainDrawerStacks/Browser.types';
import React, {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useState,
} from 'react';
import {
  Platform,
  ScrollView,
  Share,
  View,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {WebViewMessageEvent} from 'react-native-webview/lib/WebViewTypes';
import {UserPreference} from 'reducers/preferences.types';
import {ProviderEvent} from 'src/enums/providerEvent.enum';
import {RequestError, RequestSuccess} from 'src/interfaces/keychain.interface';
import {store} from 'store';
import {
  getAllowedBrowserNavigationUrl,
  urlTransformer,
} from 'utils/browser.utils';
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
import {MultisigUtils} from 'utils/multisig.utils';
import {navigate, goBack as navigationGoBack} from 'utils/navigation.utils';
import {hasPreference} from 'utils/preferences.utils';
import {requestWithoutConfirmation} from 'utils/requestWithoutConfirmation.utils';
import MediaDownloadModal from '../MediaDownloadModal';
import RequestModalContent from '../RequestModalContent';
import RequestErr from '../requestOperations/components/RequestError';
import {showFloatingBar} from 'actions/floatingBar';
import {parseBrowserTabMessage} from './browserTabMessage.utils';
import {LinkTooltipState} from './types';

type Params = {
  accounts: Account[];
  data: Tab;
  preferences: UserPreference[];
  navigation: BrowserScreenProps['navigation'];
  tabRef: MutableRefObject<WebView>;
  tabParentRef: MutableRefObject<ScrollView>;
  updateTab: (id: number, data: Partial<Tab>) => ActionPayload<BrowserPayload>;
  addTab: (
    isManagingTab: boolean,
    tab: Tab,
    webview: MutableRefObject<View | ScrollView>,
    url?: string,
  ) => void;
  updateFindInPageCount?: (count: number, current: number) => void;
  closeFindInPage?: () => void;
  isLoading: boolean;
  setLinkTooltip: Dispatch<SetStateAction<LinkTooltipState | null>>;
};

export const useBrowserTabBridge = ({
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
}: Params) => {
  const {url, id, icon, name} = data;
  const [canRefresh, setCanRefresh] = useState(true);
  const [isFlutterApp, setIsFlutterApp] = useState(false);
  const [canRefreshCanvas, setCanRefreshCanvas] = useState(true);
  const [flutterDomain, setFlutterDomain] = useState('');

  const downloadImage = async (imageUrl: string) => {
    if (Platform.OS === 'android') {
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
      await downloadFromUrl(imageUrl);
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

  const showRequestValidationError = (
    request_id: number,
    data: any,
    modalError: string,
  ) => {
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
          error={modalError}
        />
      ),
    });
  };

  const onMessage = ({nativeEvent}: WebViewMessageEvent) => {
    const messageData = parseBrowserTabMessage(nativeEvent.data);
    if (!messageData) {
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
        if (canRefreshCanvas !== isAtTopOfCanvas) {
          setCanRefreshCanvas(isAtTopOfCanvas);
        }
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
            showRequestValidationError(
              request_id,
              data,
              validateAuth.error ?? 'Request was canceled by the user.',
            );
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
      case 'FIND_IN_PAGE_COUNT': {
        const findCount = messageData.count;
        const findCurrent = messageData.current;
        if (
          updateFindInPageCount &&
          typeof findCount === 'number' &&
          typeof findCurrent === 'number'
        ) {
          updateFindInPageCount(findCount, findCurrent);
        }
        break;
      }
      case 'FIND_IN_PAGE_NAVIGATION':
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
            x: typeof x === 'number' ? x : 0,
            y: typeof y === 'number' ? y : 0,
          });
        }
        break;
    }
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

  return {
    canRefresh,
    canRefreshCanvas,
    isFlutterApp,
    onMessage,
    openLinkInCurrentTab,
    openLinkInAnotherTab,
    copyLinkToClipboard,
    shareLink,
  };
};
