import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {
  ScaledSize,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Theme} from 'src/context/theme.context';
import {
  PRIMARY_RED_COLOR,
  RED_SHADOW_COLOR,
  getColors,
} from 'src/styles/colors';
import {generateBoxShadowStyle} from 'src/styles/shadow';
import {
  button_link_primary_medium,
  fields_primary_text_2,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {TokenHistoryFilter} from 'src/types/tokens.history.types';
import {WalletHistoryFilter} from 'src/types/wallet.history.types';
import {capitalizeSentence} from 'utils/format';
import {translate} from 'utils/localize';
import CustomSearchBar from './CustomSearchBar';
import EllipticButton from './EllipticButton';

export type FilterType = WalletHistoryFilter | TokenHistoryFilter;
interface Props {
  theme: Theme;
  headerText: string;
  defaultFilter: FilterType;
  setFilterOut: (filter: FilterType) => void;
}

const CustomFilterBox = ({
  theme,
  headerText,
  defaultFilter,
  setFilterOut,
}: Props) => {
  const [filter, setFilter] = useState<FilterType>(defaultFilter);

  const toggleFilterType = (transactionName: string) => {
    const newFilter = {...filter.selectedTransactionTypes};
    newFilter[transactionName] = !filter.selectedTransactionTypes[
      transactionName
    ];
    updateFilter({
      ...filter,
      selectedTransactionTypes: newFilter,
    });
  };

  const toggleFilterIn = () => {
    const newFilter = {
      ...filter,
      inSelected: !filter.inSelected,
    };
    updateFilter(newFilter);
  };

  const toggleFilterOut = () => {
    const newFilter = {
      ...filter,
      outSelected: !filter.outSelected,
    };
    updateFilter(newFilter);
  };

  const updateFilterValue = (value: string) => {
    const newFilter = {
      ...filter,
      filterValue: value,
    };
    updateFilter(newFilter);
  };

  const updateFilter = (filter: FilterType) => {
    setFilter(filter);
  };

  const getActiveTextStyleInOrOut = (selector: 'inSelected' | 'outSelected') =>
    filter[selector] ? styles.activeTextFilter : null;

  const getActiveContainerStyleInOrOut = (
    selector: 'inSelected' | 'outSelected',
  ) => (filter[selector] ? styles.activeFilterItem : null);

  const getActiveFilterItemContainerStyle = (selected: string) =>
    filter.selectedTransactionTypes[selected] ? styles.activeFilterItem : null;

  const getActiveFilterItemTextStyle = (selected: string) =>
    filter.selectedTransactionTypes[selected] ? styles.activeTextFilter : null;

  const styles = getStyles(theme, useWindowDimensions());

  useEffect(() => {
    setFilterOut(filter);
  }, [filter]);

  return (
    <View style={[styles.container]}>
      <Text style={styles.headerText}>{headerText}</Text>
      <View style={styles.itemContainer}>
        <CustomSearchBar
          theme={theme}
          additionalContainerStyle={styles.searchBarContainer}
          onChangeText={(text) => updateFilterValue(text)}
          value={filter.filterValue}
        />
        <View style={styles.filterItemContainer}>
          {Object.keys(filter.selectedTransactionTypes).map((filterKey) => {
            return (
              <TouchableOpacity
                style={[
                  styles.filterItem,
                  getActiveFilterItemContainerStyle(filterKey),
                ]}
                key={`${filterKey}-tokens-filter`}
                onPress={() => toggleFilterType(filterKey)}>
                <Text
                  style={[
                    styles.filterItemText,
                    getActiveFilterItemTextStyle(filterKey),
                  ]}>
                  {capitalizeSentence(filterKey.split('_').join(' '))}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <Separator drawLine additionalLineStyle={styles.line} />
      <View style={styles.inOutContainer}>
        <TouchableOpacity
          style={[
            styles.filterItem,
            getActiveContainerStyleInOrOut('inSelected'),
          ]}
          onPress={() => toggleFilterIn()}>
          <Text
            style={[
              styles.filterItemText,
              getActiveTextStyleInOrOut('inSelected'),
            ]}>
            {translate('wallet.filter.filter_in')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterItem,
            getActiveContainerStyleInOrOut('outSelected'),
          ]}
          onPress={() => toggleFilterOut()}>
          <Text
            style={[
              styles.filterItemText,
              getActiveTextStyleInOrOut('outSelected'),
            ]}>
            {translate('wallet.filter.filter_out')}
          </Text>
        </TouchableOpacity>
      </View>
      <Separator height={10} />
      <EllipticButton
        title={translate('wallet.filter.clear_filters')}
        onPress={() => setFilter(defaultFilter)}
        //TODO important need testing in IOS
        style={[
          styles.warningProceedButton,
          generateBoxShadowStyle(
            0,
            13,
            RED_SHADOW_COLOR,
            1,
            25,
            20,
            RED_SHADOW_COLOR,
          ),
        ]}
        additionalTextStyle={{...button_link_primary_medium}}
      />
    </View>
  );
};

export default CustomFilterBox;

const getStyles = (theme: Theme, {width, height}: ScaledSize) =>
  StyleSheet.create({
    container: {
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderWidth: 1,
      borderRadius: 15.1,
      flex: 1,
      justifyContent: 'space-evenly',
    },
    headerText: {
      marginVertical: 8,
      textAlign: 'center',
      ...headlines_primary_headline_2,
      color: getColors(theme).secondaryText,
    },
    searchBarContainer: {
      borderWidth: 1,
      borderRadius: 53,
      width: '100%',
      borderColor: getColors(theme).tertiaryCardBorderColor,
      marginBottom: 10,
    },
    itemContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 18,
    },
    filterItemContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    filterItem: {
      borderColor: getColors(theme).tertiaryCardBorderColor,
      borderWidth: 1,
      borderRadius: 18.8,
      marginRight: 6,
      marginBottom: 3,
      minWidth: 100,
    },
    filterItemText: {
      textAlign: 'center',
      padding: 10,
      ...fields_primary_text_2,
      lineHeight: 14.7,
    },
    line: {
      height: 1,
      borderEndWidth: 0.5,
      borderBottomColor: getColors(theme).tertiaryCardBorderColor,
      width: '88%',
      alignSelf: 'center',
    },
    inOutContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 18,
    },
    warningProceedButton: {
      backgroundColor: PRIMARY_RED_COLOR,
      width: '55%',
      alignSelf: 'center',
      height: 40,
      marginVertical: 8,
    },
    activeFilterItem: {
      backgroundColor: PRIMARY_RED_COLOR,
    },
    activeTextFilter: {
      color: '#FFF',
    },
  });
