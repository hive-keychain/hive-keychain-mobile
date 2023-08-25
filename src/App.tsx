import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {forgetRequestedOperation} from 'actions/index';
import {Rpc} from 'actions/interfaces';
import Bridge from 'components/bridge';
import {getToggleElement} from 'hooks/toggle';
import MainDrawer from 'navigators/MainDrawer';
import SignUpStack from 'navigators/SignUp';
import UnlockStack from 'navigators/Unlock';
import React, {useEffect, useRef} from 'react';
import RNBootSplash from 'react-native-bootsplash';
import Orientation from 'react-native-orientation-locker';
import {ConnectedProps, connect} from 'react-redux';
import Modal from 'screens/Modal';
import {RootState} from 'store';
import {logScreenView} from 'utils/analytics';
import {setRpc} from 'utils/hive';
import {processQRCodeOp} from 'utils/hive-uri';
import setupLinking, {clearLinkingListeners} from 'utils/linking';
import {modalOptions, noHeader, setNavigator} from 'utils/navigation';
import {ModalNavigationRoute, RootStackParam} from './navigators/Root.types';

//TODO list:
// - On ticker : if you scroll down to hbd and reload, it will bring you to an empty black screen on the widget, swiping brings you back to the right page.
// - On portfolio :
// - add HIVE HBD and HP assets names
// - clicking the widget or the setting wheels only opens keychain if it's already opened, otherwise it crashes
// - HBD savings should be after HIVE savings
// - instead of xxx USD : $xxx
// - change the implementation of account_balance:
//    - the widget config, still call the app popup.
//    - now the app just sends back the account names selected, i.e: {accounts: ['account1', 'account2',...]}
//    - the widget grabs that data:
//      - save in in asynstorage android.
//      - make the requests in order to get the same data/calculations that was doing in the app.
//      - so it will act as a self unit, just needing config 1st time widget creation with the app but no more.

const Root = createStackNavigator<RootStackParam>();

const App = ({
  hasAccounts,
  auth,
  rpc,
  accounts,
  requestedOp,
  forgetRequestedOperation,
}: PropsFromRedux) => {
  let routeNameRef: React.MutableRefObject<string> = useRef();
  let navigationRef: React.MutableRefObject<NavigationContainerRef> = useRef();

  useEffect(() => {
    //TODO remove testing block
    // AsyncStorage.removeItem(
    //   WidgetAsyncStorageItem.ACCOUNT_BALANCE_LIST,
    //   (error) => {
    //     console.log({clearAccountBalanceList: error});
    //   },
    // );
    //end block
    setupLinking();
    RNBootSplash.hide({fade: true});
    Orientation.lockToPortrait();
    return () => {
      clearLinkingListeners();
    };
  }, []);

  useEffect(() => {
    if (accounts.length && requestedOp) {
      processQRCodeOp(requestedOp);
      forgetRequestedOperation();
    }
  }, [accounts, requestedOp]);

  useEffect(() => {
    setRpc(rpc as Rpc);
  }, [rpc]);

  const renderNavigator = () => {
    if (!hasAccounts) {
      // No accounts, sign up process
      return <SignUpStack />;
    } else if (!auth.mk) {
      // has account but not authenticated yet -> Unlock
      return <UnlockStack />;
    } else {
      return <MainDrawer />;
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
        <Root.Screen name="ModalScreen" component={Modal} {...modalOptions} />
      </Root.Navigator>
    );
  };

  return (
    <NavigationContainer
      ref={(navigator) => {
        setNavigator(navigator);
        navigationRef.current = navigator;
      }}
      onReady={() => {
        const currentRouteName = navigationRef.current.getCurrentRoute().name;
        logScreenView(currentRouteName);
      }}
      onStateChange={async (state) => {
        let currentRouteName = navigationRef.current.getCurrentRoute().name;
        const p = navigationRef.current.getCurrentRoute().params;
        if (currentRouteName === 'WalletScreen') {
          currentRouteName = getToggleElement() || 'WalletScreen';
        }
        if (currentRouteName === 'ModalScreen' && !!p) {
          currentRouteName = 'ModalScreen_' + (p as ModalNavigationRoute).name;
        }
        logScreenView(currentRouteName);
      }}>
      {renderRootNavigator()}
      <Bridge />
    </NavigationContainer>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    hasAccounts: state.lastAccount.has,
    auth: state.auth,
    rpc: state.settings.rpc,
    accounts: state.accounts,
    requestedOp: state.hiveUri.operation,
  };
};

const connector = connect(mapStateToProps, {forgetRequestedOperation});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(App);
