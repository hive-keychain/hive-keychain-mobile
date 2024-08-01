import {showFloatingBar} from 'actions/floatingBar';
import {closeAllTabs} from 'actions/index';
import Icon from 'components/hive/Icon';
import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Platform,
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
import {
  SMALLEST_SCREEN_WIDTH_SUPPORTED,
  body_primary_body_1,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {PlatformsUtils} from 'utils/platforms.utils';

export type FloatingBarLink = 'ecosystem' | 'browser' | 'scan_qr' | 'swap_buy';
interface Props {
  showTags?: boolean;
}

const Floating = ({
  show,
  showTags,
  isLoadingScreen,
  isDrawerOpen,
  closeAllTabs,
  rpc,
  isProposalRequestDisplayed,
  showSwap,
}: Props & PropsFromRedux) => {
  const [activeLink, setActiveLink] = useState<FloatingBarLink>('ecosystem');
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getStyles(
    theme,
    {width, height},
    useSafeAreaInsets(),
    isProposalRequestDisplayed,
  );
  const anim = useRef(new Animated.Value(0)).current;
  const [isTop, setIsTop] = useState(false);
  console.log('show', showSwap);
  const getActiveStyle = (link: FloatingBarLink) =>
    activeLink === link ? styles.active : undefined;

  const getActiveIconColor = (link: FloatingBarLink) =>
    activeLink === link ? '#FFF' : undefined;

  const onHandlePressButton = (link: FloatingBarLink) => {
    // setActiveLink(link); //TODO commented for now as no need.
    let screen = '';
    let nestedScreenOrParams;
    switch (link) {
      case 'ecosystem':
        screen = 'WALLET';
        nestedScreenOrParams = {
          screen: 'WalletScreen',
        };
        break;
      case 'browser':
        screen = 'BrowserScreen';
        break;
      case 'scan_qr':
        screen = 'WALLET';
        nestedScreenOrParams = {
          screen: 'ScanQRFromWalletScreen',
          params: {wallet: true},
        };
        break;
      case 'swap_buy':
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
    }).start(() => {});
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
      <View style={[styles.itemContainer, getActiveStyle('ecosystem')]}>
        <Icon
          theme={theme}
          name={Icons.WALLET_ADD}
          color={getActiveIconColor('ecosystem')}
          {...getIconDimensions(width)}
          onPress={() => onHandlePressButton('ecosystem')}
        />
        {showTags && (
          <Text style={[styles.textBase, styles.marginTop]}>
            {translate('navigation.floating_bar.ecosystem')}
          </Text>
        )}
      </View>
      <View style={[styles.itemContainer, getActiveStyle('browser')]}>
        <Icon
          theme={theme}
          color={getActiveIconColor('browser')}
          name={Icons.GLOBAL}
          {...getIconDimensions(width)}
          onPress={() => onHandlePressButton('browser')}
          onLongPress={() => {
            console.log('closing all tabs');
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
      <View style={[styles.itemContainer, getActiveStyle('scan_qr')]}>
        <Icon
          theme={theme}
          name={Icons.SCANNER}
          color={getActiveIconColor('scan_qr')}
          {...getIconDimensions(width)}
          onPress={() => onHandlePressButton('scan_qr')}
        />
        {showTags && (
          <Text style={[styles.textBase, styles.marginTop]}>
            {translate('navigation.floating_bar.buy')}
          </Text>
        )}
      </View>
      {PlatformsUtils.showDependingOnPlatform(
        <View style={[styles.itemContainer, getActiveStyle('swap_buy')]}>
          <Icon
            theme={theme}
            color={getActiveIconColor('swap_buy')}
            name={Icons.SWAP}
            {...getIconDimensions(width)}
            onPress={() => onHandlePressButton('swap_buy')}
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
      bottom: isProposalRequestDisplayed ? 80 : 0,
      width: '95%',
      marginBottom: 0,
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: Platform.OS === 'ios' ? 20 : 0,
      alignItems: 'center',
    },
    textBase: {
      ...body_primary_body_1,
      color: getColors(theme).secondaryText,
    },
    itemContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? '20%' : '25%',
    },
    marginTop: {
      marginTop: 5,
    },
    active: {
      borderTopRightRadius: 22,
      borderTopLeftRadius: 22,
      backgroundColor: PRIMARY_RED_COLOR,
      paddingTop: 8,
      paddingBottom: 8 + insets.bottom,
      marginBottom: -insets.bottom,
    },
  });

const connector = connect(
  (state: RootState) => {
    console.log(state.settings);
    return {
      show: state.floatingBar.show,
      isProposalRequestDisplayed: state.floatingBar.isProposalRequestDisplayed,
      isLoadingScreen: state.floatingBar.isLoadingScreen,
      isDrawerOpen: state.floatingBar.isDrawerOpened,
      rpc: state.settings.rpc,
      showSwap: state.settings.mobileSettings?.platformRelevantFeatures?.swap,
    };
  },
  {showFloatingBar, closeAllTabs},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export const FloatingBar = connector(Floating);
