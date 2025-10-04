import {loadAccount} from 'actions/index';
import {Conversion} from 'actions/interfaces';
import OperationThemed from 'components/operations/OperationThemed';
import Separator from 'components/ui/Separator';
import moment from 'moment';
import React, {useCallback} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {button_link_primary_medium} from 'src/styles/typography';
import {RootState} from 'store';
import {withCommas} from 'utils/format.utils';
import {translate} from 'utils/localize';

type Props = PropsFromRedux & {
  currency: 'HBD' | 'HIVE';
  currentPendingConversionList: Conversion[];
};

const PendingConversions = ({
  user,
  loadAccount,
  currency,
  currentPendingConversionList,
}: Props) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme);

  const renderListItem = useCallback(
    ({item}: {item: Conversion}) => {
      return (
        <View style={[getCardStyle(theme).defaultCardItem]}>
          <View style={styles.flexRow}>
            <Text style={[styles.textBase, styles.smallerText]}>{`${withCommas(
              item.amount,
            )} ${currency}`}</Text>
            <Text style={[styles.textBase, styles.smallerText]}>{`On ${moment(
              item.conversion_date,
            ).format('L')}`}</Text>
          </View>
        </View>
      );
    },
    [theme, styles, currency],
  );

  return (
    <OperationThemed
      additionalContentContainerStyle={styles.contentContainer}
      childrenMiddle={
        <>
          <Separator />
          <FlatList
            data={currentPendingConversionList.filter(
              (conversionItem) =>
                conversionItem.amount.split(' ')[1] === currency,
            )}
            keyExtractor={(listItem) => listItem.requestid.toString()}
            renderItem={renderListItem}
            ListEmptyComponent={() => {
              return (
                <View style={[styles.containerCentered, styles.marginTop]}>
                  <Text style={[styles.textBase]}>
                    {translate('wallet.operations.convert.no_pending', {
                      currency,
                    })}
                  </Text>
                </View>
              );
            }}
          />
        </>
      }
    />
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    contentContainer: {marginTop: 50, paddingHorizontal: 15},
    textBase: {
      color: getColors(theme).secondaryText,
      ...button_link_primary_medium,
    },
    containerCentered: {
      flex: 1,
    },
    marginTop: {
      marginTop: 30,
    },
    flexRow: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center',
    },
    smallerText: {
      fontSize: 13,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
    };
  },
  {
    loadAccount,
  },
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(PendingConversions);
