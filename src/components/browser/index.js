import React from 'react';
import Tab from './Tab';

const Browser = ({
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
  if (!activeTab) {
    return null;
  } else {
    return <Tab data={tabs[activeTab]} />;
  }
};

export default Browser;
