import {loadDelegatees, loadDelegators} from 'actions/index';
import Edit from 'assets/wallet/edit.svg';
import Delegate from 'assets/wallet/icon_delegate_dark.svg';
import Delegation from 'components/operations/Delegation';
import Separator from 'components/ui/Separator';
import React, {useEffect} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {toHP, withCommas} from 'utils/format';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import Operation from './Operation';

type Props = PropsFromRedux & {type: string};

const DelegationsList = ({
  user,
  loadDelegatees,
  loadDelegators,
  delegations,
  type,
  properties,
}: Props) => {
  useEffect(() => {
    if (user) {
      if (type === 'incoming') {
        loadDelegators(user.name);
      } else {
        loadDelegatees(user.name);
      }
    }
  }, [loadDelegatees, loadDelegators, user, type]);

  const styles = getDimensionedStyles();

  const renderIncoming = () => {
    return (
      <FlatList
        data={delegations.incoming}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({item}) => {
          return (
            <View style={styles.container}>
              <Text>{`@${item.delegator}`}</Text>
              <Text>{`${withCommas(
                toHP(item.vesting_shares + '', properties.globals) + '',
              )} HP`}</Text>
            </View>
          );
        }}
        keyExtractor={(delegation) => `${user.name}_${delegation.delegator}`}
      />
    );
  };
  const renderOutgoing = () => {
    return (
      <FlatList
        data={delegations.outgoing}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({item}) => {
          return (
            <View style={styles.container}>
              <Text style={styles.text}>{`@${item.delegatee}`}</Text>
              <View style={styles.rightContainer}>
                <Text style={styles.text}>{`${withCommas(
                  toHP(item.vesting_shares + '', properties.globals) + '',
                )} HP`}</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigate('ModalScreen', {
                      modalContent: <Delegation delegatee={item.delegatee} />,
                    });
                  }}>
                  <Edit style={styles.logo} />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        keyExtractor={(delegation) => `${user.name}_${delegation.delegatee}`}
      />
    );
  };
  return (
    <Operation
      logo={<Delegate />}
      title={translate(`wallet.operations.delegation.${type}`)}>
      <Separator height={40} />
      {type === 'incoming' ? renderIncoming() : renderOutgoing()}
    </Operation>
  );
};

const getDimensionedStyles = () =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      flex: 1,
    },
    text: {fontSize: 16},
    rightContainer: {
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'flex-end',
    },
    logo: {marginLeft: 20, height: 16, width: 16},
    separator: {marginVertical: 5, borderBottomWidth: 1},
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
