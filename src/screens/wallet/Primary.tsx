import Hbd from 'assets/wallet/icon_hbd.svg';
import Hive from 'assets/wallet/icon_hive.svg';
import Hp from 'assets/wallet/icon_hp.svg';
import Savings from 'assets/wallet/icon_savings.svg';
import AccountValue from 'components/hive/AccountValue';
import TokenDisplay from 'components/hive/TokenDisplay';
import {
  Send,
  SendConversion,
  SendDelegation,
  SendDeposit,
  SendPowerDown,
  SendPowerUp,
  SendWithdraw,
} from 'components/operations/OperationsButtons';
import Separator from 'components/ui/Separator';
import React, {useEffect} from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {logScreenView} from 'utils/analytics';
import {toHP} from 'utils/format';
import {translate} from 'utils/localize';
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
          <SendConversion key="conversion" currency="HIVE" />,
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
          <SendConversion key="conversion" currency="HBD" />,
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
      <TokenDisplay
        color="#7E8C9A"
        name={translate('common.savings').toUpperCase()}
        currency="HIVE"
        value={parseFloat(user.account.savings_balance as string)}
        secondaryCurrency="HBD"
        secondaryValue={parseFloat(user.account.savings_hbd_balance as string)}
        logo={<Savings width={width / 15} />}
        bottomLeft={
          <Text>
            <Text style={styles.apr}>HBD APR:</Text>
            <Text style={styles.aprValue}>
              {'   '}
              {properties.globals && properties.globals.hbd_interest_rate
                ? `${properties.globals.hbd_interest_rate / 100}%`
                : ''}
            </Text>
          </Text>
        }
        price={bittrex.hbd}
        buttons={[
          <SendWithdraw key="savings_withdraw" currency="HBD" />,
          <SendDeposit key="savings_deposit" currency="HBD" />,
        ]}
      />
      <Separator height={20} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {width: '100%', flex: 1},
  apr: {color: '#7E8C9A', fontSize: 14},
  aprValue: {color: '#3BB26E', fontSize: 14},
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
