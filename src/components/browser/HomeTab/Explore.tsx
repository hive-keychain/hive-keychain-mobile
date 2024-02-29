import {Account} from 'actions/interfaces';
import Loader from 'components/ui/Loader';
import React, {useEffect, useState} from 'react';
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useChainContext} from 'src/context/multichain.context';
import {Theme} from 'src/context/theme.context';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {
  body_primary_body_1,
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';
import {EcosystemUtils} from 'utils/ecosystem.utils';
import {translate} from 'utils/localize';
import DAppCard from './components/DAppCard';

export interface DApp {
  name: string;
  description: string;
  icon: string;
  url: string;
  appendUsername?: boolean;
  categories: string[];
}

export interface DAppCategory {
  category: string;
  dapps: DApp[];
}

export interface EcosystemCategoryProps {
  category: DAppCategory;
}

type Props = {
  updateTabUrl: (link: string) => void;
  accounts: Account[];
  theme: Theme;
};

export default ({updateTabUrl, accounts, theme}: Props) => {
  const {chain} = useChainContext();
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingDapps, setLoadingDapps] = useState(true);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const tcategories: DAppCategory[] = (
      await EcosystemUtils.getDappList(chain)
    ).data;
    const tempTabs: any = [];
    for (const tcategory of tcategories) {
      if (!(Platform.OS === 'ios' && tcategory.category === 'gaming'))
        tempTabs.push({
          id: tcategory.category,
          title: `browser.home.categories.${tcategory.category}`,
          dapps: tcategory.dapps,
        });
    }
    setCategories(tempTabs);
    setLoadingDapps(false);
  };

  const styles = getStyles(useWindowDimensions(), theme);

  return !loadingDapps ? (
    <ScrollView style={[styles.container]}>
      {categories.map((cat: any) => (
        <View key={cat.id}>
          <Text style={styles.categoryTitle}>{translate(cat.title)}</Text>
          <ScrollView horizontal style={styles.scroll}>
            <View style={styles.cards}>
              {cat.dapps
                .filter((e: DApp) => {
                  if (Platform.OS === 'ios') {
                    return (
                      e.categories.includes(cat.id) &&
                      !e.categories.includes('gaming')
                    );
                  } else {
                    return e.categories.includes(cat.id);
                  }
                })
                .map((e: DApp) => (
                  <DAppCard
                    key={e.name}
                    dApp={e}
                    updateTabUrl={updateTabUrl}
                    theme={theme}
                  />
                ))}
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
            style={[styles.textBase, styles.text, styles.redColor]}
            onPress={() => {
              Linking.openURL('https://discord.gg/tUHtyev2xF');
            }}>
            Discord
          </Text>
          !
        </Text>
      </View>
    </ScrollView>
  ) : (
    <View style={[{flex: 1, justifyContent: 'center', alignItems: 'center'}]}>
      <Loader animating size={'small'} />
    </View>
  );
};

const getStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'column',
      flex: 1,
      marginTop: 10,
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
    text: {fontSize: getFontSizeSmallDevices(width, 13)},
    scroll: {marginLeft: 0.03 * width, marginBottom: 20},
    textBase: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_1,
    },
    categoryTitle: {
      ...headlines_primary_headline_2,
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(
        width,
        {...headlines_primary_headline_2}.fontSize,
      ),
    },
    cards: {
      marginTop: 30,
      flexDirection: 'row',
    },
    redColor: {
      color: PRIMARY_RED_COLOR,
    },
  });
