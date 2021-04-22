import React, {useEffect, useState} from 'react';
import {View, StyleSheet, StatusBar, Dimensions, Platform} from 'react-native';
import Tab from './Tab';
import TabsManagement from './tabsManagement';
import {BrowserConfig} from 'utils/config';
import {captureRef} from 'react-native-view-shot';

const Browser = ({
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
  route,
  navigation,
}) => {
  // Add tab if browser is opened with no existing tab
  const [isManagingTab, setIsManagingTab] = useState(false);
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

  const manageTabs = ({url, icon, id}, view) => {
    captureRef(view, {
      format: 'jpg',
      quality: 0.2,
    }).then(
      (uri) => {
        console.log(uri);
        updateTab(id, {
          url,
          icon,
          image: uri,
        });
        setIsManagingTab(true);
      },
      (error) => {
        console.error(error);
      },
    );
  };

  if (!activeTab) {
    return <View style={styles.container} />;
  } else {
    if (isManagingTab) {
      return <TabsManagement tabs={tabs} />;
    } else {
      return (
        <View style={styles.container}>
          {tabs.map((tab) => (
            <Tab
              accounts={accounts}
              data={tab}
              active={tab.id === activeTab}
              key={tab.id}
              updateTab={updateTab}
              route={route}
              navigation={navigation}
              addToHistory={addToHistory}
              history={history}
              clearHistory={clearHistory}
              manageTabs={manageTabs}
            />
          ))}
        </View>
      );
    }
  }
};

const styles = StyleSheet.create({
  container: {width: '100%', height: '100%'},
});

export default Browser;
