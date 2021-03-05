import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
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
      addTab(BrowserConfig.HOMEPAGE_URL);
    }
  }, [activeTab, addTab]);

  if (!activeTab) {
    return <View style={styles.container} />;
  } else {
    return (
      <View style={styles.container}>
        {tabs.map((tab) => (
          <Tab data={tab} active={tab.id === activeTab} key={tab.id} />
        ))}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {width: '100%', height: '100%'},
});

export default Browser;
