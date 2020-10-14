import React from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {connect} from 'react-redux';

import {toHP} from 'utils/format';

import AccountValue from 'components/hive/AccountValue';
import TokenDisplay from 'components/hive/TokenDisplay';
import Separator from 'components/ui/Separator';
import {
  Send,
  SendDelegation,
  SendPowerUp,
  SendPowerDown,
} from 'components/operations/OperationsButtons';
import Transactions from 'components/hive/Transactions';

import Hive from 'assets/wallet/icon_hive.svg';
import Hbd from 'assets/wallet/icon_hbd.svg';
import Hp from 'assets/wallet/icon_hp.svg';

const Primary = ({user, bittrex, properties, navigation}) => {
  const {width} = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Separator height={20} />
      <AccountValue
        account={user.account}
        bittrex={bittrex}
        properties={properties}
        style={styles.accountValue}
      />
      <Separator height={20} />
      <TokenDisplay
        color="#A3112A"
        name="HIVE"
        currency="HIVE"
        value={parseFloat(user.account.balance)}
        logo={<Hive width={width / 15} />}
        price={bittrex.hive}
        buttons={[
          <Send key="send_hive" currency="HIVE" />,
          <SendPowerUp key="pu" />,
        ]}
      />
      <Separator height={20} />
      <TokenDisplay
        color="#005C09"
        name="HIVE DOLLARS"
        currency="HBD"
        value={parseFloat(user.account.sbd_balance)}
        logo={<Hbd width={width / 15} />}
        price={bittrex.hbd}
        buttons={[<Send key="send_hbd" currency="HBD" />]}
      />
      <Separator height={20} />
      <TokenDisplay
        color="#AC4F00"
        name="HIVE POWER"
        currency="HP"
        value={toHP(user.account.vesting_shares, properties.globals)}
        incoming={toHP(
          user.account.received_vesting_shares,
          properties.globals,
        )}
        outgoing={toHP(
          user.account.delegated_vesting_shares,
          properties.globals,
        )}
        logo={<Hp width={width / 15} />}
        price={bittrex.hbd}
        buttons={[<SendDelegation key="del" />, <SendPowerDown key="pd" />]}
      />
      <Separator height={20} />
      <Transactions user={user} />
    </View>
  );
};

const styles = StyleSheet.create({
  accountValue: {
    color: '#626F79',
    fontSize: 28,
    textAlign: 'center',
    width: '100%',
  },
  container: {width: '100%', flex: 1},
});

const mapStateToProps = (state) => {
  return {
    user: state.activeAccount,
    bittrex: state.bittrex,
    properties: state.properties,
  };
};

export default connect(mapStateToProps)(Primary);
