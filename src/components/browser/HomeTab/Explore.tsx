import {Account} from 'actions/interfaces';
import React from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Theme} from 'src/context/theme.context';
import {getColors, PRIMARY_RED_COLOR} from 'src/styles/colors';
import {
  body_primary_body_1,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {BrowserConfig} from 'utils/config';
import {translate} from 'utils/localize';
import {Category as CategoryType} from './components/CategoryButton';
import DAppCard from './components/DAppCard';

type Props = {
  updateTabUrl: (link: string) => void;
  accounts: Account[];
  theme: Theme;
};

export default ({updateTabUrl, accounts, theme}: Props) => {
  let {categories} = BrowserConfig.HomeTab;
  if (Platform.OS === 'ios') {
    categories = categories.filter((e) => e.title !== 'gaming');
  }
  const styles = getStyles(useWindowDimensions().width, theme);

  return (
    <ScrollView style={styles.container}>
      {categories.map((cat: CategoryType) => (
        <View key={cat.title}>
          <Text style={styles.categoryTitle}>
            {translate(`browser.home.categories.${cat.title}`)}
          </Text>
          <ScrollView horizontal style={styles.scroll}>
            <View style={styles.cards}>
              {BrowserConfig.HomeTab.dApps
                .filter((e) => {
                  if (Platform.OS === 'ios') {
                    return (
                      e.categories.includes(cat.title) &&
                      !e.categories.includes('gaming')
                    );
                  } else {
                    return e.categories.includes(cat.title);
                  }
                })
                .map((e) => (
                  <DAppCard
                    key={e.name}
                    dApp={e}
                    updateTabUrl={updateTabUrl}
                    theme={theme}
                  />
                ))}
              {BrowserConfig.HomeTab.dApps.filter((e) =>
                e.categories.includes(cat.title),
              ).length %
                3 ===
              2 ? (
                <View style={{width: '30%'}}></View>
              ) : null}
            </View>
          </ScrollView>
        </View>
      ))}
      <View style={styles.footer}>
        <Text style={[styles.textBase, styles.text]}>
          {translate('browser.home.cant_see_dapps.part_1')}
        </Text>
        <Text style={[styles.textBase, styles.text]}>
          {translate('browser.home.cant_see_dapps.part_2')}
          <Text
            style={styles.redColor}
            onPress={() => {
              Linking.openURL('https://discord.gg/tUHtyev2xF');
            }}>
            Discord
          </Text>
          !
        </Text>
      </View>
    </ScrollView>
  );
};

const getStyles = (width: number, theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      flex: 1,
      marginTop: 25,
      paddingTop: 25,
      borderTopLeftRadius: 40,
      paddingLeft: 30,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
    },
    footer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 30,
    },
    text: {fontSize: 13},
    scroll: {marginLeft: 0.03 * width, marginBottom: 20},
    textBase: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_1,
    },
    categoryTitle: {
      ...headlines_primary_headline_2,
      color: getColors(theme).secondaryText,
    },
    cards: {
      marginTop: 30,
      flexDirection: 'row',
    },
    redColor: {
      color: PRIMARY_RED_COLOR,
    },
  });
