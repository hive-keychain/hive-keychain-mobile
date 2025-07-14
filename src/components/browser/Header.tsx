import {DrawerNavigationProp} from '@react-navigation/drawer';
import {
  ActionPayload,
  Browser,
  BrowserPayload,
  Page,
  Tab,
} from 'actions/interfaces';
import CustomSearchBar from 'components/form/CustomSearchBar';
import Icon from 'components/hive/Icon';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import GestureRecognizer from 'react-native-swipe-gestures';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getInputContainerHeight} from 'src/styles/input';
import {
  SMALLEST_SCREEN_WIDTH_SUPPORTED,
  body_primary_body_1,
  button_link_primary_small,
} from 'src/styles/typography';
import {RootState} from 'store';
import {urlTransformer} from 'utils/browser';
import {Dimensions} from 'utils/common.types';
import {BrowserConfig} from 'utils/config';
import {translate} from 'utils/localize';

const HEART_PNG = require('assets/new_UI/heart.png');
const HEART_EMPTY_PNG = require('assets/new_UI/heart-empty.png');

type Props = {
  browser: Browser;
  updateTab: (id: number, data: Partial<Tab>) => ActionPayload<BrowserPayload>;
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
  const styles = getStyles(useWindowDimensions(), insets, landscape, theme);

  const goHome = () => {
    updateTab(activeTab, {
      url: BrowserConfig.HOMEPAGE_URL,
      icon: BrowserConfig.HOMEPAGE_FAVICON,
      name: translate('browser.home.title'),
    });
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
          activeOpacity={1}
          style={[getCardStyle(theme, 50).defaultCardItem, styles.favContainer]}
          onPress={() => {
            removeFromFavorites(activeUrl);
          }}>
          <FastImage source={HEART_PNG} style={styles.icons} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          activeOpacity={1}
          style={[getCardStyle(theme, 50).defaultCardItem, styles.favContainer]}
          onPress={() => {
            addToFavorites(active);
          }}>
          <FastImage source={HEART_EMPTY_PNG} style={styles.icons} />
        </TouchableOpacity>
      );
    };

    return (
      <GestureRecognizer
        style={[styles.gesture]}
        onSwipeLeft={() => {
          swipeToTab(false);
        }}
        onSwipeRight={() => {
          swipeToTab(true);
        }}>
        <FocusAwareStatusBar backgroundColor={'black'} />
        <View style={[styles.topBar]}>
          {activeUrl !== BrowserConfig.HOMEPAGE_URL ? (
            <>
              <CustomSearchBar
                theme={theme}
                leftIcon={
                  activeUrl !== BrowserConfig.HOMEPAGE_URL ? (
                    <TouchableOpacity
                      onPress={goHome}
                      style={styles.homeIconContainer}>
                      <Icon
                        theme={theme}
                        name={Icons.HOME_BROWSER}
                        color={PRIMARY_RED_COLOR}
                        {...styles.icons}
                      />
                    </TouchableOpacity>
                  ) : null
                }
                rightIcon={
                  <Icon
                    name={Icons.SEARCH}
                    theme={theme}
                    onPress={() => startSearch(true)}
                    color={PRIMARY_RED_COLOR}
                    {...styles.icons}
                  />
                }
                value={
                  activeUrl !== BrowserConfig.HOMEPAGE_URL
                    ? urlTransformer(activeUrl).hostname +
                      urlTransformer(activeUrl).pathname
                    : translate('browser.search')
                }
                onChangeText={(text) => {}}
                onFocus={() => {
                  startSearch(true);
                }}
                disableFocus
                leftIconContainerStyle={{paddingRight: 0}}
                additionalContainerStyle={styles.searchBarContainer}
                additionalCustomInputStyle={{fontSize: 13, marginLeft: 0}}
              />
              {renderFavoritesButton()}
            </>
          ) : (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => startSearch(true)}
              style={[
                getCardStyle(theme).defaultCardItem,
                styles.fakeSearchBar,
              ]}>
              <Text style={[styles.fakeSearchBarText]}>
                {translate('browser.search')}
              </Text>
              <Icon
                name={Icons.SEARCH}
                theme={theme}
                onPress={() => startSearch(true)}
                color={PRIMARY_RED_COLOR}
                {...styles.icons}
              />
            </TouchableOpacity>
          )}
        </View>
      </GestureRecognizer>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={[styles.textBase, styles.browser]}>
          {translate('navigation.tabs')}
        </Text>
      </View>
    );
  }
};

const getStyles = (
  {width, height}: Dimensions,
  insets: EdgeInsets,
  landscape: boolean,
  theme: Theme,
) =>
  StyleSheet.create({
    gesture: {width: '100%', height: 'auto'},
    container: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    topBar: {
      borderRadius: 6,
      alignItems: 'center',
      paddingVertical: 10,
      height: 'auto',
      width: '100%',
      paddingHorizontal: 16,
      flexDirection: 'row',
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
    homeIconContainer: {
      width: getInputContainerHeight(width),
      height: getInputContainerHeight(width),
      justifyContent: 'center',
      alignItems: 'center',
    },
    favContainer: {
      width: getInputContainerHeight(width),
      height: getInputContainerHeight(width),
      marginBottom: 0,
      justifyContent: 'center',
      alignContent: 'center',
      paddingHorizontal: 0,
      paddingVertical: 0,
      marginLeft: 10,
      alignSelf: 'center',
    },
    marginBottom: {
      marginBottom: 8,
    },
    icons: {
      width: width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 14 : 16,
      height: width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 14 : 16,
      alignSelf: 'center',
    },
    searchBarContainer: {
      borderRadius: 30,
      height: getInputContainerHeight(width),
      paddingRight: 16,
      flex: 1,
      fontSize: 13,
    },
    fakeSearchBar: {
      borderRadius: 30,
      height: getInputContainerHeight(width),
      paddingHorizontal: 16,
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
      paddingVertical: 4,
    },
    fakeSearchBarText: {
      ...button_link_primary_small,
      fontSize: 13,
      color:
        theme === Theme.LIGHT
          ? 'rgba(33, 40, 56, 0.30)'
          : 'rgba(255, 255, 255, 0.30)',
    },
  });

const mapStateToProps = (state: RootState) => {
  return {};
};
const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(BrowserHeader);
