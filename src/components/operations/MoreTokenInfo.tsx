import {loadTokenHistory} from 'actions/index';
import {Token, TokenBalance} from 'actions/interfaces';
import HistoryIcon from 'assets/wallet/icon_history_green.svg';
import CustomInput from 'components/form/CustomInput';
import Separator from 'components/ui/Separator';
import React from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import Balance from './Balance';
import Operation from './Operation';
import StakeToken from './StakeToken';
import UnstakeToken from './UnstakeToken';

export type MoreInfoTokenProps = {
  token: TokenBalance;
  tokenLogo: JSX.Element;
  tokenInfo: Token;
};
type Props = PropsFromRedux & MoreInfoTokenProps;
const MoreTokenInfo = ({
  user,
  token,
  tokenLogo,
  tokenInfo,
  history,
  loadTokenHistory,
}: Props) => {
  //   useEffect(() => {
  //     if (user.name) {
  //       loadTokenHistory(user.name, currency);
  //     }
  //   }, [loadTokenHistory, user.name, currency]);

  const handleClickIssuer = () => {
    if (tokenInfo.metadata) {
      try {
        const url = JSON.parse(tokenInfo.metadata).url;
        Linking.openURL(url);
      } catch (error) {
        console.log("Error trying to open token's Url. ", error);
      }
    }
  };

  const handleClickTokenOperation = (
    operation: 'stake_token' | 'unstake_token' | 'delegate_token',
  ) => {
    let modalParams: {name: string; modalContent: JSX.Element} = {
      name: '',
      modalContent: undefined,
    };
    switch (operation) {
      case 'stake_token':
        modalParams.name = 'StakeToken';
        modalParams.modalContent = (
          <StakeToken
            currency={token.symbol}
            tokenLogo={tokenLogo}
            balance={token.balance}
          />
        ); //TODO finish the component
        break;
      case 'unstake_token':
        modalParams.name = 'UnstakeToken';
        modalParams.modalContent = (
          <UnstakeToken
            currency={token.symbol}
            tokenLogo={tokenLogo}
            balance={token.stake}
          />
        ); //TODO finish component
        break;
      case 'delegate_token':
        modalParams.name = 'DelegateToken';
        modalParams.modalContent = <CustomInput />; //TODO code the Op component
        break;
      default:
        break;
    }
    if (
      modalParams.modalContent === null ||
      modalParams.modalContent === undefined
    )
      return;
    navigate('ModalScreen', modalParams);
  };

  return (
    <Operation
      logo={<HistoryIcon />} //TODO change to token info icon???
      title={translate('wallet.operations.more_token_info', {
        currency: token.symbol,
      })}>
      <>
        <Separator height={40} />
        <Balance
          currency={token.symbol}
          tokenBalance={token.balance}
          tokenLogo={tokenLogo}
          isHiveEngine
        />
        <Separator height={10} />
        <TouchableOpacity onPress={handleClickIssuer}>
          <Text>Click to visit @{tokenInfo.issuer}</Text>
        </TouchableOpacity>
        <Separator height={10} />
        <View>
          {tokenInfo.stakingEnabled && (
            <Text>
              {translate('wallet.operations.token_stake.title')}
              {' : '}
              {token.stake}
            </Text>
          )}
          {tokenInfo.delegationEnabled && (
            <Text>
              {translate('wallet.operations.token_delegation.in')}
              {' : '}
              {token.delegationsIn}
            </Text>
          )}
          {tokenInfo.delegationEnabled && (
            <Text>
              {translate('wallet.operations.token_delegation.out')}
              {' : '}
              {token.delegationsOut}
            </Text>
          )}
        </View>
        <Separator height={20} />
        <View style={styles.buttonsContainer}>
          {tokenInfo.stakingEnabled && (
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => handleClickTokenOperation('stake_token')}>
              <Text>{translate('wallet.operations.token_stake.title')}</Text>
            </TouchableOpacity>
          )}
          {tokenInfo.stakingEnabled && (
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => handleClickTokenOperation('unstake_token')}>
              <Text>{translate('wallet.operations.token_unstake.title')}</Text>
            </TouchableOpacity>
          )}
          {tokenInfo.delegationEnabled && (
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => handleClickTokenOperation('delegate_token')}>
              <Text>
                {translate('wallet.operations.token_delegation.title')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {/* <FlatList
          data={history}
          keyExtractor={(item) => item._id}
          renderItem={({item}) => {
            return (
              <Transfer
                transaction={item}
                user={user}
                token
                locale={getMainLocale()}
              />
            );
          }}
        /> */}
      </>
    </Operation>
  );
};
const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
      history: state.tokenHistory,
    };
  },
  {
    loadTokenHistory,
  },
);
type PropsFromRedux = ConnectedProps<typeof connector>;

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    padding: 6,
  },
});

export default connector(MoreTokenInfo);
