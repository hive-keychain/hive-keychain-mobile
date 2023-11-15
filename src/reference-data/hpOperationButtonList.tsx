import HPIconLight from 'assets/new_UI/hp-icon-light.svg';
import HPIconDark from 'assets/new_UI/hp_icon_dark.svg';
import RPDelegationDark from 'assets/new_UI/rc-delegation-dark.svg';
import RCDelegationLight from 'assets/new_UI/rc-delegation-light.svg';
import {DelegationOperationProps} from 'components/operations/Delegation';
import {RCDelegationOperationProps} from 'components/operations/RCDelegation';
import CustomIconButton from 'components/ui/CustomIconButton';
import SquareButton from 'components/ui/SquareButton';
import React from 'react';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {getCurrency} from 'utils/hive';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

export const getHPButtonList = (theme: Theme, delegatee: string) => {
  const styles = getStyles(theme);
  return [
    <SquareButton
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
  ];
};

const getStyles = (theme: Theme) => {
  return {
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
  };
};
