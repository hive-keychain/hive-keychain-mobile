import {ActiveAccount} from 'actions/interfaces';
import Icon from 'components/hive/Icon';
import {TransferOperationProps} from 'components/operations/transfer/Transfer';
import SquareButton from 'components/ui/SquareButton';
import React from 'react';
import {useWindowDimensions} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getButtonStyle} from 'src/styles/button';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

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
  ];
};
