import {Page} from 'actions/interfaces';
import KeychainLogo from 'components/ui/KeychainLogo';
import ScreenToggle from 'components/ui/ScreenToggle';
import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {translate} from 'utils/localize';
import Explore from './Explore';
import Favorites from './Favorites';
import History from './History';

type Props = {
  history: Page[];
  favorites: Page[];
  updateTabUrl: (link: string) => void;
};
const NewTab = ({history, favorites, updateTabUrl}: Props) => {
  const styles = getStyles(useWindowDimensions().width);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <KeychainLogo width={45} />
        <Text style={styles.title}>
          KEYCHAIN <Text style={styles.home}>HOME</Text>
        </Text>
      </View>
      <ScreenToggle
        menu={[
          translate('browser.home.menu.explore'),
          translate('browser.home.menu.history'),
          translate('browser.home.menu.favorites'),
        ]}
        components={[
          <Explore updateTabUrl={updateTabUrl} />,
          <History history={history} updateTabUrl={updateTabUrl} />,
          <Favorites favorites={favorites} updateTabUrl={updateTabUrl} />,
        ]}
        toUpperCase
        style={styles.sub}
      />
    </View>
  );
};

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {flex: 1},
    titleContainer: {
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'center',
      marginVertical: '3%',
      height: 45,
    },
    title: {
      marginLeft: '5%',
      color: '#E31337',
      textTransform: 'uppercase',
      fontSize: 26,
      lineHeight: 45,
      fontWeight: 'bold',
    },
    home: {color: 'black'},
    sub: {height: 40},
  });

export default NewTab;
