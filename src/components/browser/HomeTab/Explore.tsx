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
import {ConnectedProps, connect} from 'react-redux';
import {useChainContext} from 'src/context/multichain.context';
import {Theme} from 'src/context/theme.context';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {
  MARGIN_LEFT_RIGHT_MIN,
  MIN_SEPARATION_ELEMENTS,
} from 'src/styles/spacing';
import {
  body_primary_body_1,
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import DAppCard from './components/DAppCard';

export interface DApp {
  hideOniOS: boolean;
  name: string;
  description: string;
  icon: string;
  url: string;
  appendUsername?: boolean;
  categories: string[];
}

export interface dAppCategory {
  category: string;
  dapps: DApp[];
}

export interface EcosystemCategoryProps {
  category: dAppCategory;
}

type Props = {
  updateTabUrl: (link: string) => void;
  accounts: Account[];
  theme: Theme;
};

const Explore = ({
  updateTabUrl,
  accounts,
  theme,
  ecosystem,
}: Props & PropsFromRedux) => {
  const {chain} = useChainContext();
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingDapps, setLoadingDapps] = useState(true);

  useEffect(() => {
    init();
  }, [ecosystem]);

  const init = async () => {
    const tempTabs: any = [];
    for (const tmpCategory of ecosystem) {
      if (
        !(
          Platform.OS === 'ios' &&
          (tmpCategory.category === 'gaming' ||
            !tmpCategory.dapps.filter(
              (e) => !e.hideOniOS && !e.categories.includes('gaming'),
            ).length)
        )
      )
        tempTabs.push({
          id: tmpCategory.category,
          title: `browser.home.categories.${tmpCategory.category}`,
          dapps: tmpCategory.dapps,
        });
    }
    setCategories(tempTabs);
    setLoadingDapps(false);
  };

  const styles = getStyles(useWindowDimensions(), theme);

  return !loadingDapps ? (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollviewContentContainer}>
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
                        !e.categories.includes('gaming') &&
                        !e.hideOniOS
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
    </View>
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
      borderTopLeftRadius: 40,
      marginTop: 10,
      borderTopRightRadius: 40,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      overflow: 'hidden',
    },
    scrollviewContentContainer: {
      paddingLeft: MARGIN_LEFT_RIGHT_MIN,
      marginTop: 25,
      overflow: 'hidden',
    },
    footer: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 30,
    },
    text: {fontSize: getFontSizeSmallDevices(width, 13)},
    scroll: {
      marginBottom: 20,
    },
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
      paddingLeft: MIN_SEPARATION_ELEMENTS,
    },
    cards: {
      marginTop: 30,
      flexDirection: 'row',
    },
    redColor: {
      color: PRIMARY_RED_COLOR,
    },
  });

const connector = connect((state: RootState) => {
  return {
    ecosystem: state.ecosystem,
  };
});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Explore);
