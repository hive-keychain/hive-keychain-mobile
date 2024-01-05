import {showFloatingBar} from 'actions/floatingBar';
import Icon from 'components/hive/Icon';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {body_primary_body_1} from 'src/styles/typography';
import {RootState} from 'store';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

const ScreensComponentAllowanceList = ['WalletScreen', 'SwapBuyStack'];

export type FloatingBarLink = 'ecosystem' | 'browser' | 'scan_qr' | 'swap_buy';
interface Props {
  currentRouteName: string;
  showTags?: boolean;
}
//TODO this should be a bottom navigator, do some research and integrate in the mainstack
const Floating = ({
  show,
  showTags,
  isLoadingScreen,
  currentRouteName,
  isDrawerOpen,
  showFloatingBar,
}: Props & PropsFromRedux) => {
  const [activeLink, setActiveLink] = useState<FloatingBarLink>('ecosystem');
  const [isScreenAllowed, setIsScreenAllowed] = useState(false);
  const {theme} = useThemeContext();
  const styles = getStyles(theme);

  useEffect(() => {
    if (currentRouteName) {
      const isAllowed =
        ScreensComponentAllowanceList.find(
          (screenName) => screenName === currentRouteName,
        ) !== undefined;
      setIsScreenAllowed(isAllowed);
      if (isAllowed) {
        switch (true) {
          case currentRouteName === 'WALLET' ||
            currentRouteName === 'WalletScreen':
            setActiveLink('ecosystem');
            break;
          case currentRouteName === 'BrowserScreen':
            setActiveLink('browser');
            break;
          case currentRouteName === 'SwapBuyStack':
            setActiveLink('swap_buy');
            break;
        }
      }
    }
  }, [currentRouteName]);

  const getActiveStyle = (link: FloatingBarLink) =>
    activeLink === link ? styles.active : undefined;

  const getActiveIconColor = (link: FloatingBarLink) =>
    activeLink === link ? '#FFF' : undefined;

  const onHandlePressButton = (link: FloatingBarLink) => {
    setActiveLink(link);
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

  const renderNavigationBar = () => {
    return (
      <View style={[getCardStyle(theme).floatingBar, styles.container]}>
        <View style={[styles.itemContainer, getActiveStyle('ecosystem')]}>
          <Icon
            theme={theme}
            name={Icons.WALLET_ADD}
            color={getActiveIconColor('ecosystem')}
            {...styles.icon}
            onClick={() => onHandlePressButton('ecosystem')}
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
            {...styles.icon}
            onClick={() => onHandlePressButton('browser')}
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
            {...styles.icon}
            onClick={() => onHandlePressButton('scan_qr')}
          />
          {showTags && (
            <Text style={[styles.textBase, styles.marginTop]}>
              {translate('navigation.floating_bar.buy')}
            </Text>
          )}
        </View>
        <View style={[styles.itemContainer, getActiveStyle('swap_buy')]}>
          <Icon
            theme={theme}
            color={getActiveIconColor('swap_buy')}
            name={Icons.SWAP}
            {...styles.icon}
            onClick={() => onHandlePressButton('swap_buy')}
          />
          {showTags && (
            <Text style={[styles.textBase, styles.marginTop]}>
              {translate('navigation.floating_bar.swap')}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return show && !isLoadingScreen && !isDrawerOpen && isScreenAllowed
    ? renderNavigationBar()
    : null;
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      width: '95%',
      marginBottom: 0,
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 0,
      alignItems: 'center',
    },
    textBase: {
      ...body_primary_body_1,
      color: getColors(theme).secondaryText,
    },
    itemContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '25%',
    },
    icon: {
      width: 30,
      height: 30,
    },
    marginTop: {
      marginTop: 5,
    },
    active: {
      borderTopRightRadius: 22,
      borderTopLeftRadius: 22,
      backgroundColor: PRIMARY_RED_COLOR,
      paddingVertical: 8,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      show: state.floatingBar.show,
      isLoadingScreen: state.floatingBar.isLoadingScreen,
      isDrawerOpen: state.floatingBar.isDrawerOpened,
    };
  },
  {showFloatingBar},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export const FloatingBar = connector(Floating);
