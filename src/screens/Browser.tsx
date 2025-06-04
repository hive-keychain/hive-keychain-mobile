import {useFocusEffect} from '@react-navigation/native';
import {showFloatingBar} from 'actions/floatingBar';
import {
  addTab,
  addToFavorites,
  addToHistory,
  changeTab,
  clearHistory,
  closeTab,
  getEcosystem,
  removeFromFavorites,
  setBrowserFocus,
  showManagementScreen,
  updateFavorites,
  updateTab,
} from 'actions/index';
import Browser from 'components/browser';
import BrowserTutorial from 'components/popups/browser-tutorial/BrowserTutorial';
import ProposalReminder from 'components/popups/proposal-reminder';
import SafeArea from 'components/ui/SafeArea';
import {BrowserNavigationProps} from 'navigators/MainDrawer.types';
import React, {useCallback, useEffect} from 'react';
import {Platform} from 'react-native';
import {AvoidSoftInput} from 'react-native-avoid-softinput';
import Orientation from 'react-native-orientation-locker';
import {ConnectedProps, connect} from 'react-redux';
import {useChainContext} from 'src/context/multichain.context';
import {useThemeContext} from 'src/context/theme.context';
import {RootState} from 'store';

const BrowserScreen = ({
  accounts,
  browser,
  changeTab,
  addTab,
  updateTab,
  closeTab,
  addToHistory,
  clearHistory,
  addToFavorites,
  removeFromFavorites,
  setBrowserFocus,
  showFloatingBar,
  navigation,
  route,
  showManagementScreen,
  updateFavorites,
  getEcosystem,
  preferences,
}: BrowserPropsFromRedux & BrowserNavigationProps) => {
  const {chain} = useChainContext();
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

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        AvoidSoftInput.setAdjustResize();
        AvoidSoftInput.setEnabled(true);
      }
      return () => {
        if (Platform.OS === 'android') {
          AvoidSoftInput.setEnabled(false);
          AvoidSoftInput.setAdjustPan();
        }
      };
    }, []),
  );

  useEffect(() => {
    getEcosystem(chain);
  }, []);
  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener('blur', () => {
  //     Orientation.lockToPortrait();
  //     Orientation.removeAllListeners();
  //   });
  //   return unsubscribe;
  // }, [navigation]);

  const {theme} = useThemeContext();

  return (
    <SafeArea>
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
        addToHistory={addToHistory}
        clearHistory={clearHistory}
        addToFavorites={addToFavorites}
        removeFromFavorites={removeFromFavorites}
        setBrowserFocus={setBrowserFocus}
        showManagementScreen={showManagementScreen}
        preferences={preferences}
        updateFavorites={updateFavorites}
        showFloatingBar={showFloatingBar}
      />
      <ProposalReminder navigation={navigation} />
      <BrowserTutorial navigation={navigation} />
    </SafeArea>
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
  addToHistory,
  clearHistory,
  addToFavorites,
  removeFromFavorites,
  setBrowserFocus,
  showManagementScreen,
  showFloatingBar,
  getEcosystem,
  updateFavorites,
});

export type BrowserPropsFromRedux = ConnectedProps<typeof connector>;

export default connector(BrowserScreen);
