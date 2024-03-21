import {showModal} from 'actions/message';
import DropdownModal, {DropdownModalItem} from 'components/form/DropdownModal';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import PendingSavingsWithdrawalPageComponent from 'components/hive/PendingSavingsWithdrawalPage.component';
import {Caption} from 'components/ui/Caption';
import CurrentAvailableBalance from 'components/ui/CurrentAvailableBalance';
import Separator from 'components/ui/Separator';
import {TemplateStackProps} from 'navigators/Root.types';
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
import {SavingsWithdrawal} from 'src/interfaces/savings.interface';
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
import {capitalize, getCleanAmountValue, withCommas} from 'utils/format';
import {depositToSavings, withdrawFromSavings} from 'utils/hive';
import {getCurrencyProperties} from 'utils/hiveReact';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {SavingsUtils} from 'utils/savings.utils';
import {ConfirmationPageProps} from './Confirmation';
import OperationThemed from './OperationThemed';

export enum SavingsOperations {
  deposit = 'deposit',
  withdraw = 'withdraw',
}
export interface SavingOperationProps {
  currency: string;
  operation: SavingsOperations;
}

type Props = PropsFromRedux & SavingOperationProps;
const Savings = ({
  user,
  currency: c,
  operation,
  userSavingsWithdrawRequests,
  showModal,
}: Props) => {
  const [to, setTo] = useState(user.name!);
  const [currentWithdrawingList, setCurrentWithdrawingList] = useState<
    SavingsWithdrawal[]
  >([]);
  const [
    totalPendingSavingsWithdrawals,
    setTotalPendingSavingsWithdrawals,
  ] = useState(0);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(c);
  const [operationType, setOperationType] = useState<SavingsOperations>(
    operation,
  );
  const {theme} = useThemeContext();
  const {color} = getCurrencyProperties(currency);
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles(color, {width, height}, theme);
  const operationTypeList: DropdownModalItem[] = [
    {
      value: SavingsOperations.deposit,
      label: capitalize(SavingsOperations.deposit),
    },
    {
      value: SavingsOperations.withdraw,
      label: capitalize(SavingsOperations.withdraw),
    },
  ];
  const currentBalance =
    currency === 'HIVE'
      ? user.account.savings_balance
      : user.account.savings_hbd_balance;
  const availableBalance =
    currency === 'HIVE' ? user.account.balance : user.account.hbd_balance;

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    if (userSavingsWithdrawRequests > 0) {
      const pendingSavingsWithdrawalsList: SavingsWithdrawal[] = await SavingsUtils.getSavingsWitdrawFrom(
        user.name!,
      );
      setCurrentWithdrawingList(pendingSavingsWithdrawalsList);
      if (pendingSavingsWithdrawalsList.length > 0) {
        updateTotalSavingWithdrawals(pendingSavingsWithdrawalsList);
      }
    }
  };

  const updateTotalSavingWithdrawals = (
    pendingSavingsWithdrawalsList: SavingsWithdrawal[],
  ) => {
    setTotalPendingSavingsWithdrawals(
      pendingSavingsWithdrawalsList
        .filter((current) => current.amount.split(' ')[1] === c)
        .reduce(
          (acc, current) => acc + parseFloat(current.amount.split(' ')[0]),
          0,
        ),
    );
  };

  const onHandleUpdate = (list: SavingsWithdrawal[]) => {
    setCurrentWithdrawingList(list);
    updateTotalSavingWithdrawals(list);
  };

  const onSavings = async () => {
    try {
      if (operationType === SavingsOperations.deposit) {
        await depositToSavings(user.keys.active, {
          request_id: Date.now(),
          from: to,
          to: to,
          amount: `${(+amount).toFixed(3)} ${currency}`,
          memo: '',
        });
      } else {
        await withdrawFromSavings(user.keys.active, {
          request_id: Date.now(),
          from: to,
          to: to,
          amount: `${(+amount).toFixed(3)} ${currency}`,
          memo: '',
        });
      }
      if (operationType === SavingsOperations.deposit) {
        showModal('toast.savings_deposit_success', MessageModalType.SUCCESS, {
          amount: `${(+amount).toFixed(3)} ${currency}`,
        });
      } else {
      }
    } catch (e) {
      showModal(
        `Error : ${(e as any).message}`,
        MessageModalType.ERROR,
        null,
        true,
      );
    }
  };
  const onSavingsConfirmation = () => {
    if (!to || !amount) {
      Toast.show(translate('wallet.operations.transfer.warning.missing_info'));
    } else if (
      (+amount > +getCleanAmountValue(availableBalance as string) &&
        operationType === SavingsOperations.deposit) ||
      (+amount > +getCleanAmountValue(currentBalance as string) &&
        operationType === SavingsOperations.withdraw)
    ) {
      Toast.show(
        translate('common.overdraw_balance_error', {
          currency,
        }),
      );
    } else {
      const confirmationData: ConfirmationPageProps = {
        onSend: onSavings,
        title: 'wallet.operations.savings.confirm.info',
        data: [
          {
            title: 'common.operation_type',
            value: operationTypeList.find((e) => e.value === operationType)
              .label,
          },
          {
            title: 'wallet.operations.transfer.confirm.from',
            value: `@${user.account.name}`,
          },
          {
            value: `@${to}`,
            title: 'wallet.operations.transfer.confirm.to',
          },
          {
            title: 'wallet.operations.transfer.confirm.amount',
            value: `${withCommas(amount)} ${currency}`,
          },
        ],
      };
      navigate('ConfirmationPage', confirmationData);
    }
  };

  const handleSetMax = () => {
    if (operationType === SavingsOperations.deposit) {
      setAmount(getCleanAmountValue(availableBalance as string).split(' ')[0]);
    } else
      setAmount(getCleanAmountValue(currentBalance as string).split(' ')[0]);
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
            currentValue={currentBalance as string}
            availableValue={availableBalance as string}
            additionalContainerStyle={styles.currentAvailableBalances}
          />
          <Separator height={10} />
          {totalPendingSavingsWithdrawals > 0 && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                navigate('TemplateStack', {
                  titleScreen: capitalize(
                    translate(`wallet.operations.savings.pending`),
                  ),
                  component: (
                    <PendingSavingsWithdrawalPageComponent
                      currency={c}
                      operation={operationType}
                      currentWithdrawingList={currentWithdrawingList}
                      onUpdate={onHandleUpdate}
                    />
                  ),
                } as TemplateStackProps);
              }}
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
                  {capitalize(translate(`wallet.operations.savings.pending`))}
                </Text>
                <Text
                  style={[
                    getFormFontStyle(height, theme).input,
                    styles.title,
                    styles.josefineFont,
                  ]}>
                  {totalPendingSavingsWithdrawals} {currency}
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
            operationType !== SavingsOperations.deposit) && (
            <View>
              <Caption
                text={`wallet.operations.savings.${operationType}_disclaimer`}
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
              setOperationType(item.value as SavingsOperations);
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
            labelInput={translate('common.username')}
            placeholder={translate('common.username')}
            leftIcon={<Icon theme={theme} name={Icons.AT} />}
            value={to}
            onChangeText={(e) => {
              setTo(e.trim());
            }}
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
            />
            <OperationInput
              labelInput={capitalize(translate('common.amount'))}
              placeholder={'0'}
              keyboardType="decimal-pad"
              textAlign="right"
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
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handleSetMax()}>
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
        </View>
      }
      buttonTitle={`wallet.operations.savings.${operationType}_button`}
      onNext={onSavingsConfirmation}
    />
  );
};

const getDimensionedStyles = (
  color: string,
  {width, height}: Dimensions,
  theme: Theme,
) =>
  StyleSheet.create({
    disclaimer: {textAlign: 'center'},
    currentAvailableBalances: {
      paddingHorizontal: 15,
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
    paddingLeft: {
      paddingLeft: 10,
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
    dropdown: {
      width: '100%',
      padding: 0,
      zIndex: 20,
    },
    iconOperation: {width: 20, height: 20},
    dropdownListContainer: {
      borderRadius: 30,
      height: '100%',
    },
    marginLeft: {marginLeft: 15},
    bottomLineDropdownItem: {
      borderWidth: 1,
      width: '85%',
      borderColor: getColors(theme).lineSeparatorStroke,
      alignSelf: 'center',
    },
    paddingHorizontal: {
      paddingHorizontal: MARGIN_PADDING,
    },
  });

const connector = connect(
  (state: RootState) => {
    return {
      user: state.activeAccount,
      userSavingsWithdrawRequests:
        state.activeAccount.account.savings_withdraw_requests,
    };
  },
  {showModal},
);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Savings);
