import {showFloatingBar} from 'actions/floatingBar';
import Icon from 'components/hive/Icon';
import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {body_primary_body_1} from 'src/styles/typography';
import {RootState} from 'store';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

const ScreensComponentAllowanceList = ['WalletScreen', 'BrowserScreen'];

export type FloatingBarLink = 'ecosystem' | 'browser' | 'buy' | 'swap';
interface Props {
  currentRouteName: string;
  showTags?: boolean;
}
//TODO
//  Info:
//  Components to show floatingBar & pass current_route:
//    -> Wallet: src/screens/hive/wallet/Main.tsx.
//    -> Browser: src/components/browser/index.tsx
//      -> Just in the browser can be switch(proposing a button here) for a browser bar.
//    -> Swap/Buy mainscreen(which will be a tab) //TODO

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
  const [showInBrowserScreen, setShowInBrowserScreen] = useState(false);
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

  useEffect(() => {
    if (currentRouteName) {
      console.log('in FB: ', {currentRouteName}); //TODO remove line
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
          //TODO bellow buy & swap as stacks.
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
    switch (link) {
      case 'ecosystem':
        screen = 'WALLET';
        break;
      case 'browser':
        showFloatingBar(false);
        screen = 'BrowserScreen';
        break;
      case 'buy':
        //TODO buy as stack using templateStack.
        return console.log('TODO buy as stack & style!!');
      case 'swap':
        //TODO swaps as stack using templateStack.
        return console.log('TODO swap as stack & style!!');
    }
    return navigate(screen);
  };

  const onHandleLongPress = () => {
    if (currentRouteName === 'BrowserScreen') {
      showFloatingBar(false);
    }
  };

  const renderNavigationBar = () => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onLongPress={onHandleLongPress}
        style={[getCardStyle(theme).floatingBar, styles.container]}>
        <View style={[styles.itemContainer, getActiveStyle('ecosystem')]}>
          <Icon
            theme={theme}
            name="wallet_add"
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
            name="global"
            {...styles.icon}
            onClick={() => onHandlePressButton('browser')}
          />
          {showTags && (
            <Text style={[styles.textBase, styles.marginTop]}>
              {translate('navigation.floating_bar.browser')}
            </Text>
          )}
        </View>
        <View style={[styles.itemContainer, getActiveStyle('buy')]}>
          <Icon
            theme={theme}
            name="scanner"
            color={getActiveIconColor('buy')}
            {...styles.icon}
            onClick={() => onHandlePressButton('buy')}
          />
          {showTags && (
            <Text style={[styles.textBase, styles.marginTop]}>
              {translate('navigation.floating_bar.buy')}
            </Text>
          )}
        </View>
        <View style={[styles.itemContainer, getActiveStyle('swap')]}>
          <Icon
            theme={theme}
            color={getActiveIconColor('swap')}
            name="swap"
            {...styles.icon}
            onClick={() => onHandlePressButton('swap')}
          />
          {showTags && (
            <Text style={[styles.textBase, styles.marginTop]}>
              {translate('navigation.floating_bar.swap')}
            </Text>
          )}
        </View>
      </TouchableOpacity>
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
