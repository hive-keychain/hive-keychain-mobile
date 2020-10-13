import React, {useEffect} from 'react';
import {StyleSheet, FlatList, Text, View, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';

import Operation from './Operation';
import {translate} from 'utils/localize';
import Separator from 'components/ui/Separator';
import Delegate from 'assets/wallet/icon_delegate_dark.svg';
import {loadDelegators, loadDelegatees} from 'actions';
import {toHP, withCommas} from 'utils/format';
import Edit from 'assets/wallet/edit.svg';
import {navigate} from 'utils/navigation';
import Delegation from 'components/operations/Delegation';

const DelegationsList = ({
  user,
  loadDelegateesConnect,
  loadDelegatorsConnect,
  delegations,
  type,
  properties,
}) => {
  useEffect(() => {
    if (user) {
      if (type === 'incoming') {
        loadDelegatorsConnect(user.name);
      } else {
        loadDelegateesConnect(user.name);
      }
    }
  }, [loadDelegateesConnect, loadDelegatorsConnect, user, type]);

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
                toHP(item.vesting_shares, properties.globals),
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
                  toHP(item.vesting_shares, properties.globals),
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

export default connect(
  (state) => {
    return {
      user: state.activeAccount,
      delegations: state.delegations,
      properties: state.properties,
    };
  },
  {
    loadDelegateesConnect: loadDelegatees,
    loadDelegatorsConnect: loadDelegators,
  },
)(DelegationsList);
