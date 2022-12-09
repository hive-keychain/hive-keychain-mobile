import {Token, TokenBalance} from 'actions/interfaces';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ClearIcon from 'src/assets/wallet/icon_delete_black.svg';
import EditIcon from 'src/assets/wallet/icon_edit_black.svg';
import {TokenDelegation} from 'utils/hiveEngine';
import {goBack, navigate} from 'utils/navigation';
import CancelTokenDelegation from './Cancel-token-delegation';
import DelegateToken from './DelegateToken';
import MoreTokenInfo from './MoreTokenInfo';

type Props = {
  tokenDelegation: TokenDelegation;
  delegationType: string;
  tokenLogo: JSX.Element;
  token: TokenBalance;
  tokenInfo: Token;
};

const IncomingOutGoingTokenDelegationItem = ({
  tokenDelegation,
  delegationType,
  tokenLogo,
  token,
  tokenInfo,
}: Props) => {
  const [isOutGoingDelegation, setIsOutGoingDelegation] = useState(
    delegationType === 'outgoing',
  );
  const [editMode, setEditMode] = useState(false);
  const [amount, setAmount] = useState(tokenDelegation.quantity);

  const updateAmount = (value: string) => {
    setAmount(value);
  };

  const navigateToModalScreen = () => {
    navigate('ModalScreen', {
      name: 'EngineTokenInfo',
      modalContent: (
        <MoreTokenInfo
          token={token}
          tokenLogo={tokenLogo}
          tokenInfo={tokenInfo}
          gobackAction={() => goBack()}
        />
      ),
    });
  };

  const handleCancelTokenDelegation = () => {
    navigate('ModalScreen', {
      name: 'DelegateToken',
      modalContent: (
        <CancelTokenDelegation
          currency={token.symbol}
          tokenLogo={tokenLogo}
          amount={tokenDelegation.quantity}
          from={tokenDelegation.to}
          gobackAction={navigateToModalScreen}
        />
      ),
    });
  };

  const handleUpdateDelegateToken = () => {
    if (parseFloat(amount) <= 0) return handleCancelTokenDelegation();

    const availableBalance =
      parseFloat(token.stake) - parseFloat(token.delegationsOut);
    navigate('ModalScreen', {
      name: 'DelegateToken',
      modalContent: (
        <DelegateToken
          currency={token.symbol}
          tokenLogo={tokenLogo}
          balance={availableBalance.toString()}
          sendTo={tokenDelegation.to}
          delegateAmount={amount}
          update={true}
        />
      ),
    });
  };

  return (
    <View style={styles.container}>
      {isOutGoingDelegation ? (
        <View style={styles.delegationItemContainer}>
          <Text>@{tokenDelegation.to}</Text>
          {!editMode ? (
            <Text>
              {tokenDelegation.quantity} {tokenDelegation.symbol}
            </Text>
          ) : (
            <TextInput
              style={styles.customInputStyle}
              value={amount}
              onChangeText={updateAmount}
            />
          )}
          {!editMode ? (
            <View style={styles.buttonRowContainer}>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => setEditMode(!editMode)}>
                <EditIcon />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={handleCancelTokenDelegation}>
                <ClearIcon />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonRowContainer}>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={handleUpdateDelegateToken}>
                <Text>OK</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={() => setEditMode(!editMode)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.delegationItemContainer}>
          <Text>@{tokenDelegation.from}</Text>
          <Text>
            {tokenDelegation.quantity} {tokenDelegation.symbol}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  delegationItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  customInputStyle: {
    width: '40%',
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 4,
    borderRadius: 8,
    marginLeft: 4,
    padding: 6,
  },
  buttonRowContainer: {
    flexDirection: 'row',
  },
  smallButton: {
    borderWidth: 1,
    borderRadius: 6,
    margin: 3,
    width: 25,
    height: 25,
  },
});

export default IncomingOutGoingTokenDelegationItem;
