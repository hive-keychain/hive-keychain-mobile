import BackgroundIconRed from 'assets/new_UI/background-icon-red.svg';
import Icon from 'components/hive/Icon';
import CustomToolTip from 'components/ui/CustomToolTip';
import ItemCardExpandable from 'components/ui/ItemCardExpandable';
import {
  VscCall,
  VscHistoryType,
  VscLedgerType,
  VscStatus,
  VscTransfer,
  VscUtils,
} from 'hive-keychain-commons';
import React, {BaseSyntheticEvent} from 'react';
import {Linking, StyleSheet} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getColors, GREEN_SUCCESS, PRIMARY_RED_COLOR} from 'src/styles/colors';
import {fields_primary_text_1} from 'src/styles/typography';
import {VscConfig} from 'utils/config';
import {shortenString, withCommas} from 'utils/format';
import {translate} from 'utils/localize';

type Props = {
  transaction: VscTransfer | VscCall;
};
const VscHistoryItem = ({transaction}: Props) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme);
  let expandableContent = false;

  const getIcon = (onPress?: (e?: any) => void) => {
    let name;
    console.log(transaction.type);
    switch (transaction.type) {
      case VscHistoryType.CONTRACT_CALL:
        name = Icons.VSC_CALL;
        break;
      case VscHistoryType.TRANSFER:
        name =
          (transaction as VscTransfer).t === VscLedgerType.DEPOSIT
            ? Icons.POWER_UP
            : Icons.POWER_DOWN;
        break;
      default:
        name = Icons.HIVE;
    }
    console.log('name', name);
    return (
      <Icon
        name={name}
        theme={theme}
        bgImage={<BackgroundIconRed />}
        color={PRIMARY_RED_COLOR}
        onPress={onPress}
      />
    );
  };

  const openTransactionOnVsc = (event: BaseSyntheticEvent) => {
    Linking.openURL(
      `${VscConfig.BLOCK_EXPLORER}/${
        transaction.id.startsWith('bafy') ? 'vsc-tx' : 'tx'
      }/${transaction.id.split('-')[0]}`,
    );
  };

  const getDetail = () => {
    switch (transaction.type) {
      case VscHistoryType.CONTRACT_CALL:
        return translate('vsc.info_call', {
          action: transaction.data.action,
          contract: shortenString(transaction.data.contract_id, 5),
        });

      case VscHistoryType.TRANSFER:
        if (transaction.t === VscLedgerType.DEPOSIT) {
          return translate('vsc.info_deposit', {
            amount: withCommas(transaction.amount / 1000 + '', 3),
            token: shortenString(transaction.tk, 4),
            address: shortenString(
              VscUtils.getAddressFromDid(transaction.owner)!,
              4,
            ),
          });
        } else {
          return translate('vsc.info_withdraw', {
            amount: withCommas(transaction.amount / 1000 + '', 3),
            token: shortenString(transaction.tk, 4),
            address: VscUtils.getAddressFromDid(transaction.owner)!,
          });
        }
      default:
        return;
    }
  };

  const getStatusIcon = () => {
    let icon, color;
    switch (transaction.status) {
      case VscStatus.CONFIRMED:
        icon = Icons.STATUS_OK;
        color = GREEN_SUCCESS;
        break;
      default:
        icon = Icons.HISTORY;
        color = PRIMARY_RED_COLOR;
    }
    return (
      <CustomToolTip message={transaction.status} skipTranslation theme={theme}>
        <Icon
          name={icon}
          width={15}
          height={15}
          color={color}
          additionalContainerStyle={{marginRight: 5, marginTop: 1}}
        />
      </CustomToolTip>
    );
  };

  return (
    <ItemCardExpandable
      date={transaction.timestamp}
      theme={theme}
      toggle={false}
      setToggle={() => {}}
      icon={getIcon(
        transaction.status === VscStatus.CONFIRMED
          ? openTransactionOnVsc
          : undefined,
      )}
      statusIcon={getStatusIcon()}
      key={transaction.id}
      textLine1={getDetail()}
    />
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    textBase: {
      color: getColors(theme).secondaryText,
      ...fields_primary_text_1,
    },
  });

export default VscHistoryItem;
