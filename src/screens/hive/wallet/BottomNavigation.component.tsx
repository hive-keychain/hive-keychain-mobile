import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import {showFloatingBar} from 'actions/floatingBar';
import {
  addTab,
  changeTab,
  closeAllTabs,
  showManagementScreen,
  updateTab,
} from 'actions/index';
import {Tab} from 'actions/interfaces';
import FindInPageModal from 'components/browser/FindInPageModal';
import {
  FIND_IN_PAGE_CLEAR,
  FIND_IN_PAGE_NEXT,
  FIND_IN_PAGE_PREVIOUS,
  FIND_IN_PAGE_SCRIPT,
} from 'components/browser/bridges/FindInPage';
import Icon from 'components/hive/Icon';
import {BrowserTutorialContent} from 'components/popups/browser-tutorial/BrowserTutorial';
import SafeArea from 'components/ui/SafeArea';
import React, {MutableRefObject, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import SimpleToast from 'react-native-root-toast';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {ConnectedProps, connect} from 'react-redux';
import {useOrientation} from 'src/context/orientation.context';
import {useTab} from 'src/context/tab.context';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {BottomBarLink} from 'src/enums/bottomBarLink.enum';
import {Icons} from 'src/enums/icons.enum';
import {Dimensions} from 'src/interfaces/common.interface';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getIconDimensions} from 'src/styles/icon';
import {getModalBaseStyle} from 'src/styles/modal';
import {body_primary_body_1} from 'src/styles/typography';
import {RootState} from 'store';
import {BrowserUtils} from 'utils/browser.utils';
import {BrowserConfig} from 'utils/config.utils';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation.utils';
import {PlatformsUtils} from 'utils/platforms.utils';

interface Props {
  showTags?: boolean;
}

