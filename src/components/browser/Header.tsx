import {DrawerNavigationProp} from '@react-navigation/drawer';
import {
  ActionPayload,
  Browser,
  BrowserPayload,
  Page,
  TabFields,
} from 'actions/interfaces';
import HeartIcon from 'assets/new_UI/heart.svg';
import NotFavoriteIcon from 'assets/new_UI/linear_heart_empty.svg';
import CustomSearchBar from 'components/form/CustomSearchBar';
import Icon from 'components/hive/Icon';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import GestureRecognizer from 'react-native-swipe-gestures';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {body_primary_body_1} from 'src/styles/typography';
import {RootState} from 'store';
import {urlTransformer} from 'utils/browser';
import {BrowserConfig} from 'utils/config';
import {capitalize} from 'utils/format';
import {translate} from 'utils/localize';

type Props = {
  browser: Browser;
  updateTab: (id: number, data: TabFields) => ActionPayload<BrowserPayload>;
  startSearch: (b: boolean) => void;
  addToFavorites: (page: Page) => ActionPayload<BrowserPayload>;
  removeFromFavorites: (url: string) => ActionPayload<BrowserPayload>;
  swipeToTab: (right: boolean) => void;
  landscape: boolean;
  navigation: DrawerNavigationProp<any>;
  theme: Theme;
  activeTabs: number;
};

const BrowserHeader = ({
  browser: {activeTab, tabs, favorites, showManagement},
  navigation,
  updateTab,
  startSearch,
  addToFavorites,
  removeFromFavorites,
  swipeToTab,
  landscape,
  theme,
  activeTabs,
}: Props & PropsFromRedux) => {
  const {HEADER_HEIGHT} = BrowserConfig;
  const insets = useSafeAreaInsets();
  const styles = getStyles(HEADER_HEIGHT, insets, landscape, theme);

  const goHome = () => {
    updateTab(activeTab, {url: BrowserConfig.HOMEPAGE_URL});
  };

  if (
    tabs &&
    activeTab &&
    tabs.find((e) => e.id === activeTab) &&
    !showManagement
  ) {
    const active = tabs.find((e) => e.id === activeTab);
    const activeUrl = active.url;

    const renderFavoritesButton = () => {
      if (activeUrl === BrowserConfig.HOMEPAGE_URL) return null;
      return favorites.find((e) => e.url === activeUrl) ? (
        <TouchableOpacity
          style={[
            getCardStyle(theme, 50).defaultCardItem,
            styles.favContainer,
            styles.marginLeft,
          ]}
          onPress={() => {
            removeFromFavorites(activeUrl);
          }}>
          <HeartIcon width={17} height={16} color={getColors(theme).icon} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            getCardStyle(theme, 50).defaultCardItem,
            styles.favContainer,
            styles.marginLeft,
          ]}
          onPress={() => {
            addToFavorites(active);
          }}>
          <NotFavoriteIcon
            width={17}
            height={16}
            color={getColors(theme).icon}
          />
        </TouchableOpacity>
      );
    };

    return (
      <GestureRecognizer
        style={{width: '100%'}}
        onSwipeLeft={() => {
          swipeToTab(false);
        }}
        onSwipeRight={() => {
          swipeToTab(true);
        }}>
        <FocusAwareStatusBar />
        <View style={styles.topBar}>
          {/* //TODO quentin: please check this commented code bellow.
          //  1. the design team wanted to show this in top but when using the floating bar
          //  2. as you wanted not to show the floatinBar at all, I guess this header should not be. So let me know. */}
          {/* <View
            style={[
              styles.flexRowBetween,
              styles.paddingHorizontal,
              styles.paddingBottom,
            ]}>
            <CustomIconButton
              theme={theme}
              lightThemeIcon={<KeychainForHiveLight />}
              darkThemeIcon={<KeychainForHiveDark />}
              onPress={goHome}
            />
            <TouchableOpacity
              activeOpacity={1}
              //TODO bellow ask quentin if needed at all
              onPress={() => {}}
              style={styles.tabsIndicator}>
              <Text
                style={[
                  styles.textBase,
                  theme === Theme.LIGHT ? styles.redColor : undefined,
                ]}>
                {activeTabs}
              </Text>
            </TouchableOpacity>
          </View> */}
          <View style={[styles.flexRowCentered, styles.marginBottom]}>
            <CustomSearchBar
              theme={theme}
              leftIcon={
                activeUrl !== BrowserConfig.HOMEPAGE_URL ? (
                  <Icon theme={theme} name="home_browser" onClick={goHome} />
                ) : null
              }
              rightIcon={
                <Icon
                  name={'search'}
                  theme={theme}
                  onClick={() => startSearch(true)}
                />
              }
              value={
                activeUrl !== BrowserConfig.HOMEPAGE_URL
                  ? urlTransformer(activeUrl).hostname +
                    urlTransformer(activeUrl).pathname
                  : translate('browser.search')
              }
              onChangeText={(text) => {}}
              onPressIn={() => startSearch(true)}
            />
            {renderFavoritesButton()}
          </View>
        </View>
      </GestureRecognizer>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={[styles.textBase, styles.browser]}>
          {capitalize(translate('navigation.browser'))}
        </Text>
      </View>
    );
  }
};

const getStyles = (
  height: number,
  insets: EdgeInsets,
  landscape: boolean,
  theme: Theme,
) =>
  StyleSheet.create({
    container: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    topBar: {
      borderRadius: 6,
      alignItems: 'center',
      paddingTop: 20,
    },
    paddingHorizontal: {
      paddingHorizontal: 15,
    },
    paddingBottom: {paddingBottom: 15},
    browser: {fontSize: 16, marginVertical: 10},
    flexRowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    flexRowCentered: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    tabsIndicator: {
      borderColor: getColors(theme).icon,
      borderWidth: 2,
      width: 28,
      height: 28,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textBase: {
      ...body_primary_body_1,
      color: getColors(theme).secondaryText,
    },
    redColor: {
      color: PRIMARY_RED_COLOR,
    },
    flexContainer: {
      width: '90%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    marginLeft: {marginLeft: 8},
    favContainer: {
      height: '100%',
      marginBottom: 0,
    },
    marginBottom: {
      marginBottom: 8,
    },
  });

const mapStateToProps = (state: RootState) => {
  return {};
};
const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(BrowserHeader);
