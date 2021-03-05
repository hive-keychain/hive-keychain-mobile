import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Tab from './Tab';
import {BrowserConfig} from 'utils/config';
import Footer from './Footer';

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

  const renderContent = () => {
    if (!activeTab) {
      return <View style={styles.sub} />;
    } else {
      return (
        <View style={styles.sub}>
          {tabs.map((tab) => (
            <Tab data={tab} active={tab.id === activeTab} key={tab.id} />
          ))}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {renderContent()}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {width: '100%', height: '100%'},
  sub: {flex: 1},
});

export default Browser;
