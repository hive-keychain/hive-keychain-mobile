import {TokenBalance} from 'actions/interfaces';
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
import {Icons} from 'src/enums/icons.enums';
import {Token} from 'src/interfaces/tokens.interface';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getSeparatorLineStyle} from 'src/styles/line';
import {
  title_primary_body_2,
  title_secondary_body_3,
} from 'src/styles/typography';
import {withCommas} from 'utils/format';
import {TokenDelegation} from 'utils/hiveEngine';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {CancelTokenDelegationOperationProps} from './Cancel-token-delegation';
import {DelegateTokenOperationProps} from './DelegateToken';
import {TokenDelegationType} from './MoreTokenInfo';

type Props = {
  tokenDelegation: TokenDelegation;
  delegationType: TokenDelegationType;
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
    delegationType === 'Outgoing',
  );
  const [editMode, setEditMode] = useState(false);
  const [amount, setAmount] = useState(tokenDelegation.quantity);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [cancelledSuccessfully, setCancelledSuccessfully] = useState(false);

  const updateAmount = (value: string) => {
    setAmount(value);
  };

  const handleCancelTokenDelegation = () => {
    navigate('Operation', {
      operation: 'cancel_delegation',
      props: {
        currency: token.symbol,
        amount: tokenDelegation.quantity,
        engine: true,
        tokenLogo: tokenLogo,
        from: tokenDelegation.to,
        setCancelledSuccessfully: (value) => setCancelledSuccessfully(value),
      } as CancelTokenDelegationOperationProps,
    });
  };

  const handleUpdateDelegateToken = () => {
    if (parseFloat(amount) <= 0) return handleCancelTokenDelegation();

    const availableBalance =
      parseFloat(token.stake) - parseFloat(token.pendingUndelegations);
    navigate('Operation', {
      operation: 'delegate',
      props: {
        currency: token.symbol,
        balance: availableBalance.toString(),
        delegateAmount: amount,
        tokenLogo: tokenLogo,
        sendTo: tokenDelegation.to,
        update: true,
      } as DelegateTokenOperationProps,
    });
  };

  const styles = getStyles(theme);

  if (cancelledSuccessfully) return null;

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
                  {withCommas(tokenDelegation.quantity)}{' '}
                  {tokenDelegation.symbol}
                </Text>
                <Icon
                  name={Icons.EXPAND_THIN}
                  theme={theme}
                  onClick={() => setIsExpanded(!isExpanded)}
                  additionalContainerStyle={[
                    styles.marginLeft,
                    isExpanded ? styles.iconXAxisInverted : null,
                  ]}
                  {...styles.smallIcon}
                  color={PRIMARY_RED_COLOR}
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
                    name={Icons.CHECK}
                    theme={theme}
                    onClick={() => handleUpdateDelegateToken()}
                    color={PRIMARY_RED_COLOR}
                  />
                  <Icon
                    name={Icons.CLOSE_CIRCLE}
                    theme={theme}
                    additionalContainerStyle={styles.marginLeft}
                    onClick={() => setEditMode(false)}
                    color={PRIMARY_RED_COLOR}
                  />
                </View>
              </View>
            )}
          </View>
          {isExpanded && (
            <>
              <Separator
                drawLine
                additionalLineStyle={getSeparatorLineStyle(theme, 0.5).itemLine}
              />
              <View style={styles.buttonRowContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.marginRight]}
                  onPress={() => setEditMode(!editMode)}>
                  <Icon
                    name={Icons.EDIT}
                    theme={theme}
                    {...styles.icon}
                    color={PRIMARY_RED_COLOR}
                  />
                  <Text style={styles.buttonText}>
                    {translate('common.edit')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleCancelTokenDelegation()}>
                  <Icon
                    name={Icons.GIFT_DELETE}
                    theme={theme}
                    {...styles.icon}
                    color={PRIMARY_RED_COLOR}
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
              name={Icons.AT}
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
