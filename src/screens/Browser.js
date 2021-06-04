import React from 'react';
import Browser from 'components/browser';
import {connect} from 'react-redux';
import {
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
} from 'actions';

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
}) => {
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
    />
  );
};

const mapStateToProps = (state) => {
  return {
    accounts: state.accounts,
    activeTab: state.browser.activeTab,
    tabs: state.browser.tabs,
    history: state.browser.history,
    favorites: state.browser.favorites,
  };
};

export default connect(mapStateToProps, {
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
})(BrowserScreen);
