import {PriceType} from '@hiveio/dhive';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import EllipticButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {
  WitnessFormField,
  WitnessParamsForm,
} from 'src/interfaces/witness.interface';
import {getButtonStyle} from 'src/styles/button';
import {BACKGROUNDDARKBLUE, getColors} from 'src/styles/colors';
import {spacingStyle} from 'src/styles/spacing';
import {
  button_link_primary_medium,
  title_primary_body_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import {getCurrency} from 'utils/hive';
import {translate} from 'utils/localize';
import {updateWitnessParameters} from 'utils/witness.utils';

interface Props {
  theme: Theme;
  witnessInfo: any;
  setEditMode: (value: boolean) => void;
}

const EditMyWitness = ({
  theme,
  witnessInfo,
  setEditMode,
  user,
}: Props & PropsFromRedux) => {
  const [formParams, setFormParams] = useState<WitnessParamsForm>({
    accountCreationFee: witnessInfo.params.accountCreationFee,
    maximumBlockSize: witnessInfo.params.maximumBlockSize,
    hbdInterestRate: witnessInfo.params.hbdInterestRate,
    signingKey: witnessInfo.signingKey,
    url: witnessInfo.url,
  });
  const [loading, setLoading] = useState(false);
  const styles = getStyles(theme);

  const handleFormParams = (
    name: WitnessFormField,
    value: string | PriceType,
  ) => {
    setFormParams((prevFormParams) => {
      return {...prevFormParams, [name]: value};
    });
  };

  const updateWitness = async () => {
    try {
      const success = await updateWitnessParameters(
        user.name!,
        formParams,
        user.keys.active!,
      );
      if (success) {
        SimpleToast.show(
          translate('governance.my_witness.success_witness_account_update'),
          SimpleToast.LONG,
        );
      } else {
        SimpleToast.show(
          translate('toast.error_witness_account_update', {
            account: user.name!,
          }),
          SimpleToast.LONG,
        );
      }
    } catch (error) {
      console.log({error});
      SimpleToast.show(error.message, SimpleToast.LONG);
    } finally {
      setLoading(false);
      setEditMode(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <Separator />
      <View style={styles.flexRowBetween}>
        <OperationInput
          labelInput={translate('common.currency')}
          placeholder={getCurrency('HIVE')}
          value={getCurrency('HIVE')}
          editable={false}
          additionalOuterContainerStyle={{
            width: '40%',
          }}
        />
        <OperationInput
          keyboardType="decimal-pad"
          labelInput={translate(
            'governance.my_witness.information_account_creation_fee',
          )}
          placeholder={translate('common.enter_amount')}
          value={formParams.accountCreationFee.toString()}
          onChangeText={(text) => handleFormParams('accountCreationFee', text)}
          additionalOuterContainerStyle={{
            width: '54%',
          }}
        />
      </View>
      <Separator />
      <OperationInput
        labelInput={translate(
          'governance.my_witness.information_maximum_block_size',
        )}
        placeholder={translate(
          'governance.my_witness.information_maximum_block_size',
        )}
        value={formParams.maximumBlockSize.toString()}
        onChangeText={(text) => handleFormParams('maximumBlockSize', text)}
      />
      <Separator />
      <OperationInput
        labelInput={translate(
          'governance.my_witness.information_hbd_interest_rate',
        )}
        placeholder={translate(
          'governance.my_witness.information_hbd_interest_rate',
        )}
        value={formParams.hbdInterestRate.toString()}
        onChangeText={(text) => handleFormParams('hbdInterestRate', text)}
      />
      <Separator />
      <OperationInput
        labelInput={translate('governance.my_witness.information_signing_key')}
        placeholder={translate('governance.my_witness.information_signing_key')}
        value={formParams.signingKey}
        onChangeText={(text) => handleFormParams('signingKey', text)}
      />
      <Separator />
      <OperationInput
        labelInput={translate('common.url')}
        placeholder={translate('common.url')}
        value={formParams.url}
        onChangeText={(text) => handleFormParams('url', text)}
      />
      <Separator />
      <View style={spacingStyle.fillSpace} />
      <View style={styles.buttonsContainer}>
        <EllipticButton
          title={translate('common.cancel')}
          onPress={() => setEditMode(false)}
          style={[styles.operationButton, styles.operationButtonConfirmation]}
          additionalTextStyle={[
            styles.operationButtonText,
            styles.buttonTextColorDark,
          ]}
        />
        <ActiveOperationButton
          title={translate('common.save')}
          onPress={() => updateWitness()}
          style={[
            styles.operationButton,
            getButtonStyle(theme).warningStyleButton,
          ]}
          additionalTextStyle={styles.operationButtonText}
          isLoading={loading}
        />
      </View>
    </ScrollView>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    operationButton: {
      width: '48%',
      marginHorizontal: 0,
    },
    operationButtonConfirmation: {
      backgroundColor: '#FFF',
    },
    operationButtonText: {
      ...button_link_primary_medium,
    },
    buttonTextColorDark: {
      color: BACKGROUNDDARKBLUE,
    },
    flexRowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    text: {
      ...title_primary_body_2,
      color: getColors(theme).secondaryText,
    },
    smallerText: {
      fontSize: 9,
    },
    fullWidth: {
      width: '100%',
    },
    zeroMarginHorizontal: {
      marginHorizontal: 0,
    },
  });

const connector = connect((state: RootState) => {
  return {user: state.activeAccount};
}, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(EditMyWitness);
