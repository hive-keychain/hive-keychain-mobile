import {VestingDelegation} from '@hiveio/dhive';
import {loadAccount, loadDelegatees, loadDelegators} from 'actions/index';
import {IncomingDelegation, KeyTypes} from 'actions/interfaces';
import {showModal} from 'actions/message';
import Icon from 'components/hive/Icon';
import TwoFaModal from 'components/modals/TwoFaModal';
import {Caption} from 'components/ui/Caption';
import EditableListItem from 'components/ui/EditableListItem';
import Separator from 'components/ui/Separator';
import {useCheckForMultisig} from 'hooks/useCheckForMultisig';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {MessageModalType} from 'src/enums/messageModal.enum';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {
  getFontSizeSmallDevices,
  title_primary_body_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import {
  fromHP,
  getCleanAmountValue,
  toHP,
  withCommas,
} from 'utils/format.utils';
import {
  getPendingOutgoingUndelegation,
  sanitizeAmount,
  sanitizeUsername,
} from 'utils/hive.utils';
import {delegate, getCurrency} from 'utils/hiveLibs.utils';
import {translate} from 'utils/localize';
import {goBack, navigate} from 'utils/navigation.utils';
import OperationThemed from './OperationThemed';

interface DelegationListProps {
  type: 'incoming' | 'outgoing';
  theme: Theme;
}

type Props = PropsFromRedux & DelegationListProps;

const DelegationsList = ({
  user,
  loadDelegatees,
  loadDelegators,
  delegations,
  type,
  properties,
  showModal,
  theme,
}: Props) => {
  const [totalDelegationsAmount, setTotalDelegationsAmount] =
    useState<number>(0);
  const [
    totalPendingOutgoingUndelegation,
    setTotalPendingOutgoingUndelegation,
  ] = useState<number>(0);
  const [pendingUndelegationsList, setPendingList] = useState<any[]>([]);
  const [available, setAvailable] = useState<string | number>('...');
  const [isLoading, setIsLoading] = useState(false);
  const [isMultisig, twoFABots] = useCheckForMultisig(KeyTypes.active, user);
  const {width} = useWindowDimensions();
  const styles = getDimensionedStyles(theme, width);

  useEffect(() => {
    if (user) {
      if (type === 'incoming') {
        loadDelegators(user.name);
      } else {
        loadDelegatees(user.name);
      }
    }
  }, [loadDelegatees, loadDelegators, user.name, type, totalDelegationsAmount]);

  const loadPendingOutgoingUndelegations = async () => {
    const pendingOutgoingList = await getPendingOutgoingUndelegation(user.name);
    let totalOutgoing = 0;
    if (pendingOutgoingList.length > 0) {
      setPendingList(pendingOutgoingList);
      totalOutgoing = pendingOutgoingList.reduce(
        (acc: number, current: any) =>
          acc + toHP(current.vesting_shares + '', properties.globals),
        0,
      );
      setTotalPendingOutgoingUndelegation(totalOutgoing);
    }
    const totalHp = toHP(
      user.account.vesting_shares as string,
      properties.globals,
    );
    setAvailable(
      Math.max(
        totalHp - Number(totalOutgoing) - totalDelegationsAmount - 5,
        0,
      ).toFixed(3),
    );
  };

  useEffect(() => {
    if (delegations.incoming.length > 0 || delegations.outgoing.length > 0) {
      setTotalDelegationsAmount(
        type === 'incoming'
          ? delegations.incoming.reduce(
              (acc, current) =>
                acc + toHP(current.vesting_shares + '', properties.globals),
              0,
            )
          : delegations.outgoing.reduce(
              (acc, current) =>
                acc + toHP(current.vesting_shares + '', properties.globals),
              0,
            ),
      );
    }
    if (type === 'outgoing') {
      loadPendingOutgoingUndelegations();
    }
  }, [delegations]);

  const renderOutgoingItem = (item: VestingDelegation) => {
    const currentHpAmount = toHP(
      item.vesting_shares + '',
      properties.globals,
    ).toString();

    const onDelegate = async (
      isCancellingDelegation: boolean,
      editedValue: string,
    ) => {
      const handleSubmit = async (options: TransactionOptions) => {
        setIsLoading(true);
        Keyboard.dismiss();
        try {
          const amount = isCancellingDelegation ? '0' : editedValue;
          const delegation = await delegate(
            user.keys.active,
            {
              vesting_shares: sanitizeAmount(
                fromHP(sanitizeAmount(amount), properties.globals).toString(),
                'VESTS',
                6,
              ),
              delegatee: sanitizeUsername(item.delegatee),
              delegator: user.account.name,
            },
            options,
          );
          loadAccount(user.account.name, true);
          goBack();
          if (!isMultisig) {
            if (parseFloat(amount.replace(',', '.')) !== 0) {
              showModal('toast.delegation_success', MessageModalType.SUCCESS);
            } else {
              showModal(
                'toast.stop_delegation_success',
                MessageModalType.SUCCESS,
              );
            }
          }
        } catch (e) {
          if (!isMultisig)
            showModal(
              `Error : ${(e as any).message}`,
              MessageModalType.ERROR,
              null,
              true,
            );
        } finally {
          setIsLoading(false);
        }
      };
      if (Object.entries(twoFABots).length > 0) {
        navigate('ModalScreen', {
          name: `2FA`,
          modalContent: (
            <TwoFaModal twoFABots={twoFABots} onSubmit={handleSubmit} />
          ),
        });
      } else {
        handleSubmit({
          multisig: isMultisig,
          fromWallet: true,
        });
      }
    };

    return (
      <EditableListItem
        label={`@${item.delegatee}`}
        value={`${withCommas(currentHpAmount)} ${getCurrency('HP')}`}
        isEditable={true}
        initialEditValue={currentHpAmount}
        onEdit={async (editedValue) => {
          await onDelegate(false, editedValue);
        }}
        onDelete={async () => {
          await onDelegate(true, '');
        }}
        deleteConfirmationTitleKey="wallet.operations.delegation.confirm_cancel_delegation"
        maxValue={getCleanAmountValue(
          (
            +available + toHP(item.vesting_shares + '', properties.globals)
          ).toString(),
        )}
      />
    );
  };

  const renderIncomingItem = useCallback(
    (item: IncomingDelegation) => {
      return (
        <View
          style={[getCardStyle(theme, 28).defaultCardItem, styles.container]}>
          <View style={styles.row}>
            <Icon theme={theme} name={Icons.AT} />
            <Text style={styles.textBase}> {`${item.delegator}`}</Text>
          </View>
          <Text style={styles.textBase}>
            {`${withCommas(
              toHP(item.vesting_shares + '', properties.globals) + '',
            )} ${getCurrency('HP')}`}
          </Text>
        </View>
      );
    },
    [theme, styles, properties.globals],
  );

  const renderPendingOutgoingItem = useCallback(
    (item: any) => {
      return (
        <View
          style={[getCardStyle(theme, 28).defaultCardItem, styles.container]}>
          <Text style={styles.textBase}>
            {' '}
            {`${moment(item.expiration_date).format('L')}`}
          </Text>
          <Text style={styles.textBase}>
            {`${withCommas(
              toHP(item.vesting_shares + '', properties.globals) + '',
            )} ${getCurrency('HP')}`}
          </Text>
        </View>
      );
    },
    [theme, styles, properties.globals],
  );

  const renderIncoming = () => {
    return (
      <FlatList
        data={delegations.incoming}
        ItemSeparatorComponent={() => <Separator height={5} />}
        renderItem={({item}) => renderIncomingItem(item)}
        keyExtractor={(delegation) => `${user.name}_${delegation.delegator}`}
      />
    );
  };
  const renderOutgoing = () => {
    return (
      <FlatList
        data={delegations.outgoing}
        ItemSeparatorComponent={() => <Separator height={10} />}
        renderItem={({item}) => renderOutgoingItem(item)}
        keyExtractor={(delegation) => `${user.name}_${delegation.delegatee}`}
      />
    );
  };

  const renderPendingOutgoing = () => {
    return (
      <FlatList
        data={pendingUndelegationsList}
        renderItem={({item}) => renderPendingOutgoingItem(item)}
        keyExtractor={(pendingDelegation) =>
          `${user.name}_${pendingDelegation.expiration_date}`
        }
      />
    );
  };

  return (
    <OperationThemed
      childrenTop={<Separator height={40} />}
      childrenMiddle={
        <View>
          <Separator height={20} />
          {type === 'outgoing' && (
            <>
              <Caption text="wallet.operations.delegation.outgoing_disclaimer" />
              {pendingUndelegationsList.length > 0 && (
                <View style={styles.flexRow}>
                  <Text style={[styles.textBase, styles.title]}>
                    {translate(
                      'wallet.operations.delegation.pending_undelegations',
                    )}
                  </Text>
                  <Text style={[styles.textBase, styles.title]}>{`${withCommas(
                    totalPendingOutgoingUndelegation.toFixed(3),
                  )} ${getCurrency('HP')}`}</Text>
                </View>
              )}
              <Separator height={10} />
              {renderPendingOutgoing()}
            </>
          )}
          <View style={styles.flexRow}>
            <Text style={[styles.textBase, styles.title]}>
              {translate(`wallet.operations.delegation.total_${type}`)}
            </Text>
            <Text style={[styles.textBase, styles.title]}>{`${withCommas(
              totalDelegationsAmount.toFixed(4) + '',
            )} ${getCurrency('HP')}`}</Text>
          </View>
          <Separator height={10} />
          {type === 'incoming' ? renderIncoming() : renderOutgoing()}
        </View>
      }
    />
  );
};

const getDimensionedStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    flexRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
    },
    textBase: {
      ...title_primary_body_2,
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(width, 12),
    },
    title: {fontSize: getFontSizeSmallDevices(width, 15), paddingHorizontal: 4},
    row: {flexDirection: 'row'},
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
      delegations: state.delegations,
      properties: state.properties,
    };
  },
  {
    loadDelegatees,
    loadDelegators,
    showModal,
  },
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(DelegationsList);
