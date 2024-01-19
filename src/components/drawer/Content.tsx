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
import React, {useContext} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import {RootState} from 'store';
import MenuItem from './drawer-content-item/MenuItem';

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
  'SwapBuyStack',
  'SwapHistory',
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
        <MenuItem
          labelTranslationKey="navigation.accounts"
          theme={theme}
          onPress={() => navigation.navigate('Accounts')}
          iconImage={
            <Icon
              name={Icons.ACCOUNTS}
              theme={theme}
              color={PRIMARY_RED_COLOR}
            />
          }
          drawBottomLine
        />
        <MenuItem
          labelTranslationKey="navigation.settings"
          theme={theme}
          onPress={() => navigation.navigate('SettingsScreen')}
          iconImage={
            <Icon name={Icons.CANDLE} theme={theme} color={PRIMARY_RED_COLOR} />
          }
          drawBottomLine
        />

        {/* <MenuItem
          labelTranslationKey="navigation.tokens"
          theme={theme}
          onPress={() => navigation.navigate('Tokens')}
          iconImage={<Icon name={Icons.TOKENS} theme={theme} />}
          drawBottomLine
        /> */}
        <MenuItem
          labelTranslationKey="navigation.governance"
          theme={theme}
          onPress={() => navigation.navigate('Governance')}
          iconImage={
            <Icon
              name={Icons.GOVERNANCE}
              theme={theme}
              color={PRIMARY_RED_COLOR}
            />
          }
          drawBottomLine
        />
        <MenuItem
          labelTranslationKey="navigation.theme_setting"
          theme={theme}
          onPress={() => {}}
          iconImage={
            <Icon name={Icons.THEME} theme={theme} color={PRIMARY_RED_COLOR} />
          }
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
              additionalContainerStyle={styles.marginRight}
            />
          }
          drawBottomLine
        />
        <MenuItem
          labelTranslationKey="navigation.about"
          theme={theme}
          onPress={() => navigation.navigate('ABOUT')}
          iconImage={
            <Icon name={Icons.INFO} theme={theme} color={PRIMARY_RED_COLOR} />
          }
          drawBottomLine
        />
        <MenuItem
          labelTranslationKey="navigation.log_out"
          theme={theme}
          onPress={() => {
            lock();
            navigation.closeDrawer();
          }}
          iconImage={
            <Icon name={Icons.LOGOUT} theme={theme} color={PRIMARY_RED_COLOR} />
          }
        />
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
  marginRight: {marginRight: 10},
});
const mapStateToProps = (state: RootState) => ({
  user: state.activeAccount,
});

const connector = connect(mapStateToProps, {lock, closeAllTabs});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(HeaderContent);
