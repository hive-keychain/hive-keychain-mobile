import {showFloatingBar} from 'actions/floatingBar';
import {
  addTab,
  addToFavorites,
  addToHistory,
  changeTab,
  clearHistory,
  closeAllTabs,
  closeTab,
  removeFromFavorites,
  setBrowserFocus,
  showManagementScreen,
  updateTab,
} from 'actions/index';
import Browser from 'components/browser';
import ProposalReminder from 'components/popups/proposal-reminder';
import {BrowserNavigationProps} from 'navigators/MainDrawer.types';
import React from 'react';
import Orientation from 'react-native-orientation-locker';
import {ConnectedProps, connect} from 'react-redux';
import {useThemeContext} from 'src/context/theme.context';
import {RootState} from 'store';

const BrowserScreen = ({
  accounts,
  browser,
  changeTab,
  addTab,
  updateTab,
  closeTab,
  closeAllTabs,
  addToHistory,
  clearHistory,
  addToFavorites,
  removeFromFavorites,
  setBrowserFocus,
  showFloatingBar,
  navigation,
  route,
  showManagementScreen,
  preferences,
}: BrowserPropsFromRedux & BrowserNavigationProps) => {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      Orientation.getAutoRotateState((s) => {
        if (s) {
          Orientation.unlockAllOrientations();
        }
      });
    });
    return unsubscribe;
  }, [navigation]);
  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener('blur', () => {
  //     Orientation.lockToPortrait();
  //     Orientation.removeAllListeners();
  //   });
  //   return unsubscribe;
  // }, [navigation]);

  const {theme} = useThemeContext();

  return (
    <>
      <Browser
        theme={theme}
        accounts={accounts}
        navigation={navigation}
        route={route}
        browser={browser}
        changeTab={changeTab}
        addTab={addTab}
        updateTab={updateTab}
        closeTab={closeTab}
        closeAllTabs={closeAllTabs}
        addToHistory={addToHistory}
        clearHistory={clearHistory}
        addToFavorites={addToFavorites}
        removeFromFavorites={removeFromFavorites}
        setBrowserFocus={setBrowserFocus}
        showManagementScreen={showManagementScreen}
        preferences={preferences}
        showFloatingBar={showFloatingBar}
      />
      <ProposalReminder navigation={navigation} />
    </>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    accounts: state.accounts,
    browser: state.browser,
    preferences: state.preferences,
  };
};

const connector = connect(mapStateToProps, {
  changeTab,
  addTab,
  updateTab,
  closeTab,
  closeAllTabs,
  addToHistory,
  clearHistory,
  addToFavorites,
  removeFromFavorites,
  setBrowserFocus,
  showManagementScreen,
  showFloatingBar,
});

export type BrowserPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(BrowserScreen);
