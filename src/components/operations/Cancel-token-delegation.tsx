import {loadAccount, loadUserTokens} from 'actions/index';
import {KeyTypes} from 'actions/interfaces';
import {showModal} from 'actions/message';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import EllipticButton from 'components/form/EllipticButton';
import Separator from 'components/ui/Separator';
import React, {useContext, useState} from 'react';
import {Keyboard, StyleSheet, Text, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {BACKGROUNDDARKBLUE, getColors} from 'src/styles/colors';
import {
  button_link_primary_medium,
  fields_primary_text_1,
  title_primary_title_1,
} from 'src/styles/typography';
import {RootState} from 'store';
import AccountUtils from 'utils/account.utils';
import {cancelDelegateToken} from 'utils/hive';
import {getCurrencyProperties} from 'utils/hiveReact';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import BlockchainTransactionUtils from 'utils/tokens.utils';
import OperationThemed from './OperationThemed';

export interface CancelTokenDelegationOperationProps {
  currency: string;
  tokenLogo: JSX.Element;
  from?: string;
  amount?: string;
  gobackAction?: () => void;
  setCancelledSuccessfully?: (value: boolean) => void;
}

type Props = PropsFromRedux & CancelTokenDelegationOperationProps;

const CancelDelegationToken = ({
  currency,
  user,
  loadAccount,
  tokenLogo,
  from,
  amount,
  loadUserTokens,
  gobackAction,
  showModal,
  setCancelledSuccessfully,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const onCancelDelegateToken = async () => {
    if (!(await AccountUtils.doesAccountExist(from))) {
      return Toast.show(translate('toast.no_such_account'), Toast.LONG);
    }

    if (!user.keys.active) {
      return Toast.show(
        translate('common.missing_key', {key: KeyTypes.active}),
      );
    }

    setLoading(true);
    Keyboard.dismiss();

    const tokenOperationResult: any = await cancelDelegateToken(
      user.keys.active,
      user.name!,
      {from: from, symbol: currency, quantity: amount},
    );

    if (tokenOperationResult && tokenOperationResult.tx_id) {
      let confirmationResult: any = await BlockchainTransactionUtils.tryConfirmTransaction(
        tokenOperationResult.tx_id,
      );

      if (confirmationResult && confirmationResult.confirmed) {
        if (confirmationResult.error) {
          showModal(
            true,
            translate('toast.hive_engine_error', {
              error: confirmationResult.error,
            }),
            true,
          );
        } else {
          setCancelledSuccessfully(true);
          showModal(
            true,
            translate('toast.token_cancel_delegation_sucess', {currency}),
          );
        }
      } else {
        showModal(true, translate('toast.token_timeout'), true);
      }
    } else {
      showModal(
        true,
        translate('toast.tokens_operation_failed', {
          tokenOperation: 'cancel delegation',
        }),
        true,
      );
    }

    setLoading(false);
    loadAccount(user.account.name, true);
    loadUserTokens(user.name!);
    goBack();
  };

  const {theme} = useContext(ThemeContext);
  const {color} = getCurrencyProperties(currency);
  const styles = getDimensionedStyles(color, theme);

  return (
    <OperationThemed
      childrenTop={<Separator height={20} />}
      childrenMiddle={
        <>
          <Separator height={30} />
          <Text style={styles.infoText}>
            {translate(
              'wallet.operations.token_delegation.title_confirm_cancel_delegation',
              {amount: amount, currency: currency},
            )}
          </Text>
          <Separator height={20} />

          <View style={styles.cancelItem}>
            <Text style={styles.text}>{translate('common.to')}</Text>
            <Text style={styles.textValues}>@ {from}</Text>
          </View>
        </>
      }
      childrenBottom={
        <View style={styles.operationButtonsContainer}>
          <EllipticButton
            title={translate('common.back')}
            onPress={() => goBack()}
            style={[styles.operationButton, styles.operationButtonConfirmation]}
            additionalTextStyle={[
              styles.operationButtonText,
              styles.buttonTextColorDark,
            ]}
          />
          <ActiveOperationButton
            title={translate('common.confirm')}
            onPress={onCancelDelegateToken}
            style={[
              styles.operationButton,
              getButtonStyle(theme).warningStyleButton,
            ]}
            additionalTextStyle={styles.operationButtonText}
            isLoading={loading}
          />
        </View>
      }
    />
  );
};

const getDimensionedStyles = (color: string, theme: Theme) =>
  StyleSheet.create({
    infoText: {
      color: getColors(theme).septenaryText,
      opacity: theme === Theme.DARK ? 0.6 : 1,
      ...title_primary_title_1,
      paddingHorizontal: 15,
    },
    cancelItem: {
      flex: 1,
      borderRadius: 66,
      borderWidth: 1,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingVertical: 16,
    },
    text: {
      color: getColors(theme).secondaryText,
      ...title_primary_title_1,
    },
    textValues: {
      ...fields_primary_text_1,
      color: getColors(theme).secondaryText,
    },
    operationButtonsContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 20,
      justifyContent: 'space-around',
      width: '100%',
    },
    operationButton: {
      width: '48%',
      marginHorizontal: 0,
    },
    operationButtonConfirmation: {
      backgroundColor: '#FFF',
    },
    buttonTextColorDark: {
      color: BACKGROUNDDARKBLUE,
    },
    operationButtonText: {
      ...button_link_primary_medium,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
    };
  },
  {loadAccount, loadUserTokens, showModal},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CancelDelegationToken);
