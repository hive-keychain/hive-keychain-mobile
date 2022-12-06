import {loadTokenHistory} from 'actions/index';
import {Token, TokenBalance} from 'actions/interfaces';
import AddIcon from 'assets/wallet/icon_add_circle_outline.svg';
import ListBlackIcon from 'assets/wallet/icon_list_black.svg';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import Separator from 'components/ui/Separator';
import React from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import Balance from './Balance';
import DelegateToken from './DelegateToken';
import IncomingOutGoingTokenDelegations from './IncomingOutGoingTokenDelegations';
import Operation from './Operation';
import StakeToken from './StakeToken';
import UnstakeToken from './UnstakeToken';

type TokenDelegationType = 'Outgoing' | 'Incoming';

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
    let availableBalance = 0;
    switch (operation) {
      case 'stake_token':
        availableBalance =
          parseFloat(token.balance) - parseFloat(token.delegationsIn);
        modalParams.name = 'StakeToken';
        modalParams.modalContent = (
          <StakeToken
            currency={token.symbol}
            tokenLogo={tokenLogo}
            balance={availableBalance.toString()}
          />
        );
        break;
      case 'unstake_token':
        modalParams.name = 'UnstakeToken';
        modalParams.modalContent = (
          <UnstakeToken
            currency={token.symbol}
            tokenLogo={tokenLogo}
            balance={token.stake}
            tokenInfo={tokenInfo}
          />
        ); //TODO finish component
        break;
      case 'delegate_token':
        availableBalance =
          parseFloat(token.stake) - parseFloat(token.delegationsOut);
        modalParams.name = 'DelegateToken';
        modalParams.modalContent = (
          <DelegateToken
            currency={token.symbol}
            tokenLogo={tokenLogo}
            balance={availableBalance.toString()}
          />
        ); //TODO finish component
        //TODO add 'undelegate_token' + component + icon
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

  const handleIncomingOutGoingTokenDelegations = (
    showTokenDelegations: TokenDelegationType,
  ) => {
    navigate('ModalScreen', {
      name: `Show${showTokenDelegations}TokenDelegations`,
      modalContent: (
        <IncomingOutGoingTokenDelegations
          delegationType={showTokenDelegations.toLowerCase()}
          total={
            showTokenDelegations === 'Incoming'
              ? token.delegationsIn
              : token.delegationsOut
          }
          token={token}
          tokenLogo={tokenLogo}
          tokenInfo={tokenInfo}
        />
      ),
    });
  };

  return (
    <Operation logo={<AddIcon />} title={token.symbol}>
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
          <Text>@{tokenInfo.issuer}</Text>
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
          {/* //TODO add pendingStake if any. */}
          {/* token.stakingEnabled &&
              parseFloat(tokenBalance.pendingUnstake) > 0 && ( */}
          {tokenInfo.delegationEnabled && (
            <View style={styles.delegationInOutContainer}>
              <Text>
                {translate('wallet.operations.token_delegation.in')}
                {' : '}
                {token.delegationsIn}
              </Text>
              {/* //TODO here incomming/outgoing token delegation list component (one component plz) */}
              {parseFloat(token.delegationsIn) > 0 && (
                <TouchableOpacity
                  onPress={() =>
                    handleIncomingOutGoingTokenDelegations('Incoming')
                  }>
                  <ListBlackIcon />
                </TouchableOpacity>
              )}
            </View>
          )}
          {tokenInfo.delegationEnabled && (
            <View style={styles.delegationInOutContainer}>
              <Text>
                {translate('wallet.operations.token_delegation.out')}
                {' : '}
                {token.delegationsOut}
              </Text>
              {/* //TODO here incomming/outgoing token delegation list component (one component plz) */}
              {parseFloat(token.delegationsOut) > 0 && (
                <TouchableOpacity
                  onPress={() =>
                    handleIncomingOutGoingTokenDelegations('Outgoing')
                  }>
                  <ListBlackIcon />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
        <Separator height={20} />
        <View style={styles.buttonsContainer}>
          {tokenInfo.stakingEnabled && (
            // <TouchableOpacity
            //   style={styles.buttonContainer}
            //   onPress={() => handleClickTokenOperation('stake_token')}>
            //   <Text>{translate('wallet.operations.token_stake.title')}</Text>
            // </TouchableOpacity>
            <ActiveOperationButton
              title={translate('wallet.operations.token_stake.title')}
              onPress={() => handleClickTokenOperation('stake_token')}
              style={styles.button}
              isLoading={false}
            />
          )}
          {tokenInfo.stakingEnabled && (
            // <TouchableOpacity
            //   style={styles.buttonContainer}
            //   onPress={() => handleClickTokenOperation('unstake_token')}>
            //   <Text>{translate('wallet.operations.token_unstake.title')}</Text>
            // </TouchableOpacity>
            <ActiveOperationButton
              title={translate('wallet.operations.token_unstake.title')}
              onPress={() => handleClickTokenOperation('unstake_token')}
              style={styles.button}
              isLoading={false}
            />
          )}
          {tokenInfo.delegationEnabled && (
            // <TouchableOpacity
            //   style={styles.buttonContainer}
            //   onPress={() => handleClickTokenOperation('delegate_token')}>
            //   <Text>
            //     {translate('wallet.operations.token_delegation.title')}
            //   </Text>
            // </TouchableOpacity>
            <ActiveOperationButton
              title={translate('wallet.operations.token_delegation.title')}
              onPress={() => handleClickTokenOperation('delegate_token')}
              style={styles.button}
              isLoading={false}
            />
          )}
        </View>
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
  delegationInOutContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {backgroundColor: '#68A0B4', width: 100},
});

export default connector(MoreTokenInfo);
