import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {showFloatingBar} from 'actions/floatingBar';
import {forgetRequestedOperation, setRpc as setRpcAction} from 'actions/index';
import {Rpc} from 'actions/interfaces';
import {setDisplayChangeRpcPopup, setSwitchToRpc} from 'actions/rpc-switcher';
import Bridge from 'components/bridge';
import {MessageModal} from 'components/modals/MessageModal';
import RpcSwitcherComponent from 'components/popups/rpc-switcher/rpc-switcher.component';
import {getToggleElement} from 'hooks/toggle';
import MainDrawer from 'navigators/MainDrawer';
import SignUpStack from 'navigators/SignUp';
import UnlockStack from 'navigators/Unlock';
import React, {useEffect, useRef, useState} from 'react';
import RNBootSplash from 'react-native-bootsplash';
import Orientation from 'react-native-orientation-locker';
import {ConnectedProps, connect} from 'react-redux';
import Modal from 'screens/Modal';
import {
  DEFAULT_ACCOUNT_HISTORY_RPC_NODE,
  DEFAULT_HE_RPC_NODE,
} from 'screens/hive/settings/RpcNodes';
import {FloatingBar} from 'screens/hive/wallet/FloatingBar';
import {RootState} from 'store';
import {logScreenView} from 'utils/analytics';
import {downloadColors} from 'utils/colors';
import {setRpc} from 'utils/hive';
import {HiveEngineConfigUtils} from 'utils/hive-engine-config.utils';
import {processQRCodeOp} from 'utils/hive-uri';
import setupLinking, {clearLinkingListeners} from 'utils/linking';
import {modalOptions, noHeader, setNavigator} from 'utils/navigation';
import {useWorkingRPC} from 'utils/rpc-switcher.utils';
import {checkRpcStatus} from 'utils/rpc.utils';
import {ModalNavigationRoute, RootStackParam} from './navigators/Root.types';
import {FLOATINGBAR_ALLOWED_SCREENS} from './reference-data/FloatingScreenList';
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
  rpcSwitcher,
  setDisplayChangeRpcPopup,
  setSwitchToRpc,
  hiveEngineRpc,
  accountHistoryAPIRpc,
  setActiveRpc,
}: PropsFromRedux) => {
  let routeNameRef: React.MutableRefObject<string> = useRef();
  let navigationRef: React.MutableRefObject<NavigationContainerRef> = useRef();
  const [initialRpc, setInitialRpc] = useState<Rpc>();

  useEffect(() => {
    initApplication();
  }, []);

  const initApplication = async () => {
    HiveEngineConfigUtils.setActiveApi(hiveEngineRpc ?? DEFAULT_HE_RPC_NODE);
    HiveEngineConfigUtils.setActiveAccountHistoryApi(
      accountHistoryAPIRpc ?? DEFAULT_ACCOUNT_HISTORY_RPC_NODE,
    );
    initColorAPI();
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

  const initColorAPI = async () => {
    await downloadColors();
  };

  useEffect(() => {
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
    if (activeRpc?.uri !== 'NULL' && activeRpc?.uri !== rpc) {
      initApplication();
    }
    rpc = activeRpc?.uri;
  }, [activeRpc]);

  useEffect(() => {
    console.log('auth', auth);
  }, [auth]);

  useEffect(() => {
    console.log('hasacc', hasAccounts);
  }, [hasAccounts]);

  useEffect(() => {
    console.log('total rerendering');
  }, []);

  const renderMainNavigator = () => {
    if (!hasAccounts) {
      // No accounts, sign up process
      return (
        <Root.Screen name="Main" component={SignUpStack} options={noHeader} />
      );
    } else if (!auth.mk) {
      // Login process
      return (
        <Root.Screen name="Main" component={UnlockStack} options={noHeader} />
      );
    } else {
      // Main page
      return (
        <Root.Screen name="Main" component={MainDrawer} options={noHeader} />
      );
    }
  };

  const renderRootNavigator = () => {
    return (
      <Root.Navigator>
        {renderMainNavigator()}
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
        showFloatingBar(
          !!FLOATINGBAR_ALLOWED_SCREENS.find(
            (route) => route === currentRouteName,
          ),
        );
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
      <FloatingBar />
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
    requestedOp: state.hiveUri.operation,
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
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(App);