const BottomNavigation = ({
  show,
  showTags,
  isLoadingScreen,
  isDrawerOpen,
  closeAllTabs,
  rpc,
  isProposalRequestDisplayed,
  showSwap,
  activeScreen,
  tabs,
  addTab,
  browser,
  updateTab,
  showManagementScreen,
  changeTab,
}: Props & PropsFromRedux) => {
  const isBrowser = activeScreen === BottomBarLink.Browser;
  const isModal = activeScreen === 'ModalScreen';

  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const styles = getStyles(theme, {width, height}, insets, false);
  const anim = useRef(new Animated.Value(0)).current;
  const {webViewRef, tabViewRef, findInPageCount} = useTab();
  const [showBrowserSecondaryLinks, setShowBrowserSecondaryLinks] =
    useState(true);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(
    !isModal && show && rpc && rpc.uri !== 'NULL',
  );
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [showFindInPage, setShowFindInPage] = useState(false);
  const [findInPageText, setFindInPageText] = useState('');
  const orientation = useOrientation();

  // Listen to keyboard events, and hide the bottom navigation when the keyboard is visible
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const onHandlePressButton = (link: BottomBarLink) => {
    let screen = '';
    let nestedScreenOrParams;
    switch (link) {
      case BottomBarLink.Wallet:
        screen = 'Wallet';
        nestedScreenOrParams = {
          screen: 'WalletScreen',
        };
        break;
      case BottomBarLink.Browser:
        screen = 'Browser';
        nestedScreenOrParams = {
          screen: 'BrowserScreen',
        };
        break;
      case BottomBarLink.ScanQr:
        screen = 'Wallet';
        nestedScreenOrParams = {
          screen: 'ScanQRFromWalletScreen',
          params: {wallet: true},
        };
        break;
      case BottomBarLink.SwapBuy:
        screen = 'SwapBuyStack';
        break;
    }
    return navigate(screen, nestedScreenOrParams);
  };

  const startAnimation = (toValue: number) => {
    Animated.timing(anim, {
      toValue,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      if (toValue === 0) {
        setIsVisible(true);
      }
    });
  };
  useEffect(() => {
    startAnimation(
      !isModal &&
        ['PORTRAIT', 'FACE-UP'].includes(orientation) &&
        !isKeyboardVisible &&
        !isLoadingScreen &&
        rpc &&
        !isDrawerOpen &&
        rpc.uri !== 'NULL' &&
        (show ||
          (isBrowser &&
            (browser.tabs.find((tab) => tab.id === browser.activeTab)?.url ===
              BrowserConfig.HOMEPAGE_URL ||
              browser.showManagement)))
        ? 0
        : 1,
    );
  }, [
    show,
    isDrawerOpen,
    isLoadingScreen,
    isBrowser,
    browser.tabs,
    browser.activeTab,
    isModal,
    browser.showManagement,
    orientation,
    rpc,
  ]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60 + insets.bottom],
    extrapolate: 'clamp',
  });

  const onAddTab = async (
    isManagingTab: boolean,
    tab: Tab,
    view: MutableRefObject<View | ScrollView>,
    newUrl = BrowserConfig.HOMEPAGE_URL,
  ) => {
    if (!isManagingTab) {
      const {id, url, icon} = tab;
      const uri = await BrowserUtils.captureTab(view);
      updateTab(id, {id, url, icon, image: uri});
      addTab(newUrl);
    } else {
      addTab(newUrl);
      showManagementScreen(false);
    }
  };

  const renderBrowserBottomBar = () => [
    <Pressable
      key="add-tab"
      onPress={() => {
        const activeTab = BrowserUtils.findTabById(
          browser.tabs,
          browser.activeTab,
        );
        onAddTab(browser.showManagement, activeTab, tabViewRef);
      }}
      style={({pressed}) => {
        return [styles.pressable, pressed && styles.pressed];
      }}>
      <Icon
        theme={theme}
        name={Icons.ADD_BROWSER}
        additionalContainerStyle={[styles.circleContainer]}
        {...styles.icon}
      />
    </Pressable>,
    !browser.showManagement && (
      <Pressable
        key="manage-tab"
        onPress={async () => {
          const {id, url, icon, name} = BrowserUtils.findTabById(
            browser.tabs,
            browser.activeTab,
          );
          const uri = await BrowserUtils.captureTab(tabViewRef);
          updateTab(id, {id, url, icon, image: uri, name});
          showManagementScreen(true);
        }}
        style={({pressed}) => {
          return [styles.pressable, pressed && styles.pressed];
        }}>
        <View style={styles.manage}>
          <Text style={[styles.textBase, styles.redColor]}>{tabs.length}</Text>
        </View>
      </Pressable>
    ),
    !browser.showManagement && (
      <View key="context-menu" style={styles.contextMenuContainer}>
        <Pressable
          onPress={() => {
            setShowContextMenu(!showContextMenu);
          }}
          style={({pressed}) => {
            return [styles.pressable, pressed && styles.pressed];
          }}>
          <MaterialIcon name="more-vert" style={styles.icon} size={22} />
        </Pressable>
        {showContextMenu && (
          <Modal
            transparent
            visible={showContextMenu}
            animationType="fade"
            onRequestClose={() => setShowContextMenu(false)}>
            <Pressable
              style={styles.menuOverlay}
              onPress={() => setShowContextMenu(false)}>
              <View style={styles.contextMenuWrapper}>
                <View style={styles.contextMenu}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      webViewRef.current?.reload();
                      setShowContextMenu(false);
                    }}>
                    <View style={styles.menuIconContainer}>
                      <MaterialIcon
                        name="refresh"
                        style={styles.menuIcon}
                        size={20}
                      />
                    </View>
                    <Text style={styles.menuItemText}>
                      {translate('browser.refresh')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      if (webViewRef.current) {
                        webViewRef.current.clearCache(true);
                        webViewRef.current.reload();
                      }
                      setShowContextMenu(false);
                    }}>
                    <View style={styles.menuIconContainer}>
                      <MaterialIcon
                        name="delete-sweep"
                        style={styles.menuIcon}
                        size={20}
                      />
                    </View>
                    <Text style={styles.menuItemText}>
                      {translate('browser.history.clear_cache')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={async () => {
                      const activeTab = BrowserUtils.findTabById(
                        browser.tabs,
                        browser.activeTab,
                      );
                      const urlToShare = activeTab?.url;
                      if (
                        urlToShare &&
                        urlToShare !== BrowserConfig.HOMEPAGE_URL &&
                        urlToShare !== 'about:blank'
                      ) {
                        try {
                          await Share.share({
                            message: urlToShare,
                          });
                        } catch (error) {
                          console.error('Error sharing URL:', error);
                        }
                      }
                      setShowContextMenu(false);
                    }}>
                    <View style={styles.menuIconContainer}>
                      <Icon
                        theme={theme}
                        name={Icons.SHARE}
                        width={20}
                        height={20}
                      />
                    </View>
                    <Text style={styles.menuItemText}>
                      {translate('common.share')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      setShowContextMenu(false);
                      setShowFindInPage(true);
                    }}>
                    <View style={styles.menuIconContainer}>
                      <Icon
                        theme={theme}
                        name={Icons.SEARCH}
                        width={15}
                        height={15}
                      />
                    </View>
                    <Text style={styles.menuItemText}>
                      {translate('browser.find_in_page')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.menuItem]}
                    onPress={() => {
                      updateTab(browser.activeTab, {
                        desktop: !BrowserUtils.findTabById(
                          browser.tabs,
                          browser.activeTab,
                        )?.desktop,
                      });
                      setTimeout(() => {
                        webViewRef.current?.reload();
                      }, 100);
                      setShowContextMenu(false);
                    }}>
                    <View style={styles.menuIconContainer}>
                      <Icon
                        theme={theme}
                        name={
                          !BrowserUtils.findTabById(
                            browser.tabs,
                            browser.activeTab,
                          )?.desktop
                            ? Icons.MOBILE
                            : Icons.DESKTOP
                        }
                        width={20}
                        height={20}
                      />
                    </View>
                    <Text style={styles.menuItemText}>
                      {translate(
                        !BrowserUtils.findTabById(
                          browser.tabs,
                          browser.activeTab,
                        )?.desktop
                          ? 'browser.desktop_mode'
                          : 'browser.mobile_mode',
                      )}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.menuItem, styles.menuItemLast]}
                    onPress={() => {
                      navigate('ModalScreen', {
                        name: 'BrowserTutorial',
                        modalContent: (
                          <SafeArea skipTop>
                            <BrowserTutorialContent />
                          </SafeArea>
                        ),
                        modalContainerStyle:
                          getModalBaseStyle(theme).roundedTop,
                        onForceCloseModal: () => {},
                      });
                      setShowContextMenu(false);
                    }}>
                    <View style={styles.menuIconContainer}>
                      <Icon
                        theme={theme}
                        name={Icons.TUTORIAL}
                        width={20}
                        height={20}
                      />
                    </View>
                    <Text style={styles.menuItemText}>
                      {translate('navigation.tutorial')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Pressable>
          </Modal>
        )}
        <FindInPageModal
          isVisible={showFindInPage}
          onClose={() => {
            setShowFindInPage(false);
            setFindInPageText('');
            if (webViewRef.current) {
              webViewRef.current.injectJavaScript(FIND_IN_PAGE_CLEAR);
            }
          }}
          onSearch={(text) => {
            setFindInPageText(text);
            if (webViewRef.current) {
              if (text && text.trim().length > 0) {
                webViewRef.current.injectJavaScript(FIND_IN_PAGE_SCRIPT(text));
              } else {
                webViewRef.current.injectJavaScript(FIND_IN_PAGE_CLEAR);
              }
            }
          }}
          onNext={() => {
            if (webViewRef.current) {
              webViewRef.current.injectJavaScript(FIND_IN_PAGE_NEXT);
            }
          }}
          onPrevious={() => {
            if (webViewRef.current) {
              webViewRef.current.injectJavaScript(FIND_IN_PAGE_PREVIOUS);
            }
          }}
          searchText={findInPageText}
          matchCount={findInPageCount?.count || 0}
          currentMatch={findInPageCount?.current || 0}
        />
      </View>
    ),
    browser.showManagement && (
      <Pressable
        key="close-management"
        onPress={() => {
          showManagementScreen(false);
        }}
        style={({pressed}) => {
          return [styles.pressable, pressed && styles.pressed];
        }}>
        <MaterialIcon name="check" style={styles.icon} size={22} />
      </Pressable>
    ),
    browser.showManagement && (
      <Pressable
        key="close-tabs"
        onPress={() => {
          changeTab(0);
          closeAllTabs();
          showManagementScreen(false);
        }}
        style={({pressed}) => {
          return [styles.pressable, pressed && styles.pressed];
        }}>
        <MaterialIcon name="close" style={styles.icon} size={22} />
      </Pressable>
    ),
  ];
  return isVisible ? (
    <Animated.View
      style={[
        getCardStyle(theme).floatingBar,
        styles.container,
        {transform: [{translateY}]},
      ]}>
      <Pressable
        onPress={() => onHandlePressButton(BottomBarLink.Wallet)}
        style={[
          styles.itemContainer,
          activeScreen === BottomBarLink.Wallet && styles.active,
        ]}>
        <Icon
          theme={theme}
          name={Icons.ADD_TAB}
          color={activeScreen === BottomBarLink.Wallet ? 'white' : undefined}
          {...getIconDimensions(width)}
        />
        {showTags && (
          <Text style={[styles.textBase, styles.marginTop]}>
            {translate('navigation.floating_bar.ecosystem')}
          </Text>
        )}
      </Pressable>
      <Pressable
        onPress={() => {
          if (!isBrowser) onHandlePressButton(BottomBarLink.Browser);
          else setShowBrowserSecondaryLinks(!showBrowserSecondaryLinks);
        }}
        onLongPress={() => {
          SimpleToast.show(translate('browser.clear_all'), {
            duration: SimpleToast.durations.LONG,
          });
          closeAllTabs();
        }}
        style={[
          styles.itemContainer,
          activeScreen === BottomBarLink.Browser && styles.active,
        ]}>
        <Icon
          theme={theme}
          name={Icons.BROWSER}
          {...getIconDimensions(width)}
          color={activeScreen === BottomBarLink.Browser ? 'white' : undefined}
        />
        {showTags && (
          <Text style={[styles.textBase, styles.marginTop]}>
            {translate('navigation.floating_bar.browser')}
          </Text>
        )}
      </Pressable>
      {isBrowser && showBrowserSecondaryLinks && renderBrowserBottomBar()}
      {(!isBrowser || !showBrowserSecondaryLinks) && (
        <View
          style={[
            styles.itemContainer,
            activeScreen === BottomBarLink.ScanQr && styles.active,
          ]}>
          <Icon
            theme={theme}
            name={Icons.SCANNER}
            {...getIconDimensions(width)}
            color={activeScreen === BottomBarLink.ScanQr ? 'white' : undefined}
            onPress={() => onHandlePressButton(BottomBarLink.ScanQr)}
          />
          {showTags && (
            <Text style={[styles.textBase, styles.marginTop]}>
              {translate('navigation.floating_bar.buy')}
            </Text>
          )}
        </View>
      )}
      {(!isBrowser || !showBrowserSecondaryLinks) &&
        PlatformsUtils.showDependingOnPlatform(
          <View style={[styles.itemContainer]}>
            <Icon
              theme={theme}
              name={Icons.SWAP}
              color={
                activeScreen === BottomBarLink.SwapBuy ? 'white' : undefined
              }
              {...getIconDimensions(width)}
              onPress={() => onHandlePressButton(BottomBarLink.SwapBuy)}
            />
            {showTags && (
              <Text style={[styles.textBase, styles.marginTop]}>
                {translate('navigation.floating_bar.swap')}
              </Text>
            )}
          </View>,
          showSwap,
        )}
    </Animated.View>
  ) : null;
};

