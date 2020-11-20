import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
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
import MoreInformation from 'components/infoButtons/MoreInfo';
import InfoPIN from 'components/infoButtons/ForgotPin';
import {
  setNavigator,
  headerTransparent,
  noHeader,
  modalOptions,
} from 'utils/navigation';
import Hive from 'assets/wallet/hive.svg';
import Search from 'assets/wallet/search.svg';
import Key from 'assets/addAccount/icon_key.svg';
import Menu from 'assets/wallet/menu.svg';
import {lock} from 'actions';
import {navigate} from 'utils/navigation';

const Stack = createStackNavigator();
const Root = createStackNavigator();

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
        <Stack.Navigator>
          <Stack.Screen
            name="WalletScreen"
            component={Wallet}
            options={{
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
                      style={{marginRight: 10}}
                      onPress={() => {
                        lockConnect();
                      }}
                    />
                    {
                      // <Search
                      //   style={styles(width, height).right}
                      //   onPress={() => {
                      //     lockConnect();
                      //   }}
                      // />
                      // <Key
                      //   style={styles(width, height).right}
                      //   onPress={() => {
                      //     navigate('AccountManagementScreen');
                      //   }}
                      // />
                    }
                  </>
                );
              },
              headerLeft: () => {
                return <Hive style={styles(width, height).left} />;
              },
            }}
          />
          <Stack.Screen
            name="AccountManagementScreen"
            component={AccountManagement}
            options={{
              headerTintColor: 'white',
              headerTransparent,
              title: 'MANAGE KEYS',
            }}
          />
          <Stack.Screen
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
    }
  };

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
  return {hasAccounts: state.lastAccount.has, auth: state.auth};
};

const styles = (width, height) =>
  StyleSheet.create({
    left: {marginHorizontal: 0.05 * width},
    right: {marginHorizontal: 0.05 * width, marginBottom: -4},
  });

export default connect(mapStateToProps, {lockConnect: lock})(App);
