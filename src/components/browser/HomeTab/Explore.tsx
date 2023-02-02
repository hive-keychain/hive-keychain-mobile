import {Account} from 'actions/interfaces';
import Back from 'assets/browser/icon_arrow_back.svg';
import React, {useState} from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {BrowserConfig} from 'utils/config';
import {translate} from 'utils/localize';
import CategoryButton, {
  Category as CategoryType,
} from './components/CategoryButton';
import DAppCard from './components/DAppCard';

type Props = {
  updateTabUrl: (link: string) => void;
  accounts: Account[];
};

export default ({updateTabUrl, accounts}: Props) => {
  let {categories} = BrowserConfig.HomeTab;
  if (Platform.OS === 'ios') {
    categories = categories.filter((e) => e.title !== 'gaming');
  }
  const styles = getStyles(useWindowDimensions().width);
  const [category, setCategory] = useState<string>(null);
  if (!category) {
    return (
      <ScrollView style={styles.container}>
        {categories.map((cat: CategoryType) => (
          <CategoryButton
            category={cat}
            key={cat.title}
            setCategory={setCategory}
          />
        ))}
        <View style={styles.footer}>
          <Text style={styles.text}>
            Can't see your favorite Hive dApp in here?
          </Text>
          <Text style={styles.text}>
            Contact us on{' '}
            <Text
              style={{fontWeight: 'bold'}}
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
  } else {
    return (
      <ScrollView style={styles.scroll}>
        <View style={styles.title}>
          <TouchableOpacity
            style={styles.back}
            onPress={() => {
              setCategory(null);
            }}>
            <Back />
          </TouchableOpacity>
          <Text style={styles.categoryTitle}>
            {translate(`browser.home.categories.${category}`).toUpperCase()}
          </Text>
        </View>
        <View style={styles.cards}>
          {BrowserConfig.HomeTab.dApps
            .filter((e) => {
              if (Platform.OS === 'ios') {
                return (
                  e.categories.includes(category) &&
                  !e.categories.includes('gaming')
                );
              } else {
                return e.categories.includes(category);
              }
            })
            .map((e) => (
              <DAppCard key={e.name} dApp={e} updateTabUrl={updateTabUrl} />
            ))}
          {BrowserConfig.HomeTab.dApps.filter((e) =>
            e.categories.includes(category),
          ).length %
            3 ===
          2 ? (
            <View style={{width: '30%'}}></View>
          ) : null}
        </View>
      </ScrollView>
    );
  }
};

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      backgroundColor: '#E5EEF7',
      flex: 1,
      marginTop: 50,
    },
    footer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {fontSize: 16},
    scroll: {marginHorizontal: 0.03 * width, marginTop: 20},
    title: {flexDirection: 'row', alignItems: 'center'},
    back: {
      width: 47,
      height: 47,
      backgroundColor: '#393939',
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 30,
    },
    categoryTitle: {
      fontSize: 20,
      color: 'black',
    },
    cards: {
      marginTop: 30,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
  });
