import {KeyTypes} from 'actions/interfaces';
import {showModal} from 'actions/message';
import DropdownModal, {DropdownModalItem} from 'components/form/DropdownModal';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import {Caption} from 'components/ui/Caption';
import CurrentAvailableBalance from 'components/ui/CurrentAvailableBalance';
import Separator from 'components/ui/Separator';
import {
  KeychainRequestTypes,
  RequestVscStaking,
  VscStakingOperation,
  VscUtils,
} from 'hive-keychain-commons';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {KeyType} from 'src/interfaces/keys.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {MARGIN_PADDING} from 'src/styles/spacing';
import {getRotateStyle} from 'src/styles/transform';
import {
  FontJosefineSansName,
  getFontSizeSmallDevices,
  getFormFontStyle,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {VSCConfig} from 'utils/config';
import {
  beautifyTransferError,
  capitalize,
  getCleanAmountValue,
  withCommas,
} from 'utils/format';
import {broadcastJson} from 'utils/hive';
import {sanitizeAmount, sanitizeUsername} from 'utils/hiveUtils';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {TransferUtils} from 'utils/transfer.utils';
import {ConfirmationPageProps} from './Confirmation';
import OperationThemed from './OperationThemed';

export type VscStakingProps = {
  currency: string;
};

type Props = PropsFromRedux & VscStakingProps;

const VscStaking = ({
  currency,
  user,
  phishingAccounts,
  showModal,
  apr,
}: Props) => {
  const [to, setTo] = useState(user.name);
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [isMemoEncrypted, setIsMemoEncrypted] = useState<boolean>(false);
  const [actualCurrency, setActualCurrency] = useState<string>(
    currency.toUpperCase().includes('VSC')
      ? currency.replace('VSC', '')
      : currency,
  );
  const [operationType, setOperationType] = useState<VscStakingOperation>(
    VscStakingOperation.STAKING,
  );
  const [availableBalance, setAvailableBalance] = useState('0');
  const [claimingBalance, setClaimingBalance] = useState('0');
  const [currentStaked, setCurrentStaked] = useState('0');
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({width, height}, theme);
  useEffect(() => {
    const getBalance = async () => {
      try {
        const vscBalance = await VscUtils.getAccountBalance(user.name);
        const availableHbd = (vscBalance.hbd / 1000).toFixed(3);
        setAvailableBalance(availableHbd.toString());
        const currentStaked = (vscBalance.hbd_savings / 1000).toFixed(3);
        setCurrentStaked(currentStaked.toString());
        const claimingHbd = (vscBalance.hbd_claim / 1000).toFixed(3);
        setClaimingBalance(claimingHbd.toString());
      } catch (error) {
        console.error('Error getting VSC balance:', error);
        setAvailableBalance('0');
        setCurrentStaked('0');
        setClaimingBalance('0');
      }
    };
    getBalance();
  }, []);

  const operationTypeList: DropdownModalItem[] = [
    {
      value: VscStakingOperation.STAKING,
      label: capitalize(VscStakingOperation.STAKING),
    },
    {
      value: VscStakingOperation.UNSTAKING,
      label: capitalize(VscStakingOperation.UNSTAKING),
    },
  ];

  const stakeVsc = async (options: TransactionOptions) => {
    const data: RequestVscStaking = {
      type: KeychainRequestTypes.vscStaking,
      username: user.name,
      to: sanitizeUsername(to),
      amount: sanitizeAmount(parseFloat(amount).toFixed(3)),
      currency: actualCurrency,
      domain: 'hive-keychain.com',
      netId: VSCConfig.BASE_JSON.net_id,
      operation: operationType,
    };

    const {json, id} = VscUtils.getStakingJson(
      data,
      VSCConfig.BASE_JSON.net_id,
    );
    await broadcastJson(user.keys.active, user.name, id, true, json, options);
  };

  const onSend = async (options: TransactionOptions) => {
    try {
      if (isMemoEncrypted && !user.keys.memo)
        return showModal(
          translate('toast.missing_memo_key', {account: user.name}),
          MessageModalType.ERROR,
        );

      await stakeVsc(options);
      if (options.multisig) return;
      showModal(
        translate('wallet.operations.staking.toast.staking_success', {
          amount,
          currency: actualCurrency,
        }),
        MessageModalType.SUCCESS,
      );
    } catch (e) {
      showModal(
        beautifyTransferError(e as any, {
          to,
          currency: actualCurrency,
          username: user.account.name,
        }),
        MessageModalType.ERROR,
        undefined,
        true,
      );
    }
  };

  const onSendConfirmation = () => {
    if (!amount.length || !to.length) {
      Toast.show(translate('wallet.operations.staking.warning.missing_info'));
    } else if (
      (operationType === VscStakingOperation.STAKING &&
        +amount > +getCleanAmountValue(availableBalance)) ||
      (operationType === VscStakingOperation.UNSTAKING &&
        +amount > +getCleanAmountValue(currentStaked))
    ) {
      Toast.show(
        translate('common.overdraw_balance_error', {
          currency: actualCurrency,
        }),
      );
    } else {
      const confirmationData: ConfirmationPageProps = {
        title: 'wallet.operations.staking.confirm.info',
        onSend,
        skipWarningTranslation: true,
        warningText: TransferUtils.getTransferWarningLabel(
          to,
          actualCurrency,
          memo,
          phishingAccounts,
          false,
          false,
        ),
        data: [
          {
            value: `@${to}`,
            title: 'wallet.operations.staking.confirm.to',
          },
          {
            title: 'wallet.operations.staking.confirm.amount',
            value: `${withCommas(amount)} ${actualCurrency}`,
          },
        ],
        keyType: KeyType.ACTIVE,
      };
      if (memo.length)
        confirmationData.data.push({
          title: 'wallet.operations.staking.confirm.memo',
          value: `${
            memo.trim().length > 25 ? memo.substring(0, 22) + '...' : memo
          } ${isMemoEncrypted ? '(encrypted)' : ''}`,
        });
      navigate('ConfirmationPage', confirmationData);
    }
  };

  const handleSetMax = () => {
    if (operationType === VscStakingOperation.STAKING) {
      setAmount(getCleanAmountValue(availableBalance));
    } else {
      setAmount(getCleanAmountValue(currentStaked));
    }
  };

  return (
    <OperationThemed
      additionalContentContainerStyle={{paddingHorizontal: 20}}
      childrenTop={
        <>
          <Separator height={10} />
          <CurrentAvailableBalance
            theme={theme}
            height={height}
            currentValue={currentStaked + ' HBD'}
            availableValue={availableBalance + ' HBD'}
            additionalContainerStyle={styles.currentAvailableBalances}
          />
          <Separator height={10} />
          {claimingBalance !== '0' && (
            <TouchableOpacity
              activeOpacity={1}
              //TODO: add onPress show PendingSavingsWithdrawalPageComponent
              style={[
                getCardStyle(theme).defaultCardItem,
                styles.displayAction,
              ]}>
              <View>
                <Text
                  style={[
                    getFormFontStyle(height, theme).smallLabel,
                    styles.josefineFont,
                    styles.opaque,
                  ]}>
                  {capitalize(
                    translate(`wallet.operations.staking.withdrawing`),
                  )}
                </Text>
                <Text
                  style={[
                    getFormFontStyle(height, theme).input,
                    styles.title,
                    styles.josefineFont,
                  ]}>
                  {claimingBalance} {actualCurrency}
                </Text>
              </View>
              <Icon
                theme={theme}
                name={Icons.EXPAND_THIN}
                additionalContainerStyle={getRotateStyle('90')}
                width={15}
                height={15}
              />
            </TouchableOpacity>
          )}
          <Separator height={10} />
        </>
      }
      childrenMiddle={
        <View>
          {(currency !== 'HIVE' ||
            operationType !== VscStakingOperation.STAKING) && (
            <View>
              <Caption
                text={translate(
                  `wallet.operations.savings.${
                    operationType === VscStakingOperation.STAKING
                      ? 'deposit'
                      : 'withdraw'
                  }_disclaimer`,
                  {apr},
                )}
                skipTranslation
              />
            </View>
          )}
          <Separator />
          <DropdownModal
            selected={
              operationTypeList.filter(
                (item) => item.value === operationType,
              )[0]
            }
            list={operationTypeList}
            onSelected={(item) => {
              setOperationType(item.value as VscStakingOperation);
            }}
            additionalListExpandedContainerStyle={{
              height: 'auto',
              width: '100%',
            }}
            additionalMainContainerDropdown={[
              {width: '100%', paddingHorizontal: 0},
            ]}
            additionalOverlayStyle={[
              {
                paddingHorizontal: 10,
              },
            ]}
            dropdownIconScaledSize={{width: 15, height: 15}}
            showSelectedIcon={
              <Icon
                name={Icons.CHECK}
                theme={theme}
                width={18}
                height={18}
                strokeWidth={2}
                color={PRIMARY_RED_COLOR}
              />
            }
            additionalLineStyle={styles.bottomLineDropdownItem}
            dropdownTitle={'common.operation_type'}
          />
          <Separator />
          <OperationInput
            testID="username-input-testID"
            nativeID="username-input"
            labelInput={translate('common.to')}
            placeholder={translate('common.username')}
            leftIcon={<Icon name={Icons.AT} theme={theme} />}
            autoCapitalize="none"
            value={to}
            onChangeText={(e) => {
              setTo(e.trim());
            }}
          />
          <Separator />
          <View style={styles.flexRowBetween}>
            <OperationInput
              labelInput={translate('common.currency')}
              placeholder={actualCurrency}
              value={actualCurrency}
              editable={false}
              additionalOuterContainerStyle={{
                width: '40%',
              }}
            />
            <OperationInput
              keyboardType="decimal-pad"
              labelInput={capitalize(translate('common.amount'))}
              placeholder={'0'}
              value={amount}
              onChangeText={setAmount}
              additionalOuterContainerStyle={{
                width: '54%',
              }}
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
                  <TouchableOpacity activeOpacity={1} onPress={handleSetMax}>
                    <Text
                      style={[
                        getFormFontStyle(height, theme, PRIMARY_RED_COLOR)
                          .input,
                      ]}>
                      {translate('common.max').toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>
          <Separator />
          <View style={{zIndex: -1}}>
            <OperationInput
              labelInput={capitalize(translate('common.memo'))}
              placeholder={translate('wallet.operations.staking.memo')}
              value={memo}
              trim={false}
              onChangeText={setMemo}
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
                  <Icon
                    name={isMemoEncrypted ? Icons.ENCRYPT : Icons.DECRYPT}
                    theme={theme}
                    onPress={() => setIsMemoEncrypted(!isMemoEncrypted)}
                    color={PRIMARY_RED_COLOR}
                  />
                </View>
              }
            />
          </View>
        </View>
      }
      buttonTitle={'common.next'}
      onNext={onSendConfirmation}
      method={KeyTypes.active}
    />
  );
};

const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    currentAvailableBalances: {
      paddingHorizontal: 15,
    },
    flexRowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },
    flexRowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    paddingHorizontal: {
      paddingHorizontal: MARGIN_PADDING,
    },
    bottomLineDropdownItem: {
      borderWidth: 1,
      width: '85%',
      borderColor: getColors(theme).lineSeparatorStroke,
      alignSelf: 'center',
    },
    displayAction: {
      marginHorizontal: 15,
      borderRadius: 26,
      paddingHorizontal: 21,
      paddingVertical: 13,
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    title: {
      fontSize: getFontSizeSmallDevices(width, 15),
    },
    josefineFont: {
      fontFamily: FontJosefineSansName.MEDIUM,
    },
    opaque: {
      opacity: 0.7,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
      localAccounts: state.accounts,
      phishingAccounts: state.phishingAccounts,
      apr: state.properties.globals.hbd_interest_rate / 100,
    };
  },
  {showModal},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(VscStaking);
