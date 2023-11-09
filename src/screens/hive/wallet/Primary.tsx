import CurrencyToken from 'components/hive/CurrencyToken';
import Icon from 'components/hive/Icon';
import IconHP from 'components/hive/IconHP';
import TokenDisplay from 'components/hive/TokenDisplay';
import {
  SendDelegation,
  SendPowerDown,
} from 'components/operations/OperationsButtons';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {getHBDButtonList} from 'src/reference-data/hbdOperationButtonList';
import {getHiveButtonList} from 'src/reference-data/hiveOperationButtonList';
import {HIVEICONBGCOLOR} from 'src/styles/colors';
import {RootState} from 'store';
import {logScreenView} from 'utils/analytics';
import {toHP} from 'utils/format';
import {getCurrency} from 'utils/hive';

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

const Primary = ({user, prices, properties, theme}: PropsFromRedux & Props) => {
  const {width} = useWindowDimensions();
  const [toggled, setToggled] = useState(Token.NONE);

  useEffect(() => {
    logScreenView('WalletScreen');
  }, []);

  const styles = getStyles();

  return (
    <View style={styles.container}>
      <Separator height={20} />
      <CurrencyToken
        theme={theme}
        currencyName={getCurrency('HIVE')}
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
      <Separator height={10} />
      <CurrencyToken
        theme={theme}
        currencyName={getCurrency('HBD')}
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
      <Separator height={10} />
      <TokenDisplay
        theme={theme}
        using_new_ui
        color="#AC4F00"
        name="HIVE POWER"
        currency={getCurrency('HP')}
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
    </View>
  );
};

const getStyles = () =>
  StyleSheet.create({
    container: {width: '100%'},
    icon: {
      width: 20,
      height: 20,
    },
    hiveIconContainer: {
      borderRadius: 50,
      padding: 5,
      backgroundColor: HIVEICONBGCOLOR,
    },
  });

const mapStateToProps = (state: RootState) => {
  return {
    user: state.activeAccount,
    prices: state.currencyPrices,
    properties: state.properties,
  };
};
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Primary);
