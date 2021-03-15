import React, {useEffect} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import Tab from './Tab';
import {BrowserConfig} from 'utils/config';
import {useIsFocused} from '@react-navigation/native';

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
  route,
  navigation,
}) => {
  // Add tab if browser is opened with no existing tab
  useEffect(() => {
    if (!activeTab) {
      addTab(BrowserConfig.HOMEPAGE_URL);
    }
  }, [activeTab, addTab]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      StatusBar.setHidden(true);
    });

    return unsubscribe;
  }, [navigation]);

  if (!activeTab) {
    return <View style={styles.container} />;
  } else {
    return (
      <View style={styles.container}>
        {tabs.map((tab) => (
          <Tab
            data={tab}
            active={tab.id === activeTab}
            key={tab.id}
            updateTab={updateTab}
            route={route}
          />
        ))}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {width: '100%', height: '100%'},
});

export default Browser;
