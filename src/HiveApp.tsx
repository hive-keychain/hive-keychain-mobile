import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {showFloatingBar} from 'actions/floatingBar';
import {forgetRequestedOperation, setActiveRpc} from 'actions/index';
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
import {DEFAULT_RPC, setRpc} from 'utils/hive';
import {HiveEngineConfigUtils} from 'utils/hive-engine-config.utils';
import {processQRCodeOp} from 'utils/hive-uri';
import setupLinking, {clearLinkingListeners} from 'utils/linking';
import {modalOptions, noHeader, setNavigator} from 'utils/navigation';
import {useWorkingRPC} from 'utils/rpc-switcher.utils';
import {checkRpcStatus, getCurrentRpc} from 'utils/rpc.utils';
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
  // rpc,
  setActiveRpc,
}: PropsFromRedux) => {
  let routeNameRef: React.MutableRefObject<string> = useRef();
  let navigationRef: React.MutableRefObject<NavigationContainerRef> = useRef();
  const [initialRpc, setInitialRpc] = useState<Rpc>();

  console.log({activeRpc}); //TODO remove line
  useEffect(() => {
    initApplication();
    // initColorAPI();
    // showFloatingBar(false);
  }, []);

  const initApplication = async () => {
    HiveEngineConfigUtils.setActiveApi(hiveEngineRpc ?? DEFAULT_HE_RPC_NODE);
    HiveEngineConfigUtils.setActiveAccountHistoryApi(
      accountHistoryAPIRpc ?? DEFAULT_ACCOUNT_HISTORY_RPC_NODE,
    );
    initColorAPI();
    showFloatingBar(false);
    const rpc = await getCurrentRpc();
    console.log('HiveApp:', {currRPC: rpc}); //TODO remove line
    setInitialRpc(rpc);
    await initActiveRpc(rpc);
  };

  const initActiveRpc = async (rpc: Rpc) => {
    const rpcStatusOk = await checkRpcStatus(rpc.uri);
    console.log({rpcStatusOk}); //TODO remove line
    setDisplayChangeRpcPopup(!rpcStatusOk);
    if (rpcStatusOk) {
      setActiveRpc(rpc);
      setRpc(rpc);
    } else {
      useWorkingRPC(rpc);
      setRpc(rpc);
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

  //TODO remove bellow block
  // useEffect(() => {
  //   HiveEngineConfigUtils.setActiveApi(hiveEngineRpc ?? DEFAULT_HE_RPC_NODE);
  //   HiveEngineConfigUtils.setActiveAccountHistoryApi(
  //     accountHistoryAPIRpc ?? DEFAULT_ACCOUNT_HISTORY_RPC_NODE,
  //   );
  //   setRpc(rpc);
  //   // if (getRPCUri(rpc) !== 'DEFAULT') {
  //   //   checkCurrentRPC(getRPCUri(rpc));
  //   // }
  // }, [rpc]);
  //end block

  //TODO important here:
  //  - implement activeRpc.
  //  - remove default from src/utils/hive.ts
  //  - apply in all the app the use of activeRpc instead of settings.rpc
  //  - check & update rpc nodes settings using activeRpc.
  const checkCurrentRPC = async (currentRPCUri: string) => {
    try {
      const rpcStatusOK = await checkRpcStatus(currentRPCUri);
      if (!rpcStatusOK) {
        setSwitchToRpc({uri: DEFAULT_RPC, testnet: false});
      }
      setDisplayChangeRpcPopup(!rpcStatusOK);
      // showFloatingBar(rpcStatusOK); //TODO uncomment & implement when adding again the rpcSwitcher.
    } catch (error) {
      console.log('Error checking rpcStatusOK', {error});
    }
  };

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
      <RpcSwitcherComponent initialRpc={initialRpc} />
      <Bridge />
    </NavigationContainer>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    hasAccounts: state.lastAccount.has,
    auth: state.auth,
    //TODO cleanup
    // rpc: state.settings.rpc,
    activeRpc: state.activeRpc,
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
  setActiveRpc,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(App);
