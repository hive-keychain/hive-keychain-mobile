import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {connect} from 'react-redux';
import {useWindowDimensions, StyleSheet} from 'react-native';

import Introduction from 'screens/Introduction';
import Signup from 'screens/Signup';
import Unlock from 'screens/Unlock';
import Modal from 'screens/Modal';
import CreateAccount from 'screens/CreateAccount';
import AccountManagement from 'screens/settings/AccountManagement';
import Wallet from 'screens/wallet/Main';
import AddAccountByKey from 'screens/addAccounts/AddAccountByKey';
import ScanQR from 'screens/addAccounts/ScanQR';
import About from 'screens/settings/About';

import MoreInformation from 'components/infoButtons/MoreInfo';
import InfoPIN from 'components/infoButtons/ForgotPin';
import DrawerContent from 'components/drawer/Content';
import {
  setNavigator,
  headerTransparent,
  noHeader,
  modalOptions,
} from 'utils/navigation';
import Hive from 'assets/wallet/hive.svg';
import Menu from 'assets/wallet/menu.svg';
import {lock} from 'actions';

const Stack = createStackNavigator();
const Root = createStackNavigator();
const AccountStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const App = ({hasAccounts, auth, lockConnect}) => {
  const {height, width} = useWindowDimensions();

  const renderNavigator = () => {
    if (!hasAccounts) {
      return (
        <Stack.Navigator>
          <Stack.Screen
            name="IntroductionScreen"
            options={noHeader}
            component={Introduction}
          />
          <Stack.Screen
            name="SignupScreen"
            options={noHeader}
            component={Signup}
          />
          <Stack.Screen
            name="CreateAccountScreen"
            options={noHeader}
            component={CreateAccount}
          />
          <Stack.Screen
            name="AddAccountByKeyScreen"
            options={{
              title: 'ADD ACCOUNT',
              headerRight: () => <MoreInformation type="moreInfo" />,
              headerTintColor: 'white',
              headerTransparent,
            }}
            component={AddAccountByKey}
          />
          <Stack.Screen
            name="ScanQRScreen"
            options={{
              headerTransparent,
              headerTintColor: 'white',
              title: '',
              headerRight: () => {
                return <MoreInformation type="qr" />;
              },
            }}
            component={ScanQR}
          />
        </Stack.Navigator>
      );
    } else if (!auth.mk) {
      return (
        <Stack.Navigator>
          <Stack.Screen
            name="UnlockScreen"
            component={Unlock}
            options={{
              title: '',
              headerRight: () => <InfoPIN />,
              headerTintColor: 'white',
              headerTransparent,
            }}
          />
        </Stack.Navigator>
      );
    } else {
      return (
        <Drawer.Navigator
          drawerStyle={styles().drawer}
          hideStatusBar
          drawerPosition="right"
          drawerContentOptions={{
            activeTintColor: '#FFFFFF',
            inactiveTintColor: '#FFFFFF',
            activeBackgroundColor: '#A3112A',
            itemStyle: {marginHorizontal: 0, borderRadius: 0, paddingLeft: 10},
          }}
          drawerContent={(props) => <DrawerContent {...props} />}>
          <Drawer.Screen name="WALLET" component={renderWalletNavigator} />
          <Drawer.Screen
            headerShown
            headerTitle="MANAGE KEYS"
            headerTintColor="white"
            name="AccountManagementScreen"
            component={AccountManagement}
            options={{
              headerTintColor: 'white',
              headerTransparent,
              title: 'MANAGE KEYS',
            }}
          />
          <Drawer.Screen
            name="AddAccountStack"
            options={{title: 'ADD ACCOUNT'}}
            component={renderAddAccountFromWalletNavigator}
          />
          <Drawer.Screen name="ABOUT" component={About} />
        </Drawer.Navigator>
      );
    }
  };

  const renderAddAccountFromWalletNavigator = () => (
    <AccountStack.Navigator>
      <AccountStack.Screen
        name="AddAccountFromWalletScreen"
        options={{
          title: 'ADD ACCOUNT',
          headerRight: () => {
            return <MoreInformation type="moreInfo" />;
          },
          headerTintColor: 'white',
          headerTransparent,
        }}
        component={AddAccountByKey}
      />
      <AccountStack.Screen
        name="ScanQRScreen"
        options={{
          headerTransparent,
          headerTintColor: 'white',
          title: '',
          headerRight: () => {
            return <MoreInformation type="qr" />;
          },
        }}
        component={ScanQR}
      />
    </AccountStack.Navigator>
  );

  const renderWalletNavigator = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="WalletScreen"
        component={Wallet}
        options={({navigation}) => ({
          headerStyle: {
            backgroundColor: '#A3112A',
          },
          headerTitleAlign: 'center',
          title: 'WALLET',
          headerTintColor: 'white',
          headerRight: () => {
            return (
              <>
                <Menu
                  width={25}
                  height={25}
                  style={styles.menu}
                  onPress={() => {
                    navigation.openDrawer();
                  }}
                />
              </>
            );
          },

          headerLeft: () => {
            return <Hive style={styles(width, height).left} />;
          },
        })}
      />
    </Stack.Navigator>
  );

  const renderRootNavigator = () => {
    return (
      <Root.Navigator>
        <Root.Screen
          name="Main"
          component={renderNavigator}
          options={noHeader}
        />
        <Root.Screen
          name="ModalScreen"
          mode="modal"
          component={Modal}
          {...modalOptions}
        />
      </Root.Navigator>
    );
  };

  return (
    <NavigationContainer ref={(navigator) => setNavigator(navigator)}>
      {renderRootNavigator()}
    </NavigationContainer>
  );
};

const mapStateToProps = (state) => {
  console.log(state);
  return {
    hasAccounts: state.lastAccount.has,
    auth: state.auth,
  };
};

const styles = (width, height) =>
  StyleSheet.create({
    left: {marginHorizontal: 0.05 * width},
    right: {marginHorizontal: 0.05 * width, marginBottom: -4},
    drawer: {
      backgroundColor: '#000000',
    },
    menu: {marginRight: 10},
  });

export default connect(mapStateToProps, {lockConnect: lock})(App);
