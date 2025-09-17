import {ActiveAccount} from 'actions/interfaces';
import CurrencySavingLight from 'assets/images/wallet/savings.svg';
import Icon from 'components/hive/Icon';
import {ConvertOperationProps} from 'components/operations/Convert';
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
import {Icons} from 'src/enums/icons.enum';
import {getButtonStyle} from 'src/styles/button';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import {getCurrency} from 'utils/hiveLibs.utils';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation.utils';

export const getHBDButtonList = (user: ActiveAccount, theme: Theme) => {
  const styles = getButtonStyle(
    theme,
    useWindowDimensions().width,
  ).getOperationButtonStylesheet();
  return [
    <SquareButton
      additionalButtonContainerStyle={styles.buttonContainer}
      additionalSquareButtonText={styles.buttonText}
      key={'square-button-transfer-hbd'}
      onPress={() => {
        navigate('Operation', {
          operation: 'transfer',
          props: {
            currency: 'HBD',
            tokenBalance: user.account.hbd_balance as string,
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
      key={'square-button-convert-hbd'}
      onPress={() => {
        navigate('Operation', {
          operation: 'convert',
          props: {
            currency: getCurrency('HBD'),
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
      key={'square-button-savings-hbd'}
      onPress={() => {
        navigate('Operation', {
          operation: 'savings',
          props: {
            currency: 'HBD',
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
