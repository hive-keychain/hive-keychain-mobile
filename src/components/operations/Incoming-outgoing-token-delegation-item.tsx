import {Token, TokenBalance} from 'actions/interfaces';
import Icon from 'components/hive/Icon';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ClearIcon from 'src/assets/wallet/icon_delete_black.svg';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {title_primary_body_2} from 'src/styles/typography';
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
  theme: Theme;
};

const IncomingOutGoingTokenDelegationItem = ({
  tokenDelegation,
  delegationType,
  tokenLogo,
  token,
  tokenInfo,
  theme,
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
    //TODO check what to do/update bellow
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
    //TODO update bellow using Operation Stack...
    navigate('ModalScreen', {
      name: 'CancelDelegateToken',
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

  const styles = getStyles(theme);

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
              {/* <TouchableOpacity
                style={styles.smallButton}
                onPress={() => setEditMode(!editMode)}>
                <EditIcon />
              </TouchableOpacity> */}
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
            </View>
          )}
        </View>
      ) : (
        <View style={styles.delegationItemContainer}>
          <View style={styles.flexRow}>
            <Icon
              name="at"
              theme={theme}
              width={15}
              height={15}
              additionalContainerStyle={styles.marginRight}
            />
            <Text style={styles.textItem}>{tokenDelegation.from}</Text>
          </View>
          <Text style={styles.textItem}>
            {tokenDelegation.quantity} {tokenDelegation.symbol}
          </Text>
        </View>
      )}
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    delegationItemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 19,
      paddingHorizontal: 15,
      borderRadius: 66,
      borderWidth: 1,
      borderColor: getColors(theme).quaternaryCardBorderColor,
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
      marginVertical: 3,
      paddingVertical: 5,
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textItem: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
    },
    marginRight: {
      marginRight: 3,
    },
  });

export default IncomingOutGoingTokenDelegationItem;
