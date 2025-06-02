import {showFloatingBar} from 'actions/floatingBar';
import {closeAllTabs} from 'actions/index';
import Icon from 'components/hive/Icon';
import React, {ReactElement, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import SimpleToast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getIconDimensions} from 'src/styles/icon';
import {body_primary_body_1} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {PlatformsUtils} from 'utils/platforms.utils';

export enum BottomBarLink {
  Wallet = 'WalletScreen',
  Browser = 'BrowserScreen',
  ScanQr = 'ScanQR',
  SwapBuy = 'SwapBuy',
}
interface Props {
  showTags?: boolean;
  additionalLinks?: ReactElement[];
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
  additionalLinks,
  activeScreen,
}: Props & PropsFromRedux) => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, {width, height}, useSafeAreaInsets(), false);
  const anim = useRef(new Animated.Value(0)).current;
  const [isTop, setIsTop] = useState(false);

  const onHandlePressButton = (link: BottomBarLink) => {
    let screen = '';
    let nestedScreenOrParams;
    switch (link) {
      case BottomBarLink.Wallet:
        screen = 'WALLET';
        nestedScreenOrParams = {
          screen: 'WalletScreen',
        };
        break;
      case BottomBarLink.Browser:
        screen = 'BrowserScreen';
        break;
      case BottomBarLink.ScanQr:
        screen = 'WALLET';
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
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    startAnimation(isTop ? 0 : 1);
  }, [isTop]);

  useEffect(() => {
    setIsTop(show && !isDrawerOpen && !isLoadingScreen);
  }, [show, isDrawerOpen, isLoadingScreen]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height - 70],
    extrapolate: 'clamp',
  });

  return show && rpc && rpc.uri !== 'NULL' ? (
    <Animated.View
      style={[
        getCardStyle(theme).floatingBar,
        styles.container,
        {transform: [{translateY}]},
      ]}>
      <View
        style={[
          styles.itemContainer,
          activeScreen === BottomBarLink.Wallet && styles.active,
        ]}>
        <Icon
          theme={theme}
          name={Icons.WALLET_ADD}
          color={activeScreen === BottomBarLink.Wallet ? 'white' : undefined}
          {...getIconDimensions(width)}
          onPress={() => onHandlePressButton(BottomBarLink.Wallet)}
        />
        {showTags && (
          <Text style={[styles.textBase, styles.marginTop]}>
            {translate('navigation.floating_bar.ecosystem')}
          </Text>
        )}
      </View>
      <View
        style={[
          styles.itemContainer,
          activeScreen === BottomBarLink.Browser && styles.active,
        ]}>
        <Icon
          theme={theme}
          name={Icons.BROWSER}
          {...getIconDimensions(width)}
          color={activeScreen === BottomBarLink.Browser ? 'white' : undefined}
          onPress={() => onHandlePressButton(BottomBarLink.Browser)}
          onLongPress={() => {
            SimpleToast.show(translate('browser.clear_all'), SimpleToast.LONG);
            closeAllTabs();
          }}
        />
        {showTags && (
          <Text style={[styles.textBase, styles.marginTop]}>
            {translate('navigation.floating_bar.browser')}
          </Text>
        )}
      </View>
      {activeScreen === BottomBarLink.Browser &&
        additionalLinks?.length &&
        additionalLinks}
      <View style={[styles.itemContainer]}>
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
      {PlatformsUtils.showDependingOnPlatform(
        <View style={[styles.itemContainer]}>
          <Icon
            theme={theme}
            name={Icons.SWAP}
            color={activeScreen === BottomBarLink.SwapBuy ? 'white' : undefined}
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
      bottom: isProposalRequestDisplayed ? insets.bottom + 80 : insets.bottom,
      width: '95%',
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: -insets.bottom - 1,
      paddingBottom: insets.bottom / 2,
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
      paddingBottom: 8 + insets.bottom,
      marginBottom: -insets.bottom,
    },
    marginTop: {
      marginTop: 5,
    },
    active: {
      borderTopRightRadius: 22,
      borderTopLeftRadius: 22,
      backgroundColor: PRIMARY_RED_COLOR,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      show: state.floatingBar.show,
      isProposalRequestDisplayed: state.floatingBar.isProposalRequestDisplayed,
      isLoadingScreen: state.floatingBar.isLoadingScreen,
      isDrawerOpen: state.floatingBar.isDrawerOpened,
      rpc: state.settings.rpc,
      showSwap: state.settings.mobileSettings?.platformRelevantFeatures?.swap,
      activeScreen: state.navigation.activeScreen,
    };
  },
  {showFloatingBar, closeAllTabs},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export const BottomNavigationComponent = connector(BottomNavigation);
