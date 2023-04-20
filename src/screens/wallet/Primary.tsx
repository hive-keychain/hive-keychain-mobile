import Hbd from 'assets/wallet/icon_hbd.svg';
import Hive from 'assets/wallet/icon_hive.svg';
import Hp from 'assets/wallet/icon_hp.svg';
import Savings from 'assets/wallet/icon_savings.svg';
import AccountValue from 'components/hive/AccountValue';
import TokenDisplay from 'components/hive/TokenDisplay';
import {
  BuyCoins,
  PendingSavingsWithdraw,
  Send,
  SendConversion,
  SendDelegation,
  SendDeposit,
  SendPowerDown,
  SendPowerUp,
  SendWithdraw,
} from 'components/operations/OperationsButtons';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {BuyCoinType} from 'src/enums/operations.enum';
import {SavingsWithdrawal} from 'src/interfaces/savings.interface';
import {RootState} from 'store';
import {logScreenView} from 'utils/analytics';
import {signedNumber, toHP} from 'utils/format';
import {getCurrency} from 'utils/hive';
import {translate} from 'utils/localize';
import {SavingsUtils} from 'utils/savings.utils';

enum Token {
  NONE,
  HIVE,
  HBD,
  HP,
  SAVINGS,
}
const Primary = ({
  user,
  prices,
  properties,
  userSavingsWithdrawRequests,
}: PropsFromRedux) => {
  const {width} = useWindowDimensions();
  const [toggled, setToggled] = useState(Token.NONE);
  const [currentWithdrawingList, setCurrentWithdrawingList] = useState<
    SavingsWithdrawal[]
  >([]);
  const [
    totalPendingHBDSavingsWithdrawals,
    setTotalPendingHBDSavingsWithdrawals,
  ] = useState(0);
  const [
    totalPendingHIVESavingsWithdrawals,
    setTotalPendingHIVESavingsWithdrawals,
  ] = useState(0);

  useEffect(() => {
    logScreenView('WalletScreen');
  }, []);

  useEffect(() => {
    if (userSavingsWithdrawRequests > 0) {
      fetchCurrentWithdrawingList();
    }
  }, [user]);

  const fetchCurrentWithdrawingList = async () => {
    const pendingSavingsWithdrawalsList: SavingsWithdrawal[] = await SavingsUtils.getSavingsWitdrawFrom(
      user.name!,
    );
    setCurrentWithdrawingList(pendingSavingsWithdrawalsList);
    setTotalPendingHIVESavingsWithdrawals(
      pendingSavingsWithdrawalsList
        .filter(
          (current) => current.amount.split(' ')[1] === getCurrency('HIVE'),
        )
        .reduce(
          (acc, current) => acc + parseFloat(current.amount.split(' ')[0]),
          0,
        ),
    );
    setTotalPendingHBDSavingsWithdrawals(
      pendingSavingsWithdrawalsList
        .filter(
          (current) => current.amount.split(' ')[1] === getCurrency('HBD'),
        )
        .reduce(
          (acc, current) => acc + parseFloat(current.amount.split(' ')[0]),
          0,
        ),
    );
  };

  return (
    <View style={styles.container}>
      <Separator height={30} />
      <AccountValue
        account={user.account}
        prices={prices}
        properties={properties}
      />
      <Separator height={30} />

      <TokenDisplay
        color="#A3112A"
        name="HIVE"
        currency="HIVE"
        value={parseFloat(user.account.balance as string)}
        logo={<Hive width={width / 15} />}
        price={prices.hive}
        toggled={toggled === Token.HIVE}
        setToggle={() => {
          setToggled(toggled === Token.HIVE ? Token.NONE : Token.HIVE);
        }}
        bottomLeft={
          <Text>
            <View style={{flexDirection: 'column'}}>
              <Text>$ {`${prices.hive.usd?.toFixed(2)}`}</Text>
              <Text
                style={{
                  color:
                    +prices.hive.usd_24h_change > 0 ? '#3BB26E' : '#B9122F',
                }}>{`${signedNumber(
                +prices.hive.usd_24h_change?.toFixed(2),
              )}%`}</Text>
            </View>
          </Text>
        }
        buttons={[
          <Send key="send_hive" currency="HIVE" />,
          <SendPowerUp key="pu" />,
          <SendConversion key="conversion" currency="HIVE" />,
          <BuyCoins
            key="buy_coins"
            currency={BuyCoinType.BUY_HIVE}
            iconColor={'#dd2e4b'}
          />,
        ]}
      />
      <Separator height={20} />
      <TokenDisplay
        color="#005C09"
        name="HIVE DOLLARS"
        currency="HBD"
        value={parseFloat(user.account.hbd_balance as string)}
        logo={<Hbd width={width / 15} />}
        price={prices.hive_dollar}
        toggled={toggled === Token.HBD}
        setToggle={() => {
          setToggled(toggled === Token.HBD ? Token.NONE : Token.HBD);
        }}
        bottomLeft={
          <Text>
            <View style={{flexDirection: 'column'}}>
              <Text>$ {`${prices.hive_dollar.usd?.toFixed(2)}`}</Text>
              <Text
                style={{
                  color:
                    +prices.hive_dollar.usd_24h_change > 0
                      ? '#3BB26E'
                      : '#B9122F',
                }}>{`${signedNumber(
                +prices.hive_dollar.usd_24h_change?.toFixed(2),
              )}%`}</Text>
            </View>
          </Text>
        }
        buttons={[
          <Send key="send_hbd" currency="HBD" />,
          <SendConversion key="conversion" currency="HBD" />,
          <BuyCoins
            key="buy_coins"
            currency={BuyCoinType.BUY_HDB}
            iconColor={'#3BB26E'}
          />,
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
        toggled={toggled === Token.HP}
        setToggle={() => {
          setToggled(toggled === Token.HP ? Token.NONE : Token.HP);
        }}
        buttons={[
          <SendDelegation key="del" />,
          <SendPowerDown key="pd" />,
          <View style={{width: 20}}></View>,
        ]}
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
        toggled={toggled === Token.SAVINGS}
        setToggle={() => {
          setToggled(toggled === Token.SAVINGS ? Token.NONE : Token.SAVINGS);
        }}
        bottomLeft={
          <View>
            <Text>
              <Text style={styles.apr}>HBD APR:</Text>
              <Text style={styles.aprValue}>
                {'   '}
                {properties.globals && properties.globals.hbd_interest_rate
                  ? `${properties.globals.hbd_interest_rate / 100}%`
                  : ''}
              </Text>
            </Text>

            {currentWithdrawingList.length > 0 && (
              <PendingSavingsWithdraw
                currentWithdrawingList={currentWithdrawingList}>
                <View>
                  <Text style={styles.apr}>
                    {translate(
                      'wallet.operations.savings.pending_withdraw.pending',
                    ).toUpperCase()}
                    :
                  </Text>
                  {totalPendingHIVESavingsWithdrawals > 0 && (
                    <Text style={styles.withdrawingValue}>
                      {`${totalPendingHIVESavingsWithdrawals.toFixed(
                        3,
                      )} ${getCurrency('HIVE')}`}
                    </Text>
                  )}
                  {totalPendingHBDSavingsWithdrawals > 0 && (
                    <Text style={styles.withdrawingValue}>
                      {`${totalPendingHBDSavingsWithdrawals.toFixed(
                        3,
                      )} ${getCurrency('HBD')}`}
                    </Text>
                  )}
                </View>
              </PendingSavingsWithdraw>
            )}
          </View>
        }
        buttons={[
          <SendWithdraw key="savings_withdraw" currency="HBD" />,
          <SendDeposit key="savings_deposit" currency="HBD" />,
          <View style={{width: 20}}></View>,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {width: '100%', flex: 1},
  apr: {color: '#7E8C9A', fontSize: 14},
  aprValue: {color: '#3BB26E', fontSize: 14},
  withdrawingValue: {color: '#b8343f', fontSize: 14},
  flexRowAligned: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const mapStateToProps = (state: RootState) => {
  return {
    user: state.activeAccount,
    userSavingsWithdrawRequests:
      state.activeAccount.account.savings_withdraw_requests,
    prices: state.currencyPrices,
    properties: state.properties,
  };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Primary);
