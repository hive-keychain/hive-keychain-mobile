import {Tab as TabType} from 'actions/interfaces';
import {BrowserNavigationProps} from 'navigators/MainDrawer.types';
import React, {MutableRefObject, useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {captureRef} from 'react-native-view-shot';
import WebView from 'react-native-webview';
import {BrowserPropsFromRedux} from 'screens/Browser';
import {Theme} from 'src/context/theme.context';
import {BrowserConfig} from 'utils/config';
import Header from './Header';
import Tab from './Tab';
import TabsManagement from './tabsManagement';
import UrlModal from './urlModal';

interface Props {
  theme: Theme;
}

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
  showFloatingBar,
  theme,
}: Partial<BrowserPropsFromRedux> & BrowserNavigationProps & Props) => {
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
    setBrowserFocus(false);
  }, [setBrowserFocus]);
  useEffect(() => {
    if (!tabs.length) {
      addTab('about:blank');
    }
  }, [tabs]);

  React.useEffect(() => {
    Orientation.addDeviceOrientationListener((orientation) => {
      if (['UNKNOWN', 'FACE-UP', 'FACE-DOWN'].includes(orientation)) return;
      if (Platform.OS === 'android' && orientation !== 'PORTRAIT') {
        Orientation.getAutoRotateState((s) => {
          if (s) {
            setOrientation(orientation);
          }
        });
      } else {
        setOrientation(orientation);
      }
    });

    return () => {
      Orientation.removeAllListeners();
    };
  }, []);

  const manageTabs = (
    {url, icon, id}: TabType,
    view: MutableRefObject<WebView> | MutableRefObject<View>,
  ) => {
    captureRef(view, {
      format: 'jpg',
      quality: 0.2,
    }).then(
      (uri) => {
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

  const onAddTab = (
    isManagingTab: boolean,
    tab: TabType,
    view: MutableRefObject<View>,
    newUrl = BrowserConfig.HOMEPAGE_URL,
  ) => {
    if (!isManagingTab) {
      const {id, url, icon} = tab;
      captureRef(view, {
        format: 'jpg',
        quality: 0.2,
      }).then(
        (uri) => {
          updateTab(id, {id, url, icon, image: uri});
          addTab(newUrl);
        },
        (error) => {
          console.error(error);
        },
      );
    } else {
      addTab(newUrl);
      showManagementScreen(false);
    }
  };

  const onQuitManagement = () => {
    showManagementScreen(false);
  };

  const onNewSearch = (url: string) => {
    updateTab(activeTab, {...currentActiveTabData, url}, true);
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
      <KeyboardAvoidingView
        style={[styles.container]}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <Header
          browser={browser}
          //@ts-ignore
          navigation={navigation}
          route={route}
          updateTab={updateTab}
          startSearch={toggleVisibility}
          addToFavorites={addToFavorites}
          removeFromFavorites={removeFromFavorites}
          swipeToTab={swipeToTab}
          landscape={orientation.startsWith('LANDSCAPE')}
          theme={theme}
          activeTabs={browser.tabs.length}
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
          theme={theme}
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
            isUrlModalOpen={isVisible}
            theme={theme}
          />
        ))}
        <UrlModal
          isVisible={isVisible}
          toggle={toggleVisibility}
          onNewSearch={onNewSearch}
          history={history}
          url={searchUrl === 'about:blank' ? '' : searchUrl}
          setUrl={setSearchUrl}
          clearHistory={clearHistory}
          theme={theme}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexGrow: 1,
  },
});

export default Browser;
