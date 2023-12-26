import CurrencyToken from 'components/hive/CurrencyToken';
import Icon from 'components/hive/Icon';
import IconHP from 'components/hive/IconHP';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getHBDButtonList} from 'src/reference-data/hbdOperationButtonList';
import {getHiveButtonList} from 'src/reference-data/hiveOperationButtonList';
import {getHPButtonList} from 'src/reference-data/hpOperationButtonList';
import {HBDICONBGCOLOR, HIVEICONBGCOLOR} from 'src/styles/colors';
import {RootState} from 'store';
import {logScreenView} from 'utils/analytics';
import {toHP} from 'utils/format';
import {getCurrency} from 'utils/hive';
import {translate} from 'utils/localize';

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
  const [delegationAmount, setDelegationAmount] = useState<string | number>(
    '...',
  );

  useEffect(() => {
    logScreenView('WalletScreen');
  }, []);

  useEffect(() => {
    if (user && Object.keys(user.account).length > 0) {
      const delegatedVestingShares = parseFloat(
        user.account.delegated_vesting_shares.toString().replace(' VESTS', ''),
      );
      const receivedVestingShares = parseFloat(
        user.account.received_vesting_shares.toString().replace(' VESTS', ''),
      );
      const delegationVestingShares = (
        receivedVestingShares - delegatedVestingShares
      ).toFixed(3);

      const delegation = toHP(delegationVestingShares, properties.globals);
      setDelegationAmount(delegation.toFixed(3));
    }
  }, [user.name]);

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
            name={Icons.HIVE_CURRENCY_LOGO}
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
            name={Icons.HBD_CURRENCY_LOGO}
            additionalContainerStyle={[
              styles.hiveIconContainer,
              styles.hbdIconBgColor,
            ]}
            {...styles.icon}
          />
        }
        buttons={getHBDButtonList(user, theme)}
      />
      <Separator height={10} />
      <CurrencyToken
        theme={theme}
        currencyName={getCurrency('HP')}
        value={toHP(user.account.vesting_shares as string, properties.globals)}
        subValue={delegationAmount as string}
        subValueShortDescription={translate('common.deleg')}
        currencyLogo={
          <IconHP theme={theme} additionalContainerStyle={{marginTop: 8}} />
        }
        buttons={getHPButtonList(theme, user.name!)}
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
    hbdIconBgColor: {
      backgroundColor: HBDICONBGCOLOR,
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
