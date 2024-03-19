import HPIconLight from 'assets/new_UI/hp-icon-light.svg';
import PowerDownLight from 'assets/new_UI/power-down-light.svg';
import RCDelegationLight from 'assets/new_UI/rc-delegation-light.svg';
import {DelegationOperationProps} from 'components/operations/Delegation';
import {PowerDownOperationProps} from 'components/operations/PowerDown';
import {RCDelegationOperationProps} from 'components/operations/RCDelegation';
import CustomIconButton from 'components/ui/CustomIconButton';
import SquareButton from 'components/ui/SquareButton';
import React from 'react';
import {useWindowDimensions} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {getCurrency} from 'utils/hive';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

export const getHPButtonList = (theme: Theme, delegatee: string) => {
  const styles = getButtonStyle(
    theme,
    useWindowDimensions().width,
  ).getOperationButtonStylesheet();
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
          darkThemeIcon={<HPIconLight {...styles.icon} />}
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
          darkThemeIcon={<RCDelegationLight {...styles.icon} />}
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
          darkThemeIcon={<PowerDownLight {...styles.icon} />}
          onPress={() => {}}
          additionalContainerStyle={styles.marginRight}
        />
      }
      primaryLabel={translate('wallet.operations.powerdown.title')}
    />,
  ];
};
