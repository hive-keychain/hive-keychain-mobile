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
