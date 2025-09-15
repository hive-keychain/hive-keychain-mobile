import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {addTab, closeAllTabs, lock} from 'actions/index';
import SwitchDarkIcon from 'assets/new_UI/moon.svg';
import SwitchLightIcon from 'assets/new_UI/sun.svg';
import DrawerFooter from 'components/drawer/Footer';
import DrawerHeader from 'components/drawer/Header';
import CustomSwitch from 'components/form/CustomSwitch';
import Icon from 'components/hive/Icon';
import React, {useContext} from 'react';
import {StyleSheet, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import {RootState} from 'store';
import MenuItem from './drawer-content-item/MenuItem';

type Props = PropsFromRedux & DrawerContentComponentProps;

const hiddenRoutesInMain = [
  'CreateAccountScreen',
  'AddAccountStack',
  'AccountManagementScreen',
  'ExportAccountsQRScreen',
  'Wallet',
  'Browser',
  'Governance',
  'SettingsScreen',
  'ABOUT',
  'Accounts',
  'Tokens',
  'TokensHistory',
  'Operation',
  'TokenSettings',
  'TokenDelegations',
  'HPDelegations',
  'PendingSavings',
  'PendingConversions',
  'RcDelegations',
  'SwapConfirm',
  'ToggleWitness',
  'SwapBuyStack',
  'SwapHistory',
  'CreateAccountConfirmationScreen',
  'Help',
];

const DrawerContent = (props: Props) => {
  const {user, lock, navigation, state, addTab, descriptors} =
    props || ({} as Props);

  // guard against undefined state (v7 can sometimes pass undefined)
  if (!state) return null;

  // Filter out hidden routes and ensure the index points to a valid route
  const filteredRoutes = state.routes.filter(
    (route) => !hiddenRoutesInMain.includes(route.name),
  );

  const currentRoute = state.routes[state.index];
  let newIndex = filteredRoutes.findIndex((r) => r.key === currentRoute?.key);
  if (newIndex === -1) newIndex = 0;

  const newState = {
    ...state,
    routes: filteredRoutes,
    index: newIndex,
  };

  const {theme, toggleTheme} = useContext(ThemeContext);

  const filteredDescriptors = Object.fromEntries(
    filteredRoutes.map((r) => [r.key, descriptors[r.key]]),
  ) as typeof descriptors;

  return (
    <View style={styles.root}>
      <DrawerContentScrollView
        {...props}
        style={{flex: 1}}
        contentContainerStyle={styles.contentContainer}>
        <DrawerHeader theme={theme} props={props} />
        <View style={{flex: 1, marginTop: 10}}>
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
              <Icon
                name={Icons.CANDLE}
                theme={theme}
                color={PRIMARY_RED_COLOR}
              />
            }
            drawBottomLine
          />
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
            onPress={() => toggleTheme()}
            iconImage={
              <Icon
                name={Icons.THEME}
                theme={theme}
                color={PRIMARY_RED_COLOR}
              />
            }
            leftSideComponent={
              <CustomSwitch
                currentValue={theme}
                iconLeftSide={<SwitchLightIcon width={24} height={24} />}
                iconRightSide={<SwitchDarkIcon width={24} height={24} />}
                valueLeft={Theme.LIGHT}
                valueRight={Theme.DARK}
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
            labelTranslationKey="navigation.help"
            theme={theme}
            onPress={() => navigation.navigate('Help')}
            iconImage={
              <Icon name={Icons.HELP} theme={theme} color={PRIMARY_RED_COLOR} />
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
              <Icon
                name={Icons.LOGOUT}
                theme={theme}
                color={PRIMARY_RED_COLOR}
              />
            }
          />

          {/* Pass full drawer props with overridden state so descriptors match filtered routes */}
          {newState.routes.length > 0 && (
            <DrawerItemList
              {...props}
              state={newState}
              descriptors={filteredDescriptors}
            />
          )}
        </View>
      </DrawerContentScrollView>
      <DrawerFooter user={user} theme={theme} addTab={addTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    zIndex: 0,
  },
  marginRight: {marginRight: 10},
});

const mapStateToProps = (state: RootState) => ({
  user: state.activeAccount,
});

const connector = connect(mapStateToProps, {lock, closeAllTabs, addTab});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(DrawerContent);
