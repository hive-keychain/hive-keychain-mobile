import {
  addTab,
  addToFavorites,
  addToHistory,
  changeTab,
  clearHistory,
  closeAllTabs,
  closeTab,
  removeFromFavorites,
  setBrowserFocus,
  showManagementScreen,
  updateTab,
} from 'actions/index';
import Browser from 'components/browser';
import {BrowserNavigationProps} from 'navigators/MainDrawer.types';
import React from 'react';
import Orientation from 'react-native-orientation-locker';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';

const BrowserScreen = ({
  accounts,
  browser,
  changeTab,
  addTab,
  updateTab,
  closeTab,
  closeAllTabs,
  addToHistory,
  clearHistory,
  addToFavorites,
  removeFromFavorites,
  setBrowserFocus,
  navigation,
  route,
  showManagementScreen,
  preferences,
}: BrowserPropsFromRedux & BrowserNavigationProps) => {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      Orientation.getAutoRotateState((s) => {
        if (s) {
          Orientation.unlockAllOrientations();
        }
      });
    });
    return unsubscribe;
  }, [navigation]);
  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener('blur', () => {
  //     Orientation.lockToPortrait();
  //     Orientation.removeAllListeners();
  //   });
  //   return unsubscribe;
  // }, [navigation]);

  //TODO remove this testing block
  console.log('Hey from Browser Screen', {browser}); //TODO to remove
  console.log('active tab', browser.activeTab); //TODO to remove //seems to be the same as 1679565075222
  if (browser.activeTab === 1679671188511) {
    closeAllTabs();
  }
  //END testing block

  return (
    <Browser
      accounts={accounts}
      navigation={navigation}
      route={route}
      browser={browser}
      changeTab={changeTab}
      addTab={addTab}
      updateTab={updateTab}
      closeTab={closeTab}
      closeAllTabs={closeAllTabs}
      addToHistory={addToHistory}
      clearHistory={clearHistory}
      addToFavorites={addToFavorites}
      removeFromFavorites={removeFromFavorites}
      setBrowserFocus={setBrowserFocus}
      showManagementScreen={showManagementScreen}
      preferences={preferences}
    />
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    accounts: state.accounts,
    browser: state.browser,
    preferences: state.preferences,
  };
};

const connector = connect(mapStateToProps, {
  changeTab,
  addTab,
  updateTab,
  closeTab,
  closeAllTabs,
  addToHistory,
  clearHistory,
  addToFavorites,
  removeFromFavorites,
  setBrowserFocus,
  showManagementScreen,
});

export type BrowserPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(BrowserScreen);
