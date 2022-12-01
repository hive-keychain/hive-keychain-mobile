import {loadAccount} from 'actions/index';
import {Token, TokenBalance} from 'actions/interfaces';
import Delegate from 'assets/wallet/icon_delegate_dark.svg';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {
  getIncomingTokenDelegations,
  getOutgoingTokenDelegations,
  TokenDelegation,
} from 'utils/hiveEngine';
import {getCurrencyProperties} from 'utils/hiveReact';
import {translate} from 'utils/localize';
import Balance from './Balance';
import Operation from './Operation';

type Props = PropsFromRedux & {
  delegationType: string;
  total: string;
  token: TokenBalance;
  tokenLogo: JSX.Element;
  tokenInfo: Token;
};
//TODO remove unused redux,actions
const IncomingOutGoingTokenDelegations = ({
  delegationType,
  total,
  token,
  tokenLogo,
  user,
  tokenInfo,
  loadAccount,
  properties,
}: Props) => {
  //   const [to, setTo] = useState(delegatee || '');
  //   const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  //   const onDelegate = async () => {
  //     setLoading(true);

  //     Keyboard.dismiss();
  //     try {
  //       const delegation = await delegate(user.keys.active, {
  //         vesting_shares: sanitizeAmount(
  //           fromHP(sanitizeAmount(amount), properties.globals).toString(),
  //           'VESTS',
  //           6,
  //         ),
  //         delegatee: sanitizeUsername(to),
  //         delegator: user.account.name,
  //       });
  //       loadAccount(user.account.name, true);
  //       goBack();
  //       if (parseFloat(amount.replace(',', '.')) !== 0) {
  //         Toast.show(translate('toast.delegation_success'), Toast.LONG);
  //       } else {
  //         Toast.show(translate('toast.stop_delegation_success'), Toast.LONG);
  //       }
  //     } catch (e) {
  //       Toast.show(`Error : ${(e as any).message}`, Toast.LONG);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  ////
  const [totalDelegated, setTotalDelegated] = useState<string | number>('...');
  const [delegationList, setDelegationList] = useState<TokenDelegation[]>([]);
  const [toogleUnDelegateMenu, setToogleUnDelegateMenu] = useState(false);

  useEffect(() => {
    setLoading(true);
    init();
  }, []);

  const init = async () => {
    let delegations: TokenDelegation[];

    if (delegationType === 'incoming') {
      delegations = await getIncomingTokenDelegations(user.name!, token.symbol);
    } else {
      delegations = await getOutgoingTokenDelegations(user.name!, token.symbol);
    }

    setDelegationList(delegations);
    setLoading(false);
    // const balance =
    //   delegationType === DelegationType.INCOMING
    //     ? tokenBalance.delegationsIn
    //     : tokenBalance.delegationsOut;

    // setTotal(
    //   FormatUtils.withCommas(
    //     balance,
    //     FormatUtils.hasMoreThanXDecimal(parseFloat(balance), 3) ? 8 : 3,
    //   ),
    // );
  };
  ////

  const {color} = getCurrencyProperties(token.symbol);
  const styles = getDimensionedStyles(color);

  return (
    <Operation
      logo={<Delegate />} //TODO change logo
      title={translate(`wallet.operations.token_delegation.${delegationType}`)}>
      <>
        {delegationType === 'outgoing' && (
          <Text style={{marginTop: 5}}>
            {translate(
              'wallet.operations.token_delegation.undelegation_cooldown_disclaimer',
              {
                symbol: token.symbol,
                undelegationCooldown: tokenInfo.undelegationCooldown,
              },
            )}
          </Text>
        )}
        <Separator />
        <Balance
          currency={token.symbol}
          account={user.account}
          globalProperties={properties.globals}
          isHiveEngine
          //   setMax={(value: string) => {
          //     setAmount(value);
          //   }}
          tokenLogo={tokenLogo}
          tokenBalance={total}
        />
        {loading && <Loader animating={true} />}
        {/* //TODO bellow:
              //I think may be easier using a flatlist so the listFinalItem, can be condionally renderItem
              //and it will be more organised. */}
        {!loading &&
          delegationList.length > 0 &&
          delegationList.map((tokenDelegation) => {
            return (
              <View style={styles.delegationItemContainer}>
                <Text>
                  @
                  {delegationType === 'incoming'
                    ? tokenDelegation.from
                    : tokenDelegation.to}
                </Text>
                <Text>
                  {tokenDelegation.quantity} {token.symbol}
                </Text>
                {/* //temporary for now */}
                {/* {
                    delegationType === 'outgoing' &&
                } */}
              </View>
            );
          })}

        {/* <Separator />
        <OperationInput
          placeholder={translate('common.username').toUpperCase()}
          leftIcon={<AccountLogoDark />}
          autoCapitalize="none"
          value={to}
          onChangeText={setTo}
        />
        <Separator />
        <OperationInput
          placeholder={'0.000'}
          keyboardType="decimal-pad"
          rightIcon={<Text style={styles.currency}>{currency}</Text>}
          textAlign="right"
          value={amount}
          onChangeText={setAmount}
        />

        <Separator height={40} />
        <ActiveOperationButton
          title={translate('common.send')}
          onPress={onDelegate}
          style={styles.button}
          isLoading={loading}
        /> */}
      </>
    </Operation>
  );
};

const getDimensionedStyles = (color: string) =>
  StyleSheet.create({
    button: {backgroundColor: '#68A0B4'},
    currency: {fontWeight: 'bold', fontSize: 18, color},
    delegationItemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 6,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      properties: state.properties,
      user: state.activeAccount,
    };
  },
  {loadAccount},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(IncomingOutGoingTokenDelegations);
function getIncomingDelegations(
  symbol: string,
  arg1: string,
): TokenDelegation[] | PromiseLike<TokenDelegation[]> {
  throw new Error('Function not implemented.');
}
