import {Account, Page} from 'actions/interfaces';
import ScreenToggle from 'components/ui/ScreenToggle';
import React, {MutableRefObject} from 'react';
import {StyleSheet, View} from 'react-native';
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
  homeRef: MutableRefObject<View>;
  accounts: Account[];
  theme: Theme;
};
const NewTab = ({
  history,
  favorites,
  updateTabUrl,
  homeRef,
  accounts,
  theme,
}: Props) => {
  return (
    <View style={styles.container} ref={homeRef} collapsable={false}>
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
          <History history={history} updateTabUrl={updateTabUrl} />,
          <Favorites favorites={favorites} updateTabUrl={updateTabUrl} />,
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

const styles = StyleSheet.create({
  container: {flex: 1},
  sub: {height: 40},
  headerToogler: {
    paddingHorizontal: 2,
    height: 'auto',
    marginBottom: 0,
    paddingVertical: 4,
    width: '90%',
    alignSelf: 'center',
  },
});

export default NewTab;
