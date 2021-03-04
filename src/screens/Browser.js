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
} from 'actions';

const BrowserScreen = ({
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
}) => {
  return (
    <Browser
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
    />
  );
};

const mapStateToProps = (state) => {
  console.log(state.browser);
  return {
    activeTab: state.browser.activeTab,
    tabs: state.browser.tabs,
    history: state.history,
    favorites: state.favorites,
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
})(BrowserScreen);
