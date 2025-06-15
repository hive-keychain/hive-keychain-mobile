import {VscHistoryItem} from 'hive-keychain-commons';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getColors, GREEN_SUCCESS, PRIMARY_RED_COLOR} from 'src/styles/colors';
import {
  body_primary_body_2,
  fields_primary_text_2,
} from 'src/styles/typography';
import {formatBalance} from 'utils/format';
import {translate} from 'utils/localize';
import Icon from '../../hive/Icon';

interface Props {
  transaction: VscHistoryItem;
  user: any;
  theme: Theme;
}

const VscHistoryItemComponent = ({transaction, user, theme}: Props) => {
  const styles = getStyles(theme);

  const getOperationIcon = () => {
    const opType = transaction.type;
    switch (opType) {
      case 'transfer':
        return Icons.TRANSFER;
      case 'withdraw':
        return Icons.CLAIM;
      default:
        return Icons.TRANSFER;
    }
  };

  const getOperationColor = () => {
    const isOutgoing = transaction.from === `hive:${user.name}`;
    return isOutgoing ? PRIMARY_RED_COLOR : GREEN_SUCCESS;
  };

  const getOperationAmount = () => {
    const amount = parseFloat(transaction.amount.toString());
    const isOutgoing = transaction.from === `hive:${user.name}`;
    return `${isOutgoing ? '-' : '+'}${formatBalance(amount)}`;
  };

  const getOperationDescription = () => {
    const opType = transaction.type;
    const isOutgoing = transaction.from === `hive:${user.name}`;
    const otherParty = isOutgoing ? transaction.to : transaction.from;

    switch (opType) {
      case 'transfer':
        return isOutgoing
          ? translate('wallet.operations.transfer_to', {to: otherParty})
          : translate('wallet.operations.transfer_from', {from: otherParty});
      case 'withdraw':
        return isOutgoing
          ? translate('wallet.operations.withdraw_to', {to: otherParty})
          : translate('wallet.operations.withdraw_from', {from: otherParty});
      default:
        return opType;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={() => {}}>
      <View style={styles.leftContainer}>
        <Icon
          name={getOperationIcon()}
          theme={theme}
          color={getOperationColor()}
          additionalContainerStyle={styles.iconContainer}
        />
        <View style={styles.textContainer}>
          <Text style={styles.operationText}>{getOperationDescription()}</Text>
          <Text style={styles.dateText}>
            {new Date(transaction.timestamp.toString()).toLocaleString()}
          </Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <Text style={[styles.amountText, {color: getOperationColor()}]}>
          {getOperationAmount()}
        </Text>
        <Text style={styles.assetText}>{transaction.asset.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: getColors(theme).cardBorderColor,
    },
    leftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    rightContainer: {
      alignItems: 'flex-end',
    },
    iconContainer: {
      marginRight: 10,
    },
    textContainer: {
      flex: 1,
    },
    operationText: {
      ...body_primary_body_2,
      color: getColors(theme).secondaryText,
    },
    dateText: {
      ...fields_primary_text_2,
      color: getColors(theme).secondaryText,
      opacity: 0.7,
      marginTop: 2,
    },
    amountText: {
      ...body_primary_body_2,
      fontWeight: 'bold',
    },
    assetText: {
      ...fields_primary_text_2,
      color: getColors(theme).secondaryText,
      opacity: 0.7,
      marginTop: 2,
    },
  });

export default VscHistoryItemComponent;
