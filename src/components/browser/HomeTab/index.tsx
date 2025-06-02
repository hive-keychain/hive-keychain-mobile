import {Account, Page} from 'actions/interfaces';
import ScreenToggle from 'components/ui/ScreenToggle';
import React, {MutableRefObject} from 'react';
import {StyleSheet, View} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {translate} from 'utils/localize';
import Explore from './Explore';
import Favorites from './Favorites';
import History from './History';

type Props = {
  history: Page[];
  favorites: Page[];
  updateTabUrl: (link: string) => void;
  clearHistory: () => void;
  homeRef: MutableRefObject<View>;
  accounts: Account[];
  theme: Theme;
};
const NewTab = ({
  history,
  favorites,
  updateTabUrl,
  clearHistory,
  homeRef,
  accounts,
  theme,
}: Props) => {
  const insets = useSafeAreaInsets();
  const styles = getStyles(insets);
  return (
    <View style={[styles.container]} ref={homeRef} collapsable={false}>
      <ScreenToggle
        theme={theme}
        menu={[
          translate('browser.home.menu.ecosystem'),
          translate('browser.home.menu.recent'),
          translate('browser.home.menu.favorite'),
        ]}
        components={[
          <Explore
            updateTabUrl={updateTabUrl}
            accounts={accounts}
            theme={theme}
          />,
          <History
            history={history}
            clearHistory={clearHistory}
            updateTabUrl={updateTabUrl}
            theme={theme}
          />,
          <Favorites
            favorites={favorites}
            updateTabUrl={updateTabUrl}
            theme={theme}
          />,
        ]}
        toUpperCase={false}
        style={styles.sub}
        additionalHeaderStyle={[
          getCardStyle(theme).defaultCardItem,
          styles.headerToogler,
        ]}
      />
    </View>
  );
};

const getStyles = (insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      height: '100%',
    },
    sub: {height: 40},
    headerToogler: {
      paddingHorizontal: 2,
      height: 'auto',
      marginBottom: 0,
      paddingVertical: 4,
      width: '90%',
      alignSelf: 'center',
      marginTop: 0,
    },
  });

export default NewTab;
