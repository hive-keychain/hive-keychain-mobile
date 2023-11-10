import {VestingDelegation} from '@hiveio/dhive';
import {loadDelegatees, loadDelegators} from 'actions/index';
import {IncomingDelegation} from 'actions/interfaces';
import Delegate from 'assets/wallet/icon_delegate_dark.svg';
import Icon from 'components/hive/Icon';
import Separator from 'components/ui/Separator';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {getRotateStyle} from 'src/styles/transform';
import {title_primary_body_2} from 'src/styles/typography';
import {RootState} from 'store';
import {toHP, withCommas} from 'utils/format';
import {getCurrency} from 'utils/hive';
import {getPendingOutgoingUndelegation} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import Operation from './Operation';
import OperationThemed from './OperationThemed';

type Props = PropsFromRedux & {type: 'incoming' | 'outgoing'; theme: Theme};

const DelegationsList = ({
  user,
  loadDelegatees,
  loadDelegators,
  delegations,
  type,
  properties,
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
    console.log({pendingOutgoingList}); //TODO remove line
    if (pendingOutgoingList.length > 0) {
      setPendingList(pendingOutgoingList);
      setTotalPendingOutgoingUndelegation(
        pendingOutgoingList.reduce(
          (acc: number, current: any) =>
            acc + toHP(current.vesting_shares + '', properties.globals),
          0,
        ),
      );
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
    setSelectedOutgoingItem(selectedOutgoingItem ? undefined : item);
  };

  const styles = getDimensionedStyles(theme);

  const renderOutgoingItem = (item: VestingDelegation) => {
    //TODO bellow keep working in cancel delegation logic & design:
    //  1. use same 2 buttons when expanded item: edit/delete.
    //  2. when edit: an input appear but within the same expanded item:
    //    2.1: so the user can save/cancel edition.
    //TODO important, remember to use bellow, to allow update delegation or remove functions:
    // <TouchableOpacity
    //         onPress={() => {
    //           navigate('ModalScreen', {
    //             modalContent: <Delegation delegatee={item.delegatee} />,
    //           });
    //         }}></TouchableOpacity>
    return (
      <View style={[getCardStyle(theme, 28).defaultCardItem]}>
        <View style={styles.container}>
          <View style={styles.row}>
            <Icon theme={theme} name="at" />
            <Text style={styles.textBase}> {`${item.delegatee}`}</Text>
          </View>
          <View style={styles.rightContainer}>
            <Text style={styles.textBase}>{`${withCommas(
              toHP(item.vesting_shares + '', properties.globals) + '',
            )} ${getCurrency('HP')}`}</Text>

            <Icon
              theme={theme}
              name="expand_thin"
              additionalContainerStyle={[
                styles.logo,
                getRotateStyle(
                  selectedOutgoingItem && selectedOutgoingItem.id === item.id
                    ? '180'
                    : '0',
                ),
              ]}
              {...styles.smallIcon}
              onClick={() => onHandleSelectedOutgoingItem(item)}
              // color={getColors(theme).icon}
            />
          </View>
        </View>
        {selectedOutgoingItem && selectedOutgoingItem.id === item.id && (
          <View>
            <Text>TODO edition menu</Text>
          </View>
        )}
      </View>
    );
  };

  const renderIncomingItem = (item: IncomingDelegation) => {
    return (
      <View style={[getCardStyle(theme, 28).defaultCardItem, styles.container]}>
        <View style={styles.row}>
          <Icon theme={theme} name="at" />
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
        <>
          <Separator height={35} />
          {type === 'outgoing' && (
            <>
              <Text
                style={[
                  styles.textBase,
                  styles.opaque,
                  styles.paddingHorizontal,
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
        </>
      }
    />
  );

  //TODO bellow removed unused & clean styles
  return (
    <Operation
      logo={<Delegate />}
      title={translate(`wallet.operations.delegation.${type}`)}>
      <>
        <Separator height={40} />
        {type === 'incoming' ? renderIncoming() : renderOutgoing()}
      </>
    </Operation>
  );
};

const getDimensionedStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    text: {fontSize: 16},
    rightContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    logo: {marginLeft: 10},
    separator: {marginVertical: 5, borderBottomWidth: 1},
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
  },
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(DelegationsList);