const getStyles = (
  theme: Theme,
  {width, height}: Dimensions,
  insets: EdgeInsets,
  isProposalRequestDisplayed: boolean,
) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      width: '95%',
      height:
        Platform.OS === 'ios' ? insets.bottom / 2 + 50 : insets.bottom + 50,
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: Platform.OS === 'ios' ? insets.bottom / 2 : insets.bottom,
      alignItems: 'center',
    },
    textBase: {
      ...body_primary_body_1,
      color: getColors(theme).secondaryText,
    },
    itemContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1.5,
      paddingTop: 8,
      paddingBottom: Platform.OS === 'ios' ? insets.bottom + 8 : 8,
      marginBottom: Platform.OS === 'ios' ? -insets.bottom - 1 : 0,
    },
    marginTop: {
      marginTop: 5,
    },
    active: {
      borderTopRightRadius: 22,
      borderTopLeftRadius: 22,
      backgroundColor: PRIMARY_RED_COLOR,
    },
    redColor: {
      color: getColors(theme).icon,
    },
    pressable: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    },
    pressed: {
      backgroundColor: getColors(theme).pressedButton,
    },
    icon: {width: 22, height: 22, color: getColors(theme).icon},
    manage: {
      borderColor: getColors(theme).icon,
      borderWidth: 1,
      width: 22,
      height: 22,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    circleContainer: {
      borderRadius: 50,
      width: 22,
      height: 22,
      borderColor: getColors(theme).icon,
      borderWidth: 1,
    },
    contextMenuContainer: {
      position: 'relative',
      flex: 1,
    },
    menuOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      paddingBottom:
        Platform.OS === 'ios' ? insets.bottom / 2 + 50 : insets.bottom + 50,
      paddingRight: width * 0.025,
    },
    contextMenuWrapper: {
      alignItems: 'flex-end',
    },
    contextMenu: {
      backgroundColor: getColors(theme).cardBgColor,
      borderRadius: 12,
      minWidth: 200,
      maxWidth: width * 0.8,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: 'hidden',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor:
        getColors(theme).cardBorderColor || getColors(theme).icon + '20',
    },
    menuItemLast: {
      borderBottomWidth: 0,
    },
    menuIconContainer: {
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuIcon: {
      width: 20,
      height: 20,
      color: getColors(theme).icon,
    },
    menuItemText: {
      ...body_primary_body_1,
      color: getColors(theme).primaryText,
      marginLeft: 12,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      show: state.floatingBar.showBasedOnScroll && !state.floatingBar.hide,
      isProposalRequestDisplayed: state.floatingBar.isProposalRequestDisplayed,
      isLoadingScreen: state.floatingBar.isLoadingScreen,
      isDrawerOpen: state.floatingBar.isDrawerOpened,
      rpc: state.settings.rpc,
      showSwap: state.settings.mobileSettings?.platformRelevantFeatures?.swap,
      activeScreen: state.navigation.activeScreen,
      tabs: state.browser.tabs,
      browser: state.browser,
    };
  },
  {
    showFloatingBar,
    closeAllTabs,
    addTab,
    updateTab,
    showManagementScreen,
    changeTab,
  },
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export const BottomNavigationComponent = connector(BottomNavigation);
