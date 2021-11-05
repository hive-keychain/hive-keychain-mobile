import {Tab as TabType} from 'actions/interfaces';
import {BrowserNavigationProps} from 'navigators/MainDrawer.types';
import React, {MutableRefObject, useEffect, useState} from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import Orientation, {OrientationType} from 'react-native-orientation-locker';
import {captureRef} from 'react-native-view-shot';
import WebView from 'react-native-webview';
import {BrowserPropsFromRedux} from 'screens/Browser';
import {BrowserConfig} from 'utils/config';
import Header from './Header';
import Tab from './Tab';
import TabsManagement from './tabsManagement';
import UrlModal from './urlModal';

const Browser = ({
  accounts,
  browser,
  preferences,
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
}: BrowserPropsFromRedux & BrowserNavigationProps) => {
  const {showManagement, activeTab, tabs, history, favorites} = browser;
  const currentActiveTabData = tabs.find((t) => t.id === activeTab);
  const url = currentActiveTabData
    ? currentActiveTabData.url
    : BrowserConfig.HOMEPAGE_URL;

  const [isVisible, toggleVisibility] = useState(false);
  const [searchUrl, setSearchUrl] = useState(url);
  const [orientation, setOrientation] = useState('PORTRAIT');

  useEffect(() => {
    setSearchUrl(url);
  }, [url]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      StatusBar.setHidden(true);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setBrowserFocus(false);
  }, [setBrowserFocus]);
  useEffect(() => {
    if (!tabs.length) {
      addTab('about:blank');
    }
  }, [tabs]);

  React.useEffect(() => {
    Orientation.addDeviceOrientationListener((orientation) => {
      console.log(orientation);
      if (Platform.OS === 'android' && orientation !== 'PORTRAIT') {
        Orientation.getAutoRotateState((s) => {
          console.log('s', s);
          if (s) {
            setDeviceOrientation(orientation);
          } else console.log('cant rotate');
        });
      } else {
        setDeviceOrientation(orientation);
      }
    });
    return () => {
      Orientation.removeAllListeners();
    };
  }, []);

  const setDeviceOrientation = (orientation: OrientationType) => {
    setOrientation(orientation);
    // switch (orientation) {
    //   case 'PORTRAIT':
    //     Orientation.lockToPortrait();
    //     break;
    //   case 'LANDSCAPE-LEFT':
    //     Orientation.lockToLandscapeLeft();
    //     break;
    //   case 'LANDSCAPE-RIGHT':
    //     Orientation.lockToLandscapeRight();
    //     break;
    // }
  };

  const manageTabs = (
    {url, icon, id}: TabType,
    view: MutableRefObject<WebView> | MutableRefObject<View>,
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

  const onNewSearch = (url: string) => {
    updateTab(activeTab, {...currentActiveTabData, url});
  };

  const swipeToTab = (right: boolean) => {
    if (right) {
      const newTab = tabs[tabs.findIndex((t) => t.id === activeTab) + 1];
      if (newTab) changeTab(newTab.id);
      else changeTab(tabs[0].id);
    } else {
      const newTab = tabs[tabs.findIndex((t) => t.id === activeTab) - 1];
      if (newTab) changeTab(newTab.id);
      else changeTab(tabs[tabs.length - 1].id);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        browser={browser}
        navigation={navigation}
        route={route}
        updateTab={updateTab}
        startSearch={toggleVisibility}
        addToFavorites={addToFavorites}
        removeFromFavorites={removeFromFavorites}
        swipeToTab={swipeToTab}
        landscape={orientation.startsWith('LANDSCAPE')}
      />
      <TabsManagement
        tabs={tabs}
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onCloseTab={onCloseTab}
        onCloseAllTabs={onCloseAllTabs}
        onAddTab={onAddTab}
        onQuitManagement={onQuitManagement}
        show={showManagement}
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
          manageTabs={manageTabs}
          isManagingTab={showManagement}
          preferences={preferences}
          favorites={favorites}
          addTab={onAddTab}
          tabsNumber={browser.tabs.length}
          orientation={orientation}
        />
      ))}
      <UrlModal
        isVisible={isVisible}
        toggle={toggleVisibility}
        onNewSearch={onNewSearch}
        history={history}
        url={searchUrl}
        setUrl={setSearchUrl}
        clearHistory={clearHistory}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
});

export default Browser;
