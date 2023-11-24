import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {closeAllTabs, lock} from 'actions/index';
import SwitchDarkIcon from 'assets/new_UI/moon.svg';
import SwitchLightIcon from 'assets/new_UI/sun.svg';
import DrawerFooter from 'components/drawer/Footer';
import DrawerHeader from 'components/drawer/Header';
import CustomSwitch from 'components/form/CustomSwitch';
import Icon from 'components/hive/Icon';
import {WalletHistoryComponentProps} from 'components/hive/Wallet-history-component';
import React, {useContext} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {RootState} from 'store';
import DrawerContentItem from './drawer-content-item/DrawerContentItem';

type Props = PropsFromRedux & DrawerContentComponentProps;

const hiddenRoutesInMain = [
  'CreateAccountScreen',
  'AddAccountStack',
  'AccountManagementScreen',
  'WALLET',
  'BrowserScreen',
  'Governance',
  'SettingsScreen',
  'ABOUT',
  'Accounts',
  'Tokens',
  'TokensHistory',
  'Operation',
  'TemplateStack',
];

const HeaderContent = (props: Props) => {
  const {user, lock, navigation, itemStyle, state, ...rest} = props;
  const newState = {...state};
  newState.routes = newState.routes.filter(
    (route) => !hiddenRoutesInMain.includes(route.name),
  );
  const {theme, setTheme} = useContext(ThemeContext);

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.contentContainer}>
      <DrawerHeader theme={theme} props={props} />
      <ScrollView>
        <DrawerContentItem
          labelTranslationKey="navigation.accounts"
          theme={theme}
          onPress={() => navigation.navigate('Accounts')}
          iconImage={<Icon name={'accounts'} theme={theme} />}
          drawBottomLine
        />
        <DrawerContentItem
          labelTranslationKey="navigation.settings"
          theme={theme}
          onPress={() => navigation.navigate('SettingsScreen')}
          iconImage={<Icon name="candle" theme={theme} />}
          drawBottomLine
        />
        <DrawerContentItem
          labelTranslationKey="navigation.tokens"
          theme={theme}
          onPress={() => navigation.navigate('Tokens')}
          iconImage={<Icon name={'tokens'} theme={theme} />}
          drawBottomLine
        />
        <DrawerContentItem
          labelTranslationKey="navigation.governance"
          theme={theme}
          onPress={() => navigation.navigate('Governance')}
          iconImage={<Icon name={'governance'} theme={theme} />}
          drawBottomLine
        />
        <DrawerContentItem
          labelTranslationKey="navigation.theme_setting"
          theme={theme}
          onPress={() => {}}
          iconImage={<Icon name={'theme'} theme={theme} />}
          leftSideComponent={
            <CustomSwitch
              theme={theme}
              iconLeftSide={<SwitchLightIcon width={24} height={24} />}
              iconRightSide={<SwitchDarkIcon width={24} height={24} />}
              initalValue={theme === Theme.LIGHT}
              valueTrue={Theme.LIGHT}
              valueFalse={Theme.DARK}
              onValueChange={(value) => {
                setTheme(value);
              }}
            />
          }
          drawBottomLine
        />
        <DrawerContentItem
          labelTranslationKey="navigation.about"
          theme={theme}
          onPress={() => navigation.navigate('ABOUT')}
          iconImage={
            <Icon name={'info'} theme={theme} color={getColors(theme).icon} />
          }
          drawBottomLine
        />
        <DrawerContentItem
          labelTranslationKey="navigation.log_out"
          theme={theme}
          onPress={() => {
            lock();
            navigation.closeDrawer();
          }}
          iconImage={<Icon name={'logout'} theme={theme} />}
        />
        {/* //TODO remove bellow just added temporary to use data. */}
        <DrawerContentItem
          labelTranslationKey="common.history"
          theme={theme}
          onPress={() =>
            navigation.navigate('WALLET', {
              screen: 'WalletHistoryScreen',
              params: {
                currency: '',
              } as WalletHistoryComponentProps,
            })
          }
          iconImage={<Icon name={'lost-icon-on-pourpose'} theme={theme} />}
        />
        <DrawerContentItem
          labelTranslationKey="navigation.browser"
          theme={theme}
          onPress={() => navigation.navigate('BrowserScreen')}
          iconImage={<Icon name={'logout'} theme={theme} />}
        />
        {/* //TODO until here temporary */}

        <DrawerItemList
          state={{
            ...newState,
          }}
          navigation={navigation}
          itemStyle={itemStyle}
          {...rest}
        />
      </ScrollView>
      <DrawerFooter user={user} theme={theme} />
    </DrawerContentScrollView>
  );
};
const styles = StyleSheet.create({
  contentContainer: {height: '100%', flex: 1, zIndex: 0},
});
const mapStateToProps = (state: RootState) => ({
  user: state.activeAccount,
});

const connector = connect(mapStateToProps, {lock, closeAllTabs});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(HeaderContent);
