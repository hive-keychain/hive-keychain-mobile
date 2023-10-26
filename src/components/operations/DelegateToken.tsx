import {loadAccount, loadUserTokens} from 'actions/index';
import {KeyTypes} from 'actions/interfaces';
import {showModal} from 'actions/message';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import Separator from 'components/ui/Separator';
import React, {useContext, useState} from 'react';
import {Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {
  button_link_primary_medium,
  title_primary_body_2,
  title_primary_title_1,
} from 'src/styles/typography';
import {RootState} from 'store';
import AccountUtils from 'utils/account.utils';
import {capitalize, capitalizeSentence} from 'utils/format';
import {delegateToken} from 'utils/hive';
import {getCurrencyProperties} from 'utils/hiveReact';
import {sanitizeAmount, sanitizeUsername} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import BlockchainTransactionUtils from 'utils/tokens.utils';
import Balance from './Balance';
import OperationThemed from './OperationThemed';

export interface DelegateTokenOperationProps {
  currency: string;
  tokenLogo: JSX.Element;
  balance: string;
  sendTo?: string;
  delegateAmount?: string;
  update?: boolean;
  gobackAction?: () => void;
}

type Props = PropsFromRedux & DelegateTokenOperationProps;

const DelegateToken = ({
  currency,
  user,
  balance,
  loadAccount,
  properties,
  tokenLogo,
  sendTo,
  delegateAmount,
  update,
  loadUserTokens,
  gobackAction,
  showModal,
}: Props) => {
  const [to, setTo] = useState(sendTo || '');
  const [amount, setAmount] = useState(delegateAmount || '');
  const [loading, setLoading] = useState(false);

  const onDelegateToken = async () => {
    if (!(await AccountUtils.doesAccountExist(to))) {
      return Toast.show(translate('toast.no_such_account'), Toast.LONG);
    }

    if (!user.keys.active) {
      return Toast.show(
        translate('common.missing_key', {key: KeyTypes.active}),
      );
    }

    if (parseFloat(amount) <= 0) {
      return Toast.show(translate('common.need_positive_amount'), Toast.LONG);
    }

    setLoading(true);
    Keyboard.dismiss();

    const tokenOperationResult: any = await delegateToken(
      user.keys.active,
      user.name!,
      {
        to: sanitizeUsername(to),
        symbol: currency,
        quantity: sanitizeAmount(amount),
      },
    );

    if (tokenOperationResult && tokenOperationResult.tx_id) {
      let confirmationResult: any = await BlockchainTransactionUtils.tryConfirmTransaction(
        tokenOperationResult.tx_id,
      );

      if (confirmationResult && confirmationResult.confirmed) {
        if (confirmationResult.error) {
          showModal('toast.hive_engine_error', MessageModalType.ERROR, {
            error: confirmationResult.error,
          });
        } else {
          showModal('toast.token_delegate_sucess', MessageModalType.SUCCESS, {
            currency,
          });
        }
      } else {
        showModal('toast.token_timeout', MessageModalType.ERROR);
      }
    } else {
      showModal('toast.tokens_operation_failed', MessageModalType.ERROR, {
        tokenOperation: 'delegate',
      });
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
      childrenTop={
        <>
          <Separator />
          <Balance
            currency={currency}
            account={user.account}
            isHiveEngine
            setMax={(value: string) => {
              setAmount(value);
            }}
            tokenLogo={tokenLogo}
            tokenBalance={balance}
            using_new_ui
            theme={theme}
          />
        </>
      }
      childrenMiddle={
        <>
          <Separator />
          <Text style={styles.infoText}>
            {capitalizeSentence(
              translate('wallet.operations.token_delegation.info'),
            )}
          </Text>
          <Separator />
          <OperationInput
            labelInput={translate('common.username')}
            placeholder={translate('common.username').toUpperCase()}
            leftIcon={<Icon name="at" theme={theme} />}
            autoCapitalize="none"
            value={to}
            onChangeText={setTo}
            inputStyle={styles.text}
          />
          <Separator />
          <View style={styles.flexRowBetween}>
            <OperationInput
              labelInput={translate('common.currency')}
              placeholder={currency}
              value={currency}
              editable={false}
              additionalOuterContainerStyle={{
                width: '40%',
              }}
              inputStyle={styles.text}
              additionalInputContainerStyle={{
                marginHorizontal: 0,
              }}
            />
            <OperationInput
              keyboardType="decimal-pad"
              labelInput={capitalize(translate('common.amount'))}
              placeholder={capitalizeSentence(translate('common.enter_amount'))}
              value={amount}
              onChangeText={setAmount}
              additionalInputContainerStyle={{
                marginHorizontal: 0,
              }}
              additionalOuterContainerStyle={{
                width: '54%',
              }}
              inputStyle={styles.text}
              rightIcon={
                <View style={styles.flexRowCenter}>
                  <Separator
                    drawLine
                    additionalLineStyle={getHorizontalLineStyle(
                      theme,
                      1,
                      35,
                      16,
                    )}
                  />
                  <TouchableOpacity onPress={() => setAmount(balance)}>
                    <Text style={styles.text}>
                      {translate('common.max').toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
        </>
      }
      childrenBottom={
        <ActiveOperationButton
          title={translate(update ? 'common.confirm' : 'common.delegate')}
          onPress={onDelegateToken}
          style={[getButtonStyle(theme).warningStyleButton, styles.button]}
          additionalTextStyle={{...button_link_primary_medium}}
          isLoading={loading}
        />
      }
    />
  );
};

const getDimensionedStyles = (color: string, theme: Theme) =>
  StyleSheet.create({
    button: {marginBottom: 20},
    infoText: {
      color: getColors(theme).septenaryText,
      opacity: theme === Theme.DARK ? 0.6 : 1,
      ...title_primary_title_1,
      paddingHorizontal: 15,
    },
    text: {
      ...title_primary_body_2,
      color: getColors(theme).secondaryText,
    },
    flexRowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    flexRowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      properties: state.properties,
      user: state.activeAccount,
    };
  },
  {loadAccount, loadUserTokens, showModal},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(DelegateToken);
