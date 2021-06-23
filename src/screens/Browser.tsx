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
  activeTab,
  tabs,
  history,
  favorites,
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
  showManagement,
}: BrowserPropsFromRedux & BrowserNavigationProps) => {
  return (
    <Browser
      accounts={accounts}
      navigation={navigation}
      route={route}
      activeTab={activeTab}
      tabs={tabs}
      history={history}
      favorites={favorites}
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
      showManagement={showManagement}
      showManagementScreen={showManagementScreen}
    />
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    accounts: state.accounts,
    activeTab: state.browser.activeTab,
    tabs: state.browser.tabs,
    history: state.browser.history,
    favorites: state.browser.whitelist,
    showManagement: state.browser.showManagement,
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
