import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {showFloatingBar} from 'actions/floatingBar';
import {
  forgetRequestedOperation,
  getSettings,
  getTokensBackgroundColors,
  setRpc as setRpcAction,
} from 'actions/index';
import {Rpc} from 'actions/interfaces';
import {updateNavigationActiveScreen} from 'actions/navigation';
import {setDisplayChangeRpcPopup, setSwitchToRpc} from 'actions/rpc-switcher';
import Bridge from 'components/bridge';
import {MessageModal} from 'components/modals/MessageModal';
import RpcSwitcherComponent from 'components/popups/rpc-switcher/rpc-switcher.component';
import {getToggleElement} from 'hooks/toggle';
import MainDrawer from 'navigators/MainDrawer';
import SignUpStack from 'navigators/SignUp';
import UnlockStack from 'navigators/Unlock';
import React, {useEffect, useRef} from 'react';
import Orientation from 'react-native-orientation-locker';
import {ConnectedProps, connect} from 'react-redux';
import {BottomNavigationComponent} from 'screens/hive/wallet/BottomNavigation.component';
import Modal from 'screens/Modal';
import {
  DEFAULT_ACCOUNT_HISTORY_RPC_NODE,
  DEFAULT_HE_RPC_NODE,
} from 'src/interfaces/hiveEngineRpc.interface';
import {RootState} from 'store';
import {logScreenView} from 'utils/analytics.utils';
import {HiveEngineConfigUtils} from 'utils/hiveEngineConfig.utils';
import {setRpc} from 'utils/hiveLibs.utils';
import {processQRCodeOp} from 'utils/hiveUri.utils';
import setupLinking, {clearLinkingListeners} from 'utils/linking.utils';
import {noHeader, setNavigator} from 'utils/navigation.utils';
import {checkRpcStatus} from 'utils/rpc.utils';
import {useWorkingRPC} from 'utils/rpcSwitcher.utils';
import {FLOATINGBAR_ALLOWED_SCREENS} from './lists/floatingBarAllowedScreens.list';
import {ModalNavigationRoute, RootStackParam} from './navigators/Root.types';
const Root = createStackNavigator<RootStackParam>();
let rpc: string | undefined = '';

const App = ({
  hasAccounts,
  auth,
  activeRpc,
  accounts,
  requestedOp,
  forgetRequestedOperation,
  showFloatingBar,
  setDisplayChangeRpcPopup,
  hiveEngineRpc,
  accountHistoryAPIRpc,
  getTokensBackgroundColors,
  getSettings,
  updateNavigationActiveScreen,
}: PropsFromRedux) => {
  let navigationRef: React.MutableRefObject<NavigationContainerRef<any>> =
    useRef(null);
  let lastRouteName: string | undefined = undefined;
  useEffect(() => {
    getSettings();
    initApplication();
  }, []);

  const initApplication = async () => {
    HiveEngineConfigUtils.setActiveApi(hiveEngineRpc ?? DEFAULT_HE_RPC_NODE);
    HiveEngineConfigUtils.setActiveAccountHistoryApi(
      accountHistoryAPIRpc ?? DEFAULT_ACCOUNT_HISTORY_RPC_NODE,
    );
    getTokensBackgroundColors();
    showFloatingBar(false);
    await initActiveRpc(activeRpc);
  };

  const initActiveRpc = async (rpc: Rpc) => {
    const rpcStatusOk = await checkRpcStatus(rpc.uri);
    setDisplayChangeRpcPopup(!rpcStatusOk);
    if (rpcStatusOk) {
      setRpc(rpc);
    } else {
      useWorkingRPC(rpc);
    }
  };

  useEffect(() => {
    setupLinking();
    Orientation.lockToPortrait();
    return () => {
      clearLinkingListeners();
    };
  }, []);

  useEffect(() => {
    if (accounts.length && requestedOp.opType && requestedOp.operation) {
      processQRCodeOp(requestedOp.opType, requestedOp.operation);
      forgetRequestedOperation();
    }
  }, [accounts.length, requestedOp]);

  useEffect(() => {
    if (activeRpc?.uri !== 'NULL' && activeRpc?.uri !== rpc) {
      initApplication();
    }
    rpc = activeRpc?.uri;
  }, [activeRpc]);

  const renderMainNavigator = () => {
    if (!hasAccounts) {
      // No accounts, sign up process
      return (
        <Root.Screen
          name="Main"
          component={SignUpStack}
          options={{...noHeader, animation: 'none'}}
        />
      );
    } else if (!auth.mk) {
      // Login process
      return (
        <Root.Screen
          name="Main"
          component={UnlockStack}
          options={{...noHeader, animation: 'none'}}
        />
      );
    } else {
      // Main page
      return (
        <Root.Screen
          name="Main"
          component={MainDrawer}
          options={{...noHeader, animation: 'none'}}
        />
      );
    }
  };

  const renderRootNavigator = () => {
    return (
      <Root.Navigator id={undefined}>
        {renderMainNavigator()}
        <Root.Screen
          name="ModalScreen"
          component={Modal}
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            cardStyle: {backgroundColor: 'transparent'},
            animation: 'fade',
          }}
        />
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
        if (lastRouteName === currentRouteName) {
          return;
        }
        lastRouteName = currentRouteName;
        showFloatingBar(
          !!FLOATINGBAR_ALLOWED_SCREENS.find(
            (route) => route === currentRouteName,
          ),
        );
        updateNavigationActiveScreen(currentRouteName);
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
      <MessageModal />
      <BottomNavigationComponent />
      <RpcSwitcherComponent initialRpc={activeRpc} />
      <Bridge />
    </NavigationContainer>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    hasAccounts: state.lastAccount.has,
    auth: state.auth,
    activeRpc: state.settings.rpc,
    accounts: state.accounts,
    requestedOp: state.hiveUri,
    rpcSwitcher: state.rpcSwitcher,
    hiveEngineRpc: state.settings.hiveEngineRpc,
    accountHistoryAPIRpc: state.settings.accountHistoryAPIRpc,
  };
};

const connector = connect(mapStateToProps, {
  forgetRequestedOperation,
  showFloatingBar,
  setDisplayChangeRpcPopup,
  setSwitchToRpc,
  setActiveRpc: setRpcAction,
  getTokensBackgroundColors,
  getSettings,
  updateNavigationActiveScreen,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(App);
