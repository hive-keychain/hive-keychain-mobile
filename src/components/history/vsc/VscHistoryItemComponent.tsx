import BackgroundIconRed from 'assets/new_UI/background-icon-red.svg';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import {VscHistoryItem} from 'hive-keychain-commons';
import React, {useState} from 'react';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {GREEN_SUCCESS, PRIMARY_RED_COLOR} from 'src/styles/colors';
import {formatBalance} from 'utils/format';
import {translate} from 'utils/localize';
import Icon from '../../hive/Icon';

interface Props {
  transaction: VscHistoryItem;
  user: any;
  theme: Theme;
}

const VscHistoryItemComponent = ({transaction, user, theme}: Props) => {
  const [toggle, setToggle] = useState(false);

  const getOperationIcon = () => {
    const opType = transaction.type;
    switch (opType) {
      case 'transfer':
        return Icons.TRANSFER;
      case 'withdraw':
        return Icons.POWER_DOWN;
      case 'deposit':
      default:
        return Icons.TRANSFER;
    }
  };


  const getOperationDescription = () => {
    const opType = transaction.type;
    const isOutgoing = transaction.from === `hive:${user.name}`;
    const otherParty = isOutgoing ? transaction.to : transaction.from;
    const amount = parseFloat(transaction.amount.toString());
    const currency = transaction.asset.toUpperCase();

    switch (opType) {
      case 'transfer':
        return isOutgoing
          ? translate('wallet.operations.vsc.transfer_amount', {
              amount: formatBalance(amount) + ' ' + currency,
            })
          : translate('wallet.operations.vsc.received_amount', {
              amount: formatBalance(amount) + ' ' + currency,
            });
      case 'withdraw':
        return isOutgoing
          ? translate('wallet.operations.vsc.withdraw_amount', {
              amount: formatBalance(amount) + ' ' + currency,
            })
          : translate('wallet.operations.vsc.withdraw_amount', {
              amount: formatBalance(amount) + ' ' + currency,
            });
      case 'deposit':
        return translate('wallet.operations.vsc.deposit_amount', {
          amount: formatBalance(amount),
        });
      default:
        return opType;
    }
  };

  const getOperationDetails = () => {
    const isOutgoing = transaction.from === `hive:${user.name}`;
    const otherParty = isOutgoing ? transaction.to : transaction.from;
    return isOutgoing
      ? translate('wallet.operations.vsc.to', {to: otherParty})
      : translate('wallet.operations.vsc.from', {from: otherParty});
  };

  return (
    <ItemCardExpandable
      theme={theme}
      toggle={toggle}
      setToggle={() => setToggle(!toggle)}
      textLine1={getOperationDescription()}
      textLine2={getOperationDetails()}
      date={new Date(transaction.timestamp.toString()).toLocaleDateString()}
      icon={
        <Icon
          name={getOperationIcon()}
          theme={theme}
          bgImage={<BackgroundIconRed />}
          color={getOperationColor()}
        />
      }
    />
  );
};

export default VscHistoryItemComponent;
