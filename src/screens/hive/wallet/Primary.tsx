import Savings from 'assets/wallet/icon_savings.svg';
import CurrencyToken from 'components/hive/CurrencyToken';
import Icon from 'components/hive/Icon';
import IconHP from 'components/hive/IconHP';
import TokenDisplay from 'components/hive/TokenDisplay';
import {
  PendingSavingsWithdraw,
  SendDelegation,
  SendDeposit,
  SendPowerDown,
  SendWithdraw,
} from 'components/operations/OperationsButtons';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {SavingsWithdrawal} from 'src/interfaces/savings.interface';
import {getHBDButtonList} from 'src/reference-data/hbdOperationButtonList';
import {getHiveButtonList} from 'src/reference-data/hiveOperationButtonList';
import {
  DARKER_RED_COLOR,
  HBDICONBGCOLOR,
  HIVEICONBGCOLOR,
  getColors,
} from 'src/styles/colors';
import {title_secondary_body_2} from 'src/styles/typography';
import {RootState} from 'store';
import {logScreenView} from 'utils/analytics';
import {toHP, withCommas} from 'utils/format';
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

interface Props {
  theme: Theme;
}

const Primary = ({
  user,
  prices,
  properties,
  userSavingsWithdrawRequests,
  theme,
}: PropsFromRedux & Props) => {
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
  const styles = getStyles(theme);
  //TODO bellow cleanup
  return (
    <View style={styles.container}>
      <Separator height={20} />
      {/* <Separator height={30} />
      <AccountValue
        account={user.account}
        prices={prices}
        properties={properties}
      />
      <Separator height={30} /> */}
      {/* //TODO fix all bellow when not engine tokens */}
      <CurrencyToken
        theme={theme}
        currencyName="HIVE"
        value={parseFloat(user.account.balance as string)}
        subValue={
          parseFloat(user.account.savings_balance as string) > 0
            ? (user.account.savings_balance as string).split(' ')[0]
            : undefined
        }
        currencyLogo={
          <Icon
            theme={theme}
            name="hive_currency_logo"
            additionalContainerStyle={styles.hiveIconContainer}
            {...styles.icon}
          />
        }
        buttons={getHiveButtonList(user, theme)}
      />
      {/* <TokenDisplay
        renderButtonOptions
        theme={theme}
        using_new_ui
        color="#A3112A"
        name="HIVE"
        currency="HIVE"
        value={parseFloat(user.account.balance as string)}
        totalValue={parseFloat(user.account.balance as string)}
        logo={
          <Icon
            theme={theme}
            name="hive_currency_logo"
            additionalContainerStyle={styles.hiveIconContainer}
            {...styles.icon}
          />
        }
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
          <Send key="send_hive" currency="HIVE" theme={theme} />,
          <SendPowerUp key="pu" />,
          <SendConversion key="conversion" currency="HIVE" />,
          <BuyCoins
            key="buy_coins"
            currency={BuyCoinType.BUY_HIVE}
            iconColor={'#dd2e4b'}
          />,
        ]}
      /> */}
      <Separator height={10} />
      <CurrencyToken
        theme={theme}
        currencyName="HBD"
        value={parseFloat(user.account.hbd_balance as string)}
        subValue={
          parseFloat(user.account.savings_hbd_balance as string) > 0
            ? (user.account.savings_hbd_balance as string).split(' ')[0]
            : undefined
        }
        currencyLogo={
          <Icon
            theme={theme}
            name="hbd_currency_logo"
            additionalContainerStyle={styles.hiveIconContainer}
            {...styles.icon}
          />
        }
        buttons={getHBDButtonList(user, theme)}
      />
      {/* <TokenDisplay
        theme={theme}
        using_new_ui
        color="#005C09"
        name="HIVE DOLLARS"
        currency="HBD"
        value={parseFloat(user.account.hbd_balance as string)}
        totalValue={parseFloat(user.account.hbd_balance as string)}
        logo={
          <Icon
            theme={theme}
            name="hbd_currency_logo"
            additionalContainerStyle={styles.hbdIconContainer}
            {...styles.icon}
          />
        }
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
          <Send key="send_hbd" currency="HBD" theme={theme} />,
          <SendConversion key="conversion" currency="HBD" />,
          <BuyCoins
            key="buy_coins"
            currency={BuyCoinType.BUY_HDB}
            iconColor={'#3BB26E'}
          />,
        ]}
      /> */}
      <Separator height={10} />
      <TokenDisplay
        theme={theme}
        using_new_ui
        color="#AC4F00"
        name="HIVE POWER"
        currency="HP"
        value={toHP(user.account.vesting_shares as string, properties.globals)}
        totalValue={toHP(
          user.account.vesting_shares as string,
          properties.globals,
        )}
        incoming={toHP(
          user.account.received_vesting_shares as string,
          properties.globals,
        )}
        outgoing={toHP(
          user.account.delegated_vesting_shares as string,
          properties.globals,
        )}
        logo={<IconHP theme={theme} />}
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
      <Separator height={10} />
      <TokenDisplay
        theme={theme}
        using_new_ui
        color="#7E8C9A"
        name={translate('common.savings').toUpperCase()}
        currency="HIVE"
        value={parseFloat(user.account.savings_balance as string)}
        totalValue={parseFloat(user.account.savings_balance as string)}
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
                      {`${withCommas(
                        totalPendingHIVESavingsWithdrawals.toFixed(3),
                      )} ${getCurrency('HIVE')}`}
                    </Text>
                  )}
                  {totalPendingHBDSavingsWithdrawals > 0 && (
                    <Text style={styles.withdrawingValue}>
                      {`${withCommas(
                        totalPendingHBDSavingsWithdrawals.toFixed(3),
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

const getStyles = (theme: Theme) =>
  //TODO bellow cleanup styles
  StyleSheet.create({
    container: {width: '100%'},
    apr: {color: '#7E8C9A', fontSize: 14},
    aprValue: {color: '#3BB26E', fontSize: 14},
    withdrawingValue: {color: '#b8343f', fontSize: 14},
    flexRowAligned: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      width: 20,
      height: 20,
    },
    hiveIconContainer: {
      borderRadius: 50,
      padding: 5,
      backgroundColor: HIVEICONBGCOLOR,
    },
    hbdIconContainer: {
      borderRadius: 50,
      padding: 5,
      backgroundColor: HBDICONBGCOLOR,
    },
    squareButton: {
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).cardBorderColorContrast,
      borderWidth: 1,
      borderRadius: 11,
      width: '30%',
      height: 'auto',
      paddingHorizontal: 22,
      paddingVertical: 15,
    },
    redBackground: {
      backgroundColor: DARKER_RED_COLOR,
    },
    roundedIconContainer: {
      borderWidth: 1,
      borderColor: '#FFF',
      borderRadius: 50,
      padding: 1,
      marginRight: 3,
    },
    roundedIcon: {
      borderWidth: 1,
      borderColor: getColors(theme).cardBorderColorContrast,
      borderRadius: 50,
      padding: 0,
      marginRight: 3,
    },
    squareButtonTextWhite: {
      color: '#FFF',
      ...title_secondary_body_2,
      fontSize: 9,
    },
    whiteText: {color: '#FFF'},
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
