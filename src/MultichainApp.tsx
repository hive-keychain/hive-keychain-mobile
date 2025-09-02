import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {Provider} from 'react-redux';
import {store} from 'store';
import EVMApp from './EVMApp';
import HiveApp from './HiveApp';
import {Chain, ChainContext} from './context/multichain.context';
import {OrientationProvider} from './context/orientation.context';
import {TabProvider} from './context/tab.context';
import {Theme, ThemeContext} from './context/theme.context';
import {KeychainStorageKeyEnum} from './reference-data/keychainStorageKeyEnum';

export default () => {
  const [chain, setChain] = useState<Chain>();
  const [theme, setTheme] = useState<Theme>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const [activeTheme, activeChain]: any[] = await Promise.all([
      AsyncStorage.getItem(KeychainStorageKeyEnum.ACTIVE_THEME),
      AsyncStorage.getItem(KeychainStorageKeyEnum.ACTIVE_CHAIN),
    ]);

    setTheme(activeTheme ?? Theme.DARK);
    setChain(activeChain ?? Chain.HIVE);
    setReady(true);
  };

  useEffect(() => {
    if (chain) AsyncStorage.setItem(KeychainStorageKeyEnum.ACTIVE_CHAIN, chain);
  }, [chain]);

  useEffect(() => {
    if (theme) AsyncStorage.setItem(KeychainStorageKeyEnum.ACTIVE_THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((oldTheme) => {
      return oldTheme === Theme.DARK ? Theme.LIGHT : Theme.DARK;
    });
  };

  const renderChain = (selectedChain: Chain) => {
    switch (selectedChain) {
      case Chain.HIVE:
        return (
          <Provider store={store}>
            <HiveApp />
          </Provider>
        );
      case Chain.EVM:
        return <EVMApp />;
    }
  };

  if (ready && chain && theme)
    return (
      <ThemeContext.Provider value={{theme, setTheme, toggleTheme}}>
        <ChainContext.Provider value={{chain, setChain}}>
          <OrientationProvider>
            <TabProvider>{renderChain(chain)}</TabProvider>
          </OrientationProvider>
        </ChainContext.Provider>
      </ThemeContext.Provider>
    );
  else return null;
};
