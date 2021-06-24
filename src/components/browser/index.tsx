import {Tab} from 'actions/interfaces';
import {BrowserNavigationProps} from 'navigators/MainDrawer.types';
import React, {MutableRefObject, useEffect} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {captureRef} from 'react-native-view-shot';
import WebView from 'react-native-webview';
import {BrowserPropsFromRedux} from 'screens/Browser';
import {BrowserConfig} from 'utils/config';
import TabsManagement from './tabsManagement';

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
  setBrowserFocus,
  showManagementScreen,
  showManagement,
}: BrowserPropsFromRedux & BrowserNavigationProps) => {
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      StatusBar.setHidden(true);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setBrowserFocus(false);
  }, [setBrowserFocus]);

  const manageTabs = (
    {url, icon, id}: Tab,
    view: MutableRefObject<WebView>,
  ) => {
    captureRef(view, {
      format: 'jpg',
      quality: 0.2,
    }).then(
      (uri) => {
        console.log(uri);
        updateTab(id, {id, url, icon, image: uri});
        showManagementScreen(true);
      },
      (error) => {
        console.error(error);
      },
    );
  };

  const onSelectTab = (id: number) => {
    changeTab(id);
    showManagementScreen(false);
  };
  const onCloseTab = (id: number) => {
    if (id === activeTab) {
      const remainingTabs = tabs.filter((t) => t.id !== id);
      if (remainingTabs.length) {
        changeTab(remainingTabs[0].id);
      } else {
        changeTab(0);
      }
    }
    closeTab(id);
  };

  const onCloseAllTabs = () => {
    changeTab(0);
    closeAllTabs();
  };

  const onAddTab = () => {
    addTab(BrowserConfig.HOMEPAGE_URL);
    showManagementScreen(false);
  };

  const onQuitManagement = () => {
    showManagementScreen(false);
  };

  return (
    <View style={styles.container}>
      <TabsManagement
        tabs={tabs}
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onCloseTab={onCloseTab}
        onCloseAllTabs={onCloseAllTabs}
        onAddTab={onAddTab}
        onQuitManagement={onQuitManagement}
        show={showManagement || !activeTab}
      />
      {tabs.map((tab) => (
        <Tab
          accounts={accounts}
          data={tab}
          active={tab.id === activeTab}
          key={tab.id}
          updateTab={updateTab}
          navigation={navigation}
          addToHistory={addToHistory}
          history={history}
          clearHistory={clearHistory}
          manageTabs={manageTabs}
          isManagingTab={showManagement}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {width: '100%', height: '100%'},
});

export default Browser;
