import {Token, TokenBalance} from 'actions/interfaces';
import Icon from 'components/hive/Icon';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {getSeparatorLineStyle} from 'src/styles/line';
import {
  title_primary_body_2,
  title_secondary_body_3,
} from 'src/styles/typography';
import {TokenDelegation} from 'utils/hiveEngine';
import {translate} from 'utils/localize';
import {goBack, navigate} from 'utils/navigation';
import CancelTokenDelegation, {
  CancelTokenDelegationOperationProps,
} from './Cancel-token-delegation';
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
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

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
    //OLD way
    // if (parseFloat(amount) <= 0) return handleCancelTokenDelegation();

    // const availableBalance =
    //   parseFloat(token.stake) - parseFloat(token.delegationsOut);
    // navigate('ModalScreen', {
    //   name: 'DelegateToken',
    //   modalContent: (
    //     <DelegateToken
    //       currency={token.symbol}
    //       tokenLogo={tokenLogo}
    //       balance={availableBalance.toString()}
    //       sendTo={tokenDelegation.to}
    //       delegateAmount={amount}
    //       update={true}
    //     />
    //   ),
    // });
    //end Oldway

    //NEW Way //TODO cleanup
    if (parseFloat(amount) <= 0) {
      navigate('Operation', {
        operation: 'cancel_delegation',
        props: {
          currency: token.symbol,
          amount: tokenDelegation.quantity,
          engine: true,
          tokenLogo: tokenLogo,
          from: tokenDelegation.to,
        } as CancelTokenDelegationOperationProps,
      });
    }
  };

  const styles = getStyles(theme);

  return (
    <View
      style={[styles.container, isExpanded ? styles.expandedContainer : null]}>
      {isOutGoingDelegation ? (
        <>
          <View style={styles.delegationItemContainer}>
            <Text style={[styles.textItem, styles.lowerOpacity]}>
              @{tokenDelegation.to}
            </Text>
            {!editMode ? (
              <View style={styles.flexRow}>
                <Text style={styles.textItem}>
                  {tokenDelegation.quantity} {tokenDelegation.symbol}
                </Text>
                <Icon
                  name="expand_thin"
                  theme={theme}
                  onClick={() => setIsExpanded(!isExpanded)}
                  additionalContainerStyle={[
                    styles.marginLeft,
                    isExpanded ? styles.iconXAxisInverted : null,
                  ]}
                  {...styles.smallIcon}
                />
              </View>
            ) : (
              <View style={[styles.flexRow, styles.flexEnd]}>
                <TextInput
                  style={styles.customInputStyle}
                  value={amount}
                  onChangeText={updateAmount}
                  keyboardType="decimal-pad"
                />
                <View style={[styles.flexRow, styles.marginLeft]}>
                  <Icon
                    name="check"
                    theme={theme}
                    onClick={() => handleUpdateDelegateToken()}
                  />
                  <Icon
                    name="close_circle"
                    theme={theme}
                    additionalContainerStyle={styles.marginLeft}
                    onClick={() => setEditMode(false)}
                  />
                </View>
              </View>
            )}

            {/* //TODO finish to have same use for isEditMode. */}
            {/* {!editMode ? (
            <View style={styles.buttonRowContainer}>
              <Icon
                name="edit"
                theme={theme}
                onClick={() => setEditMode(!editMode)}
                additionalContainerStyle={styles.roundButton}
                {...styles.icon}
              />
              <Icon
                name="gift_delete"
                theme={theme}
                onClick={() => handleCancelTokenDelegation()}
                additionalContainerStyle={styles.roundButton}
                {...styles.icon}
              />
            </View>
          ) : (
            <View style={styles.buttonRowContainer}>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={handleUpdateDelegateToken}>
                <Text>OK</Text>
              </TouchableOpacity>
            </View>
          )} */}
          </View>
          {isExpanded && (
            <>
              <Separator
                drawLine
                // height={0.5}
                additionalLineStyle={getSeparatorLineStyle(theme, 0.5).itemLine}
              />
              <View style={styles.buttonRowContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.marginRight]}
                  onPress={() => setEditMode(!editMode)}>
                  <Icon
                    name="edit"
                    theme={theme}
                    additionalContainerStyle={styles.roundButton}
                    {...styles.icon}
                  />
                  <Text style={styles.buttonText}>
                    {translate('common.edit')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleCancelTokenDelegation()}>
                  <Icon
                    name="gift_delete"
                    theme={theme}
                    additionalContainerStyle={styles.roundButton}
                    {...styles.icon}
                  />
                  <Text style={styles.buttonText}>
                    {translate('common.delete')}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </>
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
      marginBottom: 9,
      borderRadius: 66,
      borderWidth: 1,
      borderColor: getColors(theme).quaternaryCardBorderColor,
    },
    delegationItemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 19,
      paddingHorizontal: 15,
    },
    customInputStyle: {
      width: '40%',
      borderWidth: 1,
      marginTop: 4,
      marginBottom: 4,
      borderRadius: 8,
      marginLeft: 4,
      padding: 6,
      color: getColors(theme).secondaryText,
      borderColor: getColors(theme).quaternaryCardBorderColor,
    },
    buttonRowContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 10,
    },
    smallButton: {
      marginVertical: 3,
      paddingVertical: 5,
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    flexEnd: {justifyContent: 'flex-end'},
    textItem: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
    },
    marginRight: {
      marginRight: 3,
    },
    lowerOpacity: {
      opacity: 0.7,
    },
    roundButton: {
      borderWidth: 1,
      borderColor: getColors(theme).quinaryCardBorderColor,
      borderRadius: 100,
      width: 25,
      height: 25,
    },
    icon: {
      width: 18,
      height: 18,
    },
    smallIcon: {
      width: 12,
      height: 12,
    },
    iconXAxisInverted: {
      transform: [{rotateX: '180deg'}],
    },
    marginLeft: {
      marginLeft: 8,
    },
    //TODO move to its own reusable component
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '30%',
      borderRadius: 12,
      borderWidth: 1,
      justifyContent: 'center',
      paddingVertical: 10,
      borderColor: getColors(theme).quaternaryCardBorderColor,
    },
    buttonText: {
      color: getColors(theme).secondaryText,
      ...title_secondary_body_3,
      marginLeft: 8,
    },
    expandedContainer: {
      paddingVertical: 10,
      borderRadius: 40,
    },
  });

export default IncomingOutGoingTokenDelegationItem;
