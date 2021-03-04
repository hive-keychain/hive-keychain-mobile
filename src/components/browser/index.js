import React, {useEffect} from 'react';
import Tab from './Tab';
import {BrowserConfig} from 'utils/config';
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
  // Add tab if browser is opened with no existing tab
  useEffect(() => {
    if (!activeTab) {
      addTab(BrowserConfig.DEFAULT_URI);
    }
  }, [activeTab, addTab]);

  if (!activeTab) {
    return null;
  } else {
    return <Tab data={tabs[activeTab]} />;
  }
};

export default Browser;
