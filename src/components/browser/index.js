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
    console.log('activatab', activeTab);
    if (!activeTab) {
      addTab(BrowserConfig.HOMEPAGE_URL);
    }
  }, [activeTab, addTab]);
  console.log('activeetab', activeTab);

  if (!activeTab) {
    return null;
  } else {
    return <Tab data={tabs.find((e) => e.id === activeTab)} />;
  }
};

export default Browser;
