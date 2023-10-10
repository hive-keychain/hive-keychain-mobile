import {createStackNavigator} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {headlines_primary_headline_2} from 'src/styles/typography';
//TODO use import { translate } from 'utils/localize';
import ArrowLeftDark from 'assets/new_UI/arrow_left_dark.svg';
import ArrowLeftLight from 'assets/new_UI/arrow_left_light.svg';
import CustomFilterBox from 'components/form/CustomFilterBox';
import Icon from 'components/hive/Icon';
import {TokensHistoryComponent} from 'components/operations/Tokens-history';
import CustomIconButton from 'components/ui/CustomIconButton';
import {
  RootStackParam,
  TokensHistoryNavigationProps,
} from 'navigators/Root.types';
import {StyleSheet, View} from 'react-native';
import {WalletHistoryFilter} from 'src/types/wallet.history.types';
import {translate} from 'utils/localize';

const Stack = createStackNavigator<RootStackParam>();

export const DEFAULT_FILTER_TOKENS: WalletHistoryFilter = {
  filterValue: '',
  inSelected: false,
  outSelected: false,
  selectedTransactionTypes: {
    comments_curationReward: false,
    comments_authorReward: false,
    mining_lottery: false,
    tokens_transfer: false,
    tokens_stake: false,
    tokens_unstakeStart: false,
    tokens_unstakeDone: false,
    tokens_delegate: false,
    tokens_undelegateStart: false,
    tokens_undelegateDone: false,
  },
};

export default ({navigation, route}: TokensHistoryNavigationProps) => {
  const {theme} = useContext(ThemeContext);
  const {currency} = route.params;
  const styles = getStyles(theme);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TokensHistory"
        component={() => <TokensHistoryComponent {...route.params} />}
        options={() => ({
          headerStyle: {
            backgroundColor: getColors(theme).primaryBackground,
          },
          headerTitleStyle: {
            ...headlines_primary_headline_2,
            color: getColors(theme).primaryText,
          },
          headerTitleAlign: 'center',
          title: `${currency} ${translate('common.history').toUpperCase()}`,
          headerRight: () => (
            <Icon
              name={'settings-4'}
              theme={theme}
              onClick={() =>
                navigation.navigate('ModalScreen', {
                  name: 'FilterScreen',
                  modalContent: (
                    <CustomFilterBox
                      theme={theme}
                      headerText={translate('wallet.filter.filter_title')}
                      defaultFilter={DEFAULT_FILTER_TOKENS}
                      setFilterOut={(filter) => {
                        //TODO see if needed after using redux with tokens filter.
                        navigation.setParams({filter: filter});
                      }}
                    />
                  ),
                  fixedHeight: 0.7,
                  additionalWrapperFixedStyle: styles.wrapperFixed,
                  modalPosition: undefined,
                  modalContainerStyle: styles.modalContainer,
                  renderButtonElement: (
                    <View style={styles.overlayButtonElement}>
                      <Icon
                        name="settings-4"
                        theme={theme}
                        additionalContainerStyle={styles.iconButton}
                      />
                      <Icon theme={theme} name="polygon_down" />
                    </View>
                  ),
                })
              }
              additionalContainerStyle={[styles.iconButton, styles.marginRight]}
            />
          ),
          cardStyle: {
            backgroundColor: getColors(theme).primaryBackground,
          },
          headerLeft: () => (
            <CustomIconButton
              theme={theme}
              onPress={() => navigation.goBack()}
              lightThemeIcon={<ArrowLeftLight />}
              darkThemeIcon={<ArrowLeftDark />}
              additionalContainerStyle={styles.marginLeft}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    wrapperFixed: {
      top: 55,
      bottom: undefined,
      left: undefined,
      right: 10,
    },
    modalContainer: {
      width: '80%',
      alignSelf: 'flex-end',
      backgroundColor: 'none',
      borderWidth: 0,
    },
    overlayButtonElement: {
      position: 'absolute',
      top: 10,
      bottom: undefined,
      right: 0,
      left: undefined,
      marginRight: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconButton: {
      paddingHorizontal: 19,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: getColors(theme).secondaryCardBorderColor,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderRadius: 26,
    },
    marginRight: {
      marginRight: 16,
    },
    marginLeft: {marginLeft: 16},
  });
