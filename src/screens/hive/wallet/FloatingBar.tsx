import {NavigationContainerRef} from '@react-navigation/native';
import Icon from 'components/hive/Icon';
import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {body_primary_body_1} from 'src/styles/typography';
import {RootState} from 'store';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

const ScreensComponentAllowanceList = ['BrowserScreen', 'WalletScreen'];

export type FloatingBarLink = 'ecosystem' | 'browser' | 'buy' | 'swap';
interface Props {
  navigationRef: React.MutableRefObject<NavigationContainerRef>;
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
  navigationRef,
  isDrawerOpen,
}: Props & PropsFromRedux) => {
  const [activeLink, setActiveLink] = useState<FloatingBarLink>('ecosystem');
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

  let currentRouteName = navigationRef.current?.getCurrentRoute().name;

  let isScreenFound = undefined;
  if (currentRouteName) {
    isScreenFound = ScreensComponentAllowanceList.find(
      (screenName) => screenName === currentRouteName,
    );
  }

  const getActiveStyle = (link: FloatingBarLink) =>
    activeLink === link ? styles.active : undefined;

  const onHandlePressButton = (link: FloatingBarLink) => {
    setActiveLink(link);
    let screen = '';
    switch (link) {
      case 'ecosystem':
        screen = 'WALLET';
        break;
      case 'browser':
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

  return show && !isLoadingScreen && !isDrawerOpen && isScreenFound ? (
    <View style={[getCardStyle(theme).floatingBar, styles.container]}>
      <View style={[styles.itemContainer, getActiveStyle('ecosystem')]}>
        <Icon
          theme={theme}
          name="wallet_add"
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
    </View>
  ) : null;
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

const connector = connect((state: RootState) => {
  return {
    show: state.floatingBar.show,
    isLoadingScreen: state.floatingBar.isLoadingScreen,
    isDrawerOpen: state.floatingBar.isDrawerOpened,
  };
}, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

export const FloatingBar = connector(Floating);
