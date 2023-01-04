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
import {withCommas} from 'utils/format';
import {translate} from 'utils/localize';
import {goBack, navigate} from 'utils/navigation';
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
  gobackAction?: () => void;
};
type Props = PropsFromRedux & MoreInfoTokenProps;
const MoreTokenInfo = ({
  user,
  token,
  tokenLogo,
  tokenInfo,
  history,
  gobackAction,
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

  const navigateToModalScreen = () => {
    navigate('ModalScreen', {
      name: 'EngineTokenInfo',
      modalContent: (
        <MoreTokenInfo
          user={user}
          token={token}
          tokenLogo={tokenLogo}
          history={history}
          loadTokenHistory={loadTokenHistory}
          tokenInfo={tokenInfo}
          gobackAction={() => goBack()}
        />
      ),
    });
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
            gobackAction={navigateToModalScreen}
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
            gobackAction={navigateToModalScreen}
          />
        );
        break;
      case 'delegate_token':
        modalParams.name = 'DelegateToken';
        modalParams.modalContent = (
          <DelegateToken
            currency={token.symbol}
            tokenLogo={tokenLogo}
            balance={(
              parseFloat(token.stake) - parseFloat(token.pendingUnstake)
            ).toString()}
            gobackAction={navigateToModalScreen}
          />
        );
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
          gobackAction={navigateToModalScreen}
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
          <Text>By @{tokenInfo.issuer}</Text>
        </TouchableOpacity>
        <Separator height={10} />
        <View>
          {tokenInfo.stakingEnabled && (
            <Text>
              <Text style={styles.textBold}>
                {translate('wallet.operations.token_stake.titled')}
                {' : '}
              </Text>
              <Text>
                {withCommas(token.stake)} {tokenInfo.symbol}
              </Text>
            </Text>
          )}
          {tokenInfo.stakingEnabled && parseFloat(token.pendingUnstake) > 0 && (
            <Text>
              <Text style={styles.textBold}>
                {translate(
                  'wallet.operations.token_unstake.token_pending_unstake',
                )}
                {' : '}
              </Text>
              <Text>
                {withCommas(token.pendingUnstake)} {tokenInfo.symbol}
              </Text>
            </Text>
          )}
          {tokenInfo.delegationEnabled && parseFloat(token.delegationsIn) > 0 && (
            <View style={styles.delegationInOutContainer}>
              <Text>
                <Text style={styles.textBold}>
                  {translate('wallet.operations.token_delegation.in')}
                  {' : '}
                </Text>
                <Text>
                  {withCommas(token.delegationsIn)} {tokenInfo.symbol}
                </Text>
              </Text>
              <TouchableOpacity
                onPress={() =>
                  handleIncomingOutGoingTokenDelegations('Incoming')
                }>
                <ListBlackIcon />
              </TouchableOpacity>
            </View>
          )}
          {tokenInfo.delegationEnabled && parseFloat(token.delegationsOut) > 0 && (
            <View style={styles.delegationInOutContainer}>
              <Text>
                <Text style={styles.textBold}>
                  {translate('wallet.operations.token_delegation.out')}
                  {' : '}
                </Text>
                <Text>
                  {withCommas(token.delegationsOut)} {tokenInfo.symbol}
                </Text>
              </Text>
              <TouchableOpacity
                onPress={() =>
                  handleIncomingOutGoingTokenDelegations('Outgoing')
                }>
                <ListBlackIcon />
              </TouchableOpacity>
            </View>
          )}
          {tokenInfo.delegationEnabled &&
            parseFloat(token.pendingUndelegations) > 0 && (
              <Text>
                <Text style={styles.textBold}>
                  {translate(
                    'wallet.operations.token_delegation.token_pending_undelegation',
                  )}
                  {' : '}
                </Text>
                <Text>
                  {withCommas(token.pendingUndelegations)} {tokenInfo.symbol}
                </Text>
              </Text>
            )}
        </View>
        <Separator height={20} />
        <View style={styles.buttonsContainer}>
          {tokenInfo.stakingEnabled && (
            <ActiveOperationButton
              title={translate('wallet.operations.token_stake.title')}
              onPress={() => handleClickTokenOperation('stake_token')}
              style={styles.button}
              isLoading={false}
            />
          )}
          {tokenInfo.stakingEnabled && (
            <ActiveOperationButton
              title={translate('wallet.operations.token_unstake.title')}
              onPress={() => handleClickTokenOperation('unstake_token')}
              style={styles.button}
              isLoading={false}
            />
          )}
          {tokenInfo.delegationEnabled && (
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBackButton: {
    margin: 7,
  },
  textBold: {
    fontWeight: 'bold',
  },
});

export default connector(MoreTokenInfo);
