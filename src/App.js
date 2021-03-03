import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {connect} from 'react-redux';

import Modal from 'screens/Modal';
import {setNavigator, noHeader, modalOptions} from 'utils/navigation';
import {setRpc} from 'utils/hive';
import Bridge from 'components/bridge';

const Root = createStackNavigator();

import SignUpStack from 'navigators/SignUp';
import UnlockStack from 'navigators/Unlock';
import MainDrawer from 'navigators/MainDrawer';

const App = ({hasAccounts, auth, rpc}) => {
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
      <Bridge />
    </NavigationContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    hasAccounts: state.lastAccount.has,
    auth: state.auth,
    rpc: state.settings.rpc,
  };
};

export default connect(mapStateToProps, null)(App);
