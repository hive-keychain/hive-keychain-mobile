import {ActiveAccount} from 'actions/interfaces';
import Icon from 'components/hive/Icon';
import {TransferOperationProps} from 'components/operations/transfer/Transfer';
import {VscDepositProps} from 'components/operations/VscDeposit';
import CustomIconButton from 'components/ui/CustomIconButton';
import SquareButton from 'components/ui/SquareButton';
import React from 'react';
import {useWindowDimensions} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getButtonStyle} from 'src/styles/button';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

import CurrencySavingLight from 'assets/new_UI/currency-saving-light.svg';
export const getVscHbdOperationButtonList = (
  user: ActiveAccount,
  theme: Theme,
) => {
  const styles = getButtonStyle(
    theme,
    useWindowDimensions().width,
  ).getOperationButtonStylesheet();
  return [
    <SquareButton
      additionalButtonContainerStyle={styles.buttonContainer}
      additionalSquareButtonText={styles.buttonText}
      key={'square-button-transfer-hbd-vsc'}
      onPress={() => {
        navigate('Operation', {
          operation: 'transfer',
          props: {
            currency: 'VSCHBD',
          } as TransferOperationProps,
        });
      }}
      icon={
        <Icon
          theme={theme}
          name={Icons.TRANSFER}
          additionalContainerStyle={styles.buttonMarginRight}
          {...styles.icon}
        />
      }
      primaryLabel={translate('common.transfer')}
    />,
    <SquareButton
      additionalButtonContainerStyle={styles.buttonContainer}
      additionalSquareButtonText={styles.buttonText}
      key={'square-button-savings-hive-vsc'}
      onPress={() => {
        navigate('Operation', {
          operation: 'vsc_deposit',
          props: {
            currency: 'HBD', // the currency must be the L1 currency
          } as VscDepositProps,
        });
      }}
      icon={
        <CustomIconButton
          theme={theme}
          lightThemeIcon={<CurrencySavingLight {...styles.biggerIcon} />}
          darkThemeIcon={<CurrencySavingLight {...styles.biggerIcon} />}
          onPress={() => {}}
          additionalContainerStyle={styles.buttonMarginRight}
        />
      }
      primaryLabel={translate('common.deposit')}
    />,
    <SquareButton
      additionalButtonContainerStyle={styles.buttonContainer}
      additionalSquareButtonText={styles.buttonText}
      key={'square-button-withdraw-hbd-vsc'}
      onPress={() => {
        navigate('Operation', {
          operation: 'vsc_withdraw',
          props: {
            currency: 'VSCHBD',
          } as VscDepositProps,
        });
      }}
      icon={
        <CustomIconButton
          theme={theme}
          lightThemeIcon={<CurrencySavingLight {...styles.biggerIcon} />}
          darkThemeIcon={<CurrencySavingLight {...styles.biggerIcon} />}
          onPress={() => {}}
          additionalContainerStyle={styles.buttonMarginRight}
        />
      }
      primaryLabel={translate('common.withdraw')}
    />,
    <SquareButton
      additionalButtonContainerStyle={styles.buttonContainer}
      additionalSquareButtonText={styles.buttonText}
      key={'square-button-staking-hbd-vsc'}
      onPress={() => {
        navigate('Operation', {
          operation: 'vsc_staking',
          props: {
            currency: 'VSCHBD',
          } as VscDepositProps,
        });
      }}
      icon={
        <CustomIconButton
          theme={theme}
          lightThemeIcon={<CurrencySavingLight {...styles.biggerIcon} />}
          darkThemeIcon={<CurrencySavingLight {...styles.biggerIcon} />}
          onPress={() => {}}
          additionalContainerStyle={styles.buttonMarginRight}
        />
      }
      primaryLabel={translate('common.stake')}
    />,
  ];
};
