import {VestingDelegation} from '@hiveio/dhive';
import {loadAccount, loadDelegatees, loadDelegators} from 'actions/index';
import {IncomingDelegation} from 'actions/interfaces';
import {showModal} from 'actions/message';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import ConfirmationInItem from 'components/ui/ConfirmationInItem';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getHorizontalLineStyle, getSeparatorLineStyle} from 'src/styles/line';
import {getRotateStyle} from 'src/styles/transform';
import {
  title_primary_body_2,
  title_secondary_body_3,
} from 'src/styles/typography';
import {RootState} from 'store';
import {fromHP, toHP, withCommas} from 'utils/format';
import {delegate, getCurrency} from 'utils/hive';
import {
  getPendingOutgoingUndelegation,
  sanitizeAmount,
  sanitizeUsername,
} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
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
  const [totalDelegationsAmount, setTotalDelegationsAmount] = useState<number>(
    0,
  );
  const [
    totalPendingOutgoingUndelegation,
    setTotalPendingOutgoingUndelegation,
  ] = useState<number>(0);
  const [pendingUndelegationsList, setPendingList] = useState<any[]>([]);
  const [selectedOutgoingItem, setSelectedOutgoingItem] = useState<
    VestingDelegation
  >();
  const [
    showCancelConfirmationDelegation,
    setShowCancelConfirmationDelegation,
  ] = useState(false);
  const [available, setAvailable] = useState<string | number>('...');
  const [editedAmountDelegation, setEditedAmountDelegation] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (type === 'incoming') {
        loadDelegators(user.name);
      } else {
        loadDelegatees(user.name);
        loadPendingOutgoingUndelegations();
      }
    }
  }, [loadDelegatees, loadDelegators, user, type]);

  const loadPendingOutgoingUndelegations = async () => {
    const pendingOutgoingList = await getPendingOutgoingUndelegation(user.name);
    if (pendingOutgoingList.length > 0) {
      setPendingList(pendingOutgoingList);
      const totalOutgoing = pendingOutgoingList.reduce(
        (acc: number, current: any) =>
          acc + toHP(current.vesting_shares + '', properties.globals),
        0,
      );
      setTotalPendingOutgoingUndelegation(totalOutgoing);
      const totalHp = toHP(
        user.account.vesting_shares as string,
        properties.globals,
      );
      setAvailable(Math.max(totalHp - Number(totalOutgoing) - 5, 0).toFixed(4));
    }
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
  }, [delegations]);

  const onHandleSelectedOutgoingItem = (item: VestingDelegation) => {
    console.log({item}); //TODO remove line
    setSelectedOutgoingItem(selectedOutgoingItem ? undefined : item);
  };

  const styles = getDimensionedStyles(theme);

  const renderOutgoingItem = (item: VestingDelegation) => {
    const onDelegate = async (isCancellingDelegation: boolean) => {
      setIsLoading(true);
      Keyboard.dismiss();
      try {
        const amount = isCancellingDelegation ? '0' : editedAmountDelegation;
        const delegation = await delegate(user.keys.active, {
          vesting_shares: sanitizeAmount(
            fromHP(sanitizeAmount(amount), properties.globals).toString(),
            'VESTS',
            6,
          ),
          delegatee: sanitizeUsername(item.delegatee),
          delegator: user.account.name,
        });
        loadAccount(user.account.name, true);
        goBack();
        if (parseFloat(amount.replace(',', '.')) !== 0) {
          showModal('toast.delegation_success', MessageModalType.SUCCESS);
        } else {
          showModal('toast.stop_delegation_success', MessageModalType.SUCCESS);
        }
      } catch (e) {
        showModal(
          `Error : ${(e as any).message}`,
          MessageModalType.ERROR,
          null,
          true,
        );
      } finally {
        setSelectedOutgoingItem(undefined);
        setShowCancelConfirmationDelegation(false);
        setEditMode(false);
        setIsLoading(false);
      }
    };

    const isItemSelected =
      selectedOutgoingItem && selectedOutgoingItem.id === item.id;

    return (
      <View style={[getCardStyle(theme, 28).defaultCardItem]}>
        <View style={styles.container}>
          <View style={styles.row}>
            <Icon theme={theme} name={Icons.AT} />
            <Text style={styles.textBase}> {`${item.delegatee}`}</Text>
          </View>
          <View style={styles.rightContainer}>
            <Text style={styles.textBase}>{`${withCommas(
              toHP(item.vesting_shares + '', properties.globals) + '',
            )} ${getCurrency('HP')}`}</Text>
            <Icon
              theme={theme}
              name={Icons.EXPAND_THIN}
              additionalContainerStyle={[
                styles.logo,
                getRotateStyle(
                  selectedOutgoingItem && selectedOutgoingItem.id === item.id
                    ? '0'
                    : '180',
                ),
              ]}
              {...styles.smallIcon}
              onClick={() => onHandleSelectedOutgoingItem(item)}
            />
          </View>
        </View>
        {!showCancelConfirmationDelegation && isItemSelected && !editMode && (
          <>
            <Separator
              drawLine
              additionalLineStyle={[
                getSeparatorLineStyle(theme, 0.5).itemLine,
                styles.margins,
              ]}
            />
            <View style={styles.buttonRowContainer}>
              <TouchableOpacity
                style={[styles.button, styles.marginRight]}
                onPress={() => setEditMode(true)}>
                <Icon
                  name={Icons.EDIT}
                  theme={theme}
                  additionalContainerStyle={styles.roundButton}
                  {...styles.icon}
                />
                <Text style={styles.buttonText}>
                  {translate('common.edit')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setShowCancelConfirmationDelegation(true)}>
                <Icon
                  name={Icons.GIFT_DELETE}
                  theme={theme}
                  additionalContainerStyle={styles.roundButton}
                  {...styles.icon}
                />
                <Text style={styles.buttonText}>
                  {translate('common.delete')}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {isItemSelected && showCancelConfirmationDelegation && !editMode && (
          <ConfirmationInItem
            theme={theme}
            titleKey="wallet.operations.delegation.confirm_cancel_delegation"
            onConfirm={() => onDelegate(true)}
            onCancel={() => setShowCancelConfirmationDelegation(false)}
            isLoading={isLoading}
            additionalConfirmTextStyle={styles.whiteText}
          />
        )}
        {editMode &&
          isItemSelected &&
          !showCancelConfirmationDelegation &&
          !isLoading && (
            <View style={[{alignItems: 'center'}, styles.margins]}>
              <OperationInput
                placeholder={'0.000'}
                keyboardType="decimal-pad"
                textAlign="right"
                value={editedAmountDelegation}
                inputStyle={[styles.textBase, styles.paddingLeft]}
                onChangeText={setEditedAmountDelegation}
                additionalInputContainerStyle={{
                  paddingVertical: 10,
                }}
                additionalOuterContainerStyle={{
                  width: '54%',
                }}
                rightIcon={
                  <View style={styles.flexRowCenter}>
                    <Separator
                      drawLine
                      additionalLineStyle={getHorizontalLineStyle(
                        theme,
                        1,
                        35,
                        16,
                      )}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setEditedAmountDelegation(available.toString())
                      }>
                      <Text style={[styles.textBase, styles.redText]}>
                        {translate('common.max').toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  </View>
                }
              />
              <View style={[styles.flexRowCenter, styles.marginTop]}>
                <Icon
                  name={Icons.CHECK}
                  theme={theme}
                  onClick={() => onDelegate(false)}
                  {...styles.biggerIcon}
                />
                <Icon
                  name={Icons.CLOSE_CIRCLE}
                  theme={theme}
                  additionalContainerStyle={styles.marginLeft}
                  onClick={() => setEditMode(false)}
                  {...styles.biggerIcon}
                />
              </View>
            </View>
          )}
        {editMode &&
          isItemSelected &&
          !showCancelConfirmationDelegation &&
          isLoading && <Loader size={'small'} animating />}
      </View>
    );
  };

  const renderIncomingItem = (item: IncomingDelegation) => {
    return (
      <View style={[getCardStyle(theme, 28).defaultCardItem, styles.container]}>
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
  };

  const renderPendingOutgoingItem = (item: any) => {
    return (
      <View style={[getCardStyle(theme, 28).defaultCardItem, styles.container]}>
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
  };

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
          <Separator height={35} />
          {type === 'outgoing' && (
            <>
              <Text
                style={[
                  styles.textBase,
                  styles.opaque,
                  styles.paddingHorizontal,
                  styles.title,
                ]}>
                {translate('wallet.operations.delegation.outgoing_disclaimer')}
              </Text>
              <Separator height={10} />
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

const getDimensionedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    rightContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    logo: {marginLeft: 10},
    flexRow: {flexDirection: 'row', justifyContent: 'space-between'},
    textBase: {
      ...title_primary_body_2,
      color: getColors(theme).secondaryText,
    },
    title: {fontSize: 15},
    row: {flexDirection: 'row'},
    opaque: {opacity: 0.7},
    paddingHorizontal: {paddingHorizontal: 10},
    smallIcon: {width: 15, height: 15},
    buttonRowContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 10,
    },
    icon: {
      width: 18,
      height: 18,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '30%',
      borderRadius: 12,
      borderWidth: 1,
      justifyContent: 'center',
      paddingVertical: 10,
      borderColor: getColors(theme).quaternaryCardBorderColor,
    },
    buttonText: {
      color: getColors(theme).secondaryText,
      ...title_secondary_body_3,
      marginLeft: 8,
    },
    marginRight: {
      marginRight: 3,
    },
    marginLeft: {marginLeft: 4},
    roundButton: {
      borderWidth: 1,
      borderColor: getColors(theme).quinaryCardBorderColor,
      borderRadius: 100,
      width: 25,
      height: 25,
    },
    whiteText: {color: '#FFF'},
    margins: {marginTop: 10, marginBottom: 15},
    paddingLeft: {
      paddingLeft: 10,
    },
    flexRowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },
    redText: {color: PRIMARY_RED_COLOR},
    biggerIcon: {width: 25, height: 25},
    marginTop: {marginTop: 8},
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
