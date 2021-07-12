import analytics from '@react-native-firebase/analytics';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {addTabFromLinking} from 'actions/browser';
import Bridge from 'components/bridge';
import MainDrawer from 'navigators/MainDrawer';
import SignUpStack from 'navigators/SignUp';
import UnlockStack from 'navigators/Unlock';
import React, {useEffect, useRef} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import Modal from 'screens/Modal';
import {RootState} from 'store';
import {setRpc} from 'utils/hive';
import setupLinking, {clearLinkingListeners} from 'utils/linking';
import {modalOptions, noHeader, setNavigator} from 'utils/navigation';
import {RootStackParam} from './navigators/Root.types';

const Root = createStackNavigator<RootStackParam>();

const App = ({hasAccounts, auth, rpc, addTabFromLinking}: PropsFromRedux) => {
  let routeNameRef: React.MutableRefObject<string> = useRef();
  let navigationRef: React.MutableRefObject<NavigationContainerRef> = useRef();
  useEffect(() => {
    setupLinking(addTabFromLinking);
    return () => {
      clearLinkingListeners();
    };
  }, [addTabFromLinking]);

  useEffect(() => {
    setRpc(rpc);
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
      onStateChange={async (state) => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          // The line below uses the expo-firebase-analytics tracker
          // https://docs.expo.io/versions/latest/sdk/firebase-analytics/
          // Change this line to use another Mobile analytics SDK
          console.log('routename', currentRouteName);
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }

        // Save the current route name for later comparison
        routeNameRef.current = currentRouteName;
      }}>
      {renderRootNavigator()}
      <Bridge />
    </NavigationContainer>
  );
};

const mapStateToProps = (state: RootState) => {
  console.log(state);
  return {
    hasAccounts: state.lastAccount.has,
    auth: state.auth,
    rpc: state.settings.rpc,
  };
};

const connector = connect(mapStateToProps, {addTabFromLinking});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(App);
