import Hbd from 'assets/wallet/icon_hbd.svg';
import Hive from 'assets/wallet/icon_hive.svg';
import Hp from 'assets/wallet/icon_hp.svg';
import AccountValue from 'components/hive/AccountValue';
import TokenDisplay from 'components/hive/TokenDisplay';
import Transactions from 'components/hive/Transactions';
import {
  Send,
  SendConversion,
  SendDelegation,
  SendPowerDown,
  SendPowerUp,
} from 'components/operations/OperationsButtons';
import Separator from 'components/ui/Separator';
import React, {useEffect} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {logScreenView} from 'utils/analytics';
import {toHP} from 'utils/format';
const Primary = ({user, bittrex, properties}: PropsFromRedux) => {
  const {width} = useWindowDimensions();
  useEffect(() => {
    logScreenView('WalletScreen');
  }, []);
  return (
    <View style={styles.container}>
      <Separator height={20} />
      <AccountValue
        account={user.account}
        bittrex={bittrex}
        properties={properties}
      />
      <Separator height={20} />
      <TokenDisplay
        color="#A3112A"
        name="HIVE"
        currency="HIVE"
        value={parseFloat(user.account.balance as string)}
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
        value={parseFloat(user.account.hbd_balance as string)}
        logo={<Hbd width={width / 15} />}
        price={bittrex.hbd}
        buttons={[
          <Send key="send_hbd" currency="HBD" />,
          <SendConversion key="conversion" />,
        ]}
      />
      <Separator height={20} />
      <TokenDisplay
        color="#AC4F00"
        name="HIVE POWER"
        currency="HP"
        value={toHP(user.account.vesting_shares as string, properties.globals)}
        incoming={toHP(
          user.account.received_vesting_shares as string,
          properties.globals,
        )}
        outgoing={toHP(
          user.account.delegated_vesting_shares as string,
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
  container: {width: '100%', flex: 1},
});

const mapStateToProps = (state: RootState) => {
  return {
    user: state.activeAccount,
    bittrex: state.bittrex,
    properties: state.properties,
  };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Primary);
