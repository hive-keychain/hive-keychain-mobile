import {ActiveAccount} from 'actions/interfaces';
import CurrencySavingLight from 'assets/new_UI/currency-saving-light.svg';
import Icon from 'components/hive/Icon';
import {ConvertOperationProps} from 'components/operations/Convert';
import {PowerUpOperationProps} from 'components/operations/PowerUp';
import {
  SavingOperationProps,
  SavingsOperations,
} from 'components/operations/Savings';
import {TransferOperationProps} from 'components/operations/transfer/Transfer';
import CustomIconButton from 'components/ui/CustomIconButton';
import SquareButton from 'components/ui/SquareButton';
import React from 'react';
import {useWindowDimensions} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getButtonStyle} from 'src/styles/button';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import {getCurrency} from 'utils/hive';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

export const getHiveButtonList = (user: ActiveAccount, theme: Theme) => {
  const styles = getButtonStyle(
    theme,
    useWindowDimensions().width,
  ).getOperationButtonStylesheet();
  return [
    <SquareButton
      additionalButtonContainerStyle={styles.buttonContainer}
      additionalSquareButtonText={styles.buttonText}
      key={'square-button-transfer-hive'}
      onPress={() => {
        navigate('Operation', {
          operation: 'transfer',
          props: {
            currency: 'HIVE',
            tokenBalance: user.account.balance as string,
            engine: false,
            tokenLogo: <></>,
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
      key={'square-button-power_up-hive'}
      onPress={() => {
        navigate('Operation', {
          operation: 'power_up',
          props: {
            currency: 'HIVE',
          } as PowerUpOperationProps,
        });
      }}
      icon={
        <Icon
          theme={theme}
          name={Icons.POWER_UP}
          additionalContainerStyle={styles.buttonMarginRight}
          {...styles.biggerIcon}
          color={PRIMARY_RED_COLOR}
        />
      }
      primaryLabel={translate('wallet.operations.powerup.title')}
    />,
    <SquareButton
      additionalButtonContainerStyle={styles.buttonContainer}
      additionalSquareButtonText={styles.buttonText}
      key={'square-button-convert-hive'}
      onPress={() => {
        navigate('Operation', {
          operation: 'convert',
          props: {
            currency: getCurrency('HIVE'),
          } as ConvertOperationProps,
        });
      }}
      icon={
        <Icon
          theme={theme}
          name={Icons.CONVERT}
          additionalContainerStyle={styles.buttonMarginRight}
          width={25}
          height={25}
          color={PRIMARY_RED_COLOR}
        />
      }
      primaryLabel={translate('wallet.operations.convert.button')}
    />,
    <SquareButton
      additionalButtonContainerStyle={styles.buttonContainer}
      additionalSquareButtonText={styles.buttonText}
      key={'square-button-savings-hive'}
      onPress={() => {
        navigate('Operation', {
          operation: 'savings',
          props: {
            currency: 'HIVE',
            operation: SavingsOperations.deposit,
          } as SavingOperationProps,
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
      primaryLabel={translate('common.savings')}
    />,
  ];
};
