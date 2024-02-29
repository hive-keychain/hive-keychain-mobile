import {clearTokensFilters, updateTokensFilter} from 'actions/tokensFilters';
import {clearWalletFilters, updateWalletFilter} from 'actions/walletFilters';
import Separator from 'components/ui/Separator';
import React from 'react';
import {
  ScaledSize,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {
  PRIMARY_RED_COLOR,
  RED_SHADOW_COLOR,
  getColors,
} from 'src/styles/colors';
import {generateBoxShadowStyle} from 'src/styles/shadow';
import {
  SMALLEST_SCREEN_WIDTH_SUPPORTED,
  button_link_primary_medium,
  button_link_primary_small,
  getFontSizeSmallDevices,
  headlines_primary_headline_3,
} from 'src/styles/typography';
import {TokenHistoryFilter} from 'src/types/tokens.history.types';
import {WalletHistoryFilter} from 'src/types/wallet.history.types';
import {RootState} from 'store';
import {translate} from 'utils/localize';
import CustomSearchBar from './CustomSearchBar';
import EllipticButton from './EllipticButton';

export type FilterType = WalletHistoryFilter | TokenHistoryFilter;
interface Props {
  theme: Theme;
  headerText: string;
  usingFilter: 'wallet' | 'tokens';
}

const FilterBox = ({
  theme,
  headerText,
  usingFilter,
  updateTokensFilter,
  updateWalletFilter,
  clearTokensFilters,
  clearWalletFilters,
  walletFilters,
  tokensFilter,
}: Props & PropsFromRedux) => {
  const filter = usingFilter === 'tokens' ? tokensFilter : walletFilters;

  const updateFilterRedux = (newFilter: FilterType) => {
    if (usingFilter === 'tokens') {
      updateTokensFilter(newFilter);
    } else if (usingFilter === 'wallet') {
      updateWalletFilter(newFilter);
    }
  };

  const toggleFilterType = (transactionName: string) => {
    const newFilter = {...filter.selectedTransactionTypes};
    newFilter[transactionName] = !filter.selectedTransactionTypes[
      transactionName
    ];
    updateFilterRedux({...filter, selectedTransactionTypes: newFilter});
  };

  const toggleFilterIn = () => {
    const newFilter = {
      ...filter,
      inSelected: !filter.inSelected,
    };
    updateFilterRedux(newFilter);
  };

  const toggleFilterOut = () => {
    const newFilter = {
      ...filter,
      outSelected: !filter.outSelected,
    };
    updateFilterRedux(newFilter);
  };

  const updateFilterValue = (value: string) => {
    const newFilter = {
      ...filter,
      filterValue: value,
    };
    updateFilterRedux(newFilter);
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

  const handleClearFilter = () => {
    if (usingFilter === 'tokens') {
      clearTokensFilters();
    } else {
      clearWalletFilters();
    }
  };

  const styles = getStyles(theme, useWindowDimensions());
  const preFixLocale =
    usingFilter === 'wallet'
      ? `${usingFilter}.filter`
      : `wallet.operations.tokens_filter`;

  return (
    <View style={[styles.container]}>
      <Text style={styles.headerText}>{headerText}</Text>
      <View style={styles.itemContainer}>
        <CustomSearchBar
          theme={theme}
          additionalContainerStyle={styles.searchBarContainer}
          onChangeText={(text) => updateFilterValue(text)}
          value={filter.filterValue}
          additionalCustomInputStyle={[
            styles.filterItemText,
            styles.filterSearchText,
          ]}
        />
        <View style={[styles.filterItemContainer]}>
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
                  {translate(`${preFixLocale}.${filterKey}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <Separator drawLine height={8} additionalLineStyle={styles.line} />
      <View style={styles.inOutContainer}>
        <TouchableOpacity
          style={[
            styles.filterItem,
            getActiveContainerStyleInOrOut('inSelected'),
            {
              width: 70,
            },
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
            {
              width: 70,
            },
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
        onPress={() => handleClearFilter()}
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
        additionalTextStyle={styles.buttonText}
      />
    </View>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    walletFilters: state.walletFilters,
    tokensFilter: state.tokensFilters,
  };
};

const connector = connect(mapStateToProps, {
  updateTokensFilter,
  updateWalletFilter,
  clearWalletFilters,
  clearTokensFilters,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const getStyles = (theme: Theme, {width, height}: ScaledSize) =>
  StyleSheet.create({
    container: {
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderWidth: 1,
      borderRadius: 15.1,
      flex: 1,
      justifyContent: 'space-evenly',
      paddingVertical: 10,
    },
    headerText: {
      marginVertical: 8,
      textAlign: 'center',
      ...headlines_primary_headline_3,
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(
        width,
        {...headlines_primary_headline_3}.fontSize,
      ),
    },
    searchBarContainer: {
      borderWidth: 1,
      borderRadius: 53,
      width: '100%',
      borderColor: getColors(theme).tertiaryCardBorderColor,
      marginBottom: 10,
      height: height <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 35 : 50,
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
      marginRight: 4,
      marginBottom: 4,
      width: 'auto',
      minHeight: 40,
    },
    filterItemText: {
      textAlign: 'center',
      padding: 10,
      ...button_link_primary_small,
      lineHeight: 14.7,
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(width, 12),
    },
    line: {
      height: 0,
      width: '88%',
      alignSelf: 'center',
      margin: 0,
      marginVertical: 8,
      borderWidth: 0.4,
      borderColor: getColors(theme).tertiaryCardBorderColor,
    },
    inOutContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 18,
      justifyContent: 'center',
    },
    warningProceedButton: {
      backgroundColor: PRIMARY_RED_COLOR,
      width: '55%',
      alignSelf: 'center',
      height: height <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 30 : 40,
      marginVertical: 8,
    },
    activeFilterItem: {
      backgroundColor: PRIMARY_RED_COLOR,
    },
    activeTextFilter: {
      color: '#FFF',
    },
    buttonText: {
      ...button_link_primary_medium,
      fontSize: getFontSizeSmallDevices(
        width,
        {...button_link_primary_medium}.fontSize,
      ),
    },
    filterSearchText: {
      textAlign: 'left',
    },
  });

export const CustomFilterBox = connector(FilterBox);
