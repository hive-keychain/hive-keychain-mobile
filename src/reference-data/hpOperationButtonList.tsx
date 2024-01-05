import HPIconLight from 'assets/new_UI/hp-icon-light.svg';
import HPIconDark from 'assets/new_UI/hp_icon_dark.svg';
import PowerDownDark from 'assets/new_UI/power-down-dark.svg';
import PowerDownLight from 'assets/new_UI/power-down-light.svg';
import RPDelegationDark from 'assets/new_UI/rc-delegation-dark.svg';
import RCDelegationLight from 'assets/new_UI/rc-delegation-light.svg';
import {DelegationOperationProps} from 'components/operations/Delegation';
import {PowerDownOperationProps} from 'components/operations/PowerDown';
import {RCDelegationOperationProps} from 'components/operations/RCDelegation';
import CustomIconButton from 'components/ui/CustomIconButton';
import SquareButton from 'components/ui/SquareButton';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {getCurrency} from 'utils/hive';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

export const getHPButtonList = (theme: Theme, delegatee: string) => {
  const styles = getStyles(theme);
  return [
    <SquareButton
      additionalButtonContainerStyle={styles.buttonContainer}
      additionalSquareButtonText={styles.buttonText}
      key={'square-button-hp-delegations'}
      onPress={() => {
        navigate('Operation', {
          operation: 'delegateHP',
          props: {
            currency: getCurrency('HP'),
            delegatee: delegatee,
          } as DelegationOperationProps,
        });
      }}
      icon={
        <CustomIconButton
          theme={theme}
          lightThemeIcon={<HPIconLight {...styles.icon} />}
          darkThemeIcon={<HPIconDark {...styles.icon} />}
          onPress={() => {}}
          additionalContainerStyle={styles.marginRight}
        />
      }
      primaryLabel={translate('wallet.operations.delegation.title_button')}
    />,
    <SquareButton
      additionalButtonContainerStyle={styles.buttonContainer}
      additionalSquareButtonText={styles.buttonText}
      key={'square-button-rc-delegations'}
      onPress={() => {
        navigate('Operation', {
          operation: 'delegateRC',
          props: {} as RCDelegationOperationProps,
        });
      }}
      icon={
        <CustomIconButton
          theme={theme}
          lightThemeIcon={<RCDelegationLight {...styles.icon} />}
          darkThemeIcon={<RPDelegationDark {...styles.icon} />}
          onPress={() => {}}
          additionalContainerStyle={styles.marginRight}
        />
      }
      primaryLabel={translate('wallet.operations.rc_delegation.title_button')}
    />,
    <SquareButton
      additionalButtonContainerStyle={styles.buttonContainer}
      additionalSquareButtonText={styles.buttonText}
      key={'square-button-power-down'}
      onPress={() => {
        navigate('Operation', {
          operation: 'power_down',
          props: {currency: getCurrency('HP')} as PowerDownOperationProps,
        });
      }}
      icon={
        <CustomIconButton
          theme={theme}
          lightThemeIcon={<PowerDownLight {...styles.icon} />}
          darkThemeIcon={<PowerDownDark {...styles.icon} />}
          onPress={() => {}}
          additionalContainerStyle={styles.marginRight}
        />
      }
      primaryLabel={translate('wallet.operations.powerdown.title')}
    />,
  ];
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    icon: {
      width: 20,
      height: 20,
    },
    roundedIcon: {
      borderWidth: 1,
      borderColor: getColors(theme).cardBorderColorContrast,
      borderRadius: 50,
      padding: 0,
      marginRight: 3,
    },
    biggerIcon: {
      width: 30,
      height: 30,
    },
    marginRight: {marginRight: 4},
    buttonContainer: {
      width: '38%',
      height: 70,
      paddingVertical: 0,
      paddingHorizontal: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonText: {fontSize: 14},
  });
