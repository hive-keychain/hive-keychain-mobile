import {fetchRecurrentTransfers} from 'actions/hive';
import OperationThemed from 'components/operations/OperationThemed';
import EditableListItem from 'components/ui/EditableListItem';
import Separator from 'components/ui/Separator';
import {FormatUtils} from 'hive-keychain-commons';
import React, {useCallback, useEffect} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {PendingRecurrentTransfer} from 'src/interfaces/transaction.interface';
import {getColors} from 'src/styles/colors';
import {button_link_primary_medium} from 'src/styles/typography';
import {RootState} from 'store';
import {recurrentTransfer} from 'utils/hiveLibs.utils';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation.utils';

type Props = PropsFromRedux;

const RecurrentTransfers = ({
  recurrentTransfers,
  user,
  fetchRecurrentTransfers,
}: Props) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme);

  useEffect(() => {
    if (recurrentTransfers.length === 0) {
      goBack();
    }
  }, [recurrentTransfers]);

  const renderListItem = useCallback(
    ({item}: {item: PendingRecurrentTransfer}) => {
      return (
        <EditableListItem
          label={`@${item.to}`}
          value={FormatUtils.withCommas(
            FormatUtils.fromNaiAndSymbol(item.amount),
          )}
          subLabel={translate(
            'wallet.operations.transfer.remaining_executions',
            {
              nb: item.remaining_executions,
            },
          )}
          subValue={translate('wallet.operations.transfer.recurrence_period', {
            nb: item.recurrence,
          })}
          isEditable={true}
          onDelete={async () => {
            await recurrentTransfer(user.keys.active, {
              from: item.from,
              to: item.to,
              amount: '0.000 HIVE',
              recurrence: 24,
              executions: 2,
              memo: '',
              extensions: [{type: 1, value: {pair_id: item.pair_id}}],
            });
            fetchRecurrentTransfers(user.name!);
          }}
        />
      );
    },
    [],
  );

  return (
    <OperationThemed
      additionalContentContainerStyle={styles.contentContainer}
      childrenMiddle={
        <>
          <Separator />
          <FlatList
            data={recurrentTransfers}
            keyExtractor={(trx) => `${trx.to}-${trx.pair_id}`}
            renderItem={renderListItem}
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
      recurrentTransfers: state.recurrentTransfers,
      user: state.activeAccount,
    };
  },
  {fetchRecurrentTransfers},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(RecurrentTransfers);
