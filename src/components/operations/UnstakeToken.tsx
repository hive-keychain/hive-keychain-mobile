import {loadAccount, loadUserTokens} from 'actions/index';
import {KeyTypes, Token} from 'actions/interfaces';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import OperationInput from 'components/form/OperationInput';
import Separator from 'components/ui/Separator';
import React, {useContext, useState} from 'react';
import {Keyboard, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {
  button_link_primary_medium,
  title_primary_body_2,
  title_primary_title_1,
} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalize, capitalizeSentence} from 'utils/format';
import {unstakeToken} from 'utils/hive';
import {getCurrencyProperties} from 'utils/hiveReact';
import {sanitizeAmount} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import BlockchainTransactionUtils from 'utils/tokens.utils';
import Balance from './Balance';
import OperationThemed from './OperationThemed';

export interface UnstakeTokenOperationProps {
  currency: string;
  tokenLogo: JSX.Element;
  balance: string;
  tokenInfo: Token;
  gobackAction?: () => void;
}

type Props = PropsFromRedux & UnstakeTokenOperationProps;

const UnstakeToken = ({
  currency,
  user,
  balance,
  loadAccount,
  properties,
  tokenLogo,
  tokenInfo,
  loadUserTokens,
  gobackAction,
}: Props) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const onUnstakeToken = async () => {
    if (!user.keys.active) {
      return Toast.show(
        translate('common.missing_key', {key: KeyTypes.active}),
      );
    }

    if (parseFloat(amount) <= 0 || amount.trim().length === 0) {
      return Toast.show(translate('common.need_positive_amount'), Toast.LONG);
    }

    setLoading(true);
    Keyboard.dismiss();

    const tokenOperationResult: any = await unstakeToken(
      user.keys.active,
      user.name!,
      {
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
          //TODO add showModal action.
          Toast.show(
            translate('toast.hive_engine_error', {
              error: confirmationResult.error,
            }),
            Toast.LONG,
          );
        } else {
          Toast.show(
            translate('toast.token_unstake_success', {currency}),
            Toast.LONG,
          );
        }
      } else {
        Toast.show(translate('toast.token_timeout'), Toast.LONG);
      }
    } else {
      Toast.show(
        translate('toast.tokens_operation_failed', {tokenOperation: 'unstake'}),
        Toast.LONG,
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
  //TODO finish stake, then move to delegateToken & undelegateToken
  return (
    <OperationThemed
      childrenTop={
        <>
          <Separator />
          <Balance
            currency={currency}
            account={user.account}
            isHiveEngine
            globalProperties={properties.globals}
            setMax={(value: string) => {
              setAmount(value);
            }}
            tokenLogo={tokenLogo}
            tokenBalance={balance}
            using_new_ui
            theme={theme}
          />
          <Separator />
        </>
      }
      childrenMiddle={
        <View style={styles.childrenMiddle}>
          <Separator />
          <Text style={styles.infoText}>
            {capitalizeSentence(
              translate('wallet.operations.token_unstake.info'),
            )}
          </Text>
          <Text style={styles.infoText}>
            {capitalizeSentence(
              translate('wallet.operations.token_unstake.cooldown_disclaimer', {
                unstakingCooldown: tokenInfo.unstakingCooldown,
              }),
            )}
            {tokenInfo.unstakingCooldown === 1 ? '' : 's'},
          </Text>
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
        </View>
      }
      childrenBottom={
        <ActiveOperationButton
          title={translate('common.unstake')}
          onPress={onUnstakeToken}
          style={[getButtonStyle(theme).warningStyleButton, styles.button]}
          isLoading={loading}
          additionalTextStyle={{...button_link_primary_medium}}
        />
      }
    />
    // <Operation
    //   logo={renderIconComponent()}
    //   title={translate('wallet.operations.token_unstake.unstaking_token', {
    //     currency,
    //   })}>
    //   <>
    //     <Text>
    //       {translate('wallet.operations.token_unstake.cooldown_disclaimer', {
    //         unstakingCooldown: tokenInfo.unstakingCooldown,
    //       })}
    //       {tokenInfo.unstakingCooldown === 1 ? '' : 's'}
    //     </Text>
    //     <Separator />
    //     <Balance
    //       currency={currency}
    //       account={user.account}
    //       isHiveEngine
    //       globalProperties={properties.globals}
    //       setMax={(value: string) => {
    //         setAmount(value);
    //       }}
    //       tokenLogo={tokenLogo}
    //       tokenBalance={balance}
    //     />
    //     <Separator />
    //     <OperationInput
    //       placeholder={'0.000'}
    //       keyboardType="decimal-pad"
    //       rightIcon={<Text style={styles.currency}>{currency}</Text>}
    //       textAlign="right"
    //       value={amount}
    //       onChangeText={setAmount}
    //     />

    //     <Separator height={40} />
    //     <ActiveOperationButton
    //       title={translate('common.unstake')}
    //       onPress={onUnstakeToken}
    //       style={styles.button}
    //       isLoading={loading}
    //     />
    //   </>
    // </Operation>
  );
};

const getDimensionedStyles = (color: string, theme: Theme) =>
  StyleSheet.create({
    button: {marginBottom: 20},
    currency: {fontWeight: 'bold', fontSize: 18, color},
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    goBackButton: {
      margin: 7,
    },
    childrenMiddle: {
      paddingHorizontal: 10,
    },
    flexRowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    text: {
      ...title_primary_body_2,
      color: getColors(theme).secondaryText,
    },
    flexRowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },
    infoText: {
      color: getColors(theme).septenaryText,
      opacity: theme === Theme.DARK ? 0.6 : 1,
      ...title_primary_title_1,
      paddingHorizontal: 15,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      properties: state.properties,
      user: state.activeAccount,
    };
  },
  {loadAccount, loadUserTokens},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(UnstakeToken);
