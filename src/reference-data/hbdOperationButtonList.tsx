import {ActiveAccount} from 'actions/interfaces';
import CurrencySavingDark from 'assets/new_UI/currency-saving-dark.svg';
import CurrencySavingLight from 'assets/new_UI/currency-saving-light.svg';
import Icon from 'components/hive/Icon';
import {
  SavingOperationProps,
  SavingsOperations,
} from 'components/operations/Savings';
import {TransferOperationProps} from 'components/operations/Transfer';
import CustomIconButton from 'components/ui/CustomIconButton';
import SquareButton from 'components/ui/SquareButton';
import React from 'react';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

export const getHBDButtonList = (user: ActiveAccount, theme: Theme) => {
  const styles = getStyles(theme);
  return [
    <SquareButton
      key={'square-button-transfer-hbd'}
      onPress={() => {
        navigate('Operation', {
          operation: 'transfer',
          props: {
            currency: 'HBD',
            tokenBalance: user.account.balance as string,
            engine: false,
            tokenLogo: <></>,
          } as TransferOperationProps,
        });
      }}
      icon={
        <Icon
          theme={theme}
          name="transfer"
          additionalContainerStyle={styles.roundedIcon}
          {...styles.icon}
        />
      }
      primaryLabel={translate('common.send')}
    />,
    <SquareButton
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
          darkThemeIcon={<CurrencySavingDark {...styles.biggerIcon} />}
          onPress={() => {}}
          additionalContainerStyle={styles.roundedIcon}
        />
      }
      primaryLabel={'HIVE'}
      secondaryLabel={translate('common.savings')}
    />,
    <SquareButton
      key={'square-button-convert-hbd'}
      //TODO to test
      onPress={() => {}}
      icon={
        <Icon
          theme={theme}
          name="convert"
          additionalContainerStyle={styles.roundedIcon}
          {...styles.icon}
        />
      }
      primaryLabel={translate('wallet.operations.convert.button')}
    />,
  ];
};

const getStyles = (theme: Theme) => {
  return {
    icon: {
      width: 20,
      height: 20,
    },
    biggerIcon: {
      width: 30,
      height: 30,
    },
    roundedIcon: {
      borderWidth: 1,
      borderColor: getColors(theme).cardBorderColorContrast,
      borderRadius: 50,
      padding: 0,
      marginRight: 3,
    },
  };
};
