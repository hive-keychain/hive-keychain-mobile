import ActiveOperationButton from 'components/form/ActiveOperationButton';
import Separator from 'components/ui/Separator';
import {TemplateStackProps} from 'navigators/Root.types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {
  FontPoppinsName,
  button_link_primary_small,
} from 'src/styles/typography';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import DisableEnableMyWitness from './DisableEnableMyWitness';
import MyWitnessDataBlock from './MyWitnessDataBlock';

interface Props {
  theme: Theme;
  witnessInfo: any;
  setEditMode: () => void;
}

const MyWitnessInformationParams = ({
  theme,
  witnessInfo,
  setEditMode,
}: Props) => {
  const styles = getStyles(theme);
  return (
    <>
      <Text style={[styles.textBase, styles.textBold]}>
        {translate('governance.my_witness.information_signing_key')}
      </Text>
      <Text style={[styles.textBase, styles.smallText, styles.textOpaque]}>
        {witnessInfo.signingKey}
      </Text>
      <View style={styles.flexRowWrapped}>
        <MyWitnessDataBlock
          theme={theme}
          labelTranslationKey="governance.my_witness.information_maximum_block_size"
          value={witnessInfo.params.maximumBlockSize}
        />
        <MyWitnessDataBlock
          theme={theme}
          labelTranslationKey="governance.my_witness.information_account_creation_fee"
          value={witnessInfo.params.accountCreationFeeFormatted}
        />
        <MyWitnessDataBlock
          theme={theme}
          labelTranslationKey="governance.my_witness.information_hbd_interest_rate"
          value={`${witnessInfo.params.hbdInterestRate.toFixed(2)}%`}
        />
      </View>
      <Separator height={50} />
      <View style={styles.marginBottom}>
        <ActiveOperationButton
          title={translate('common.edit')}
          onPress={setEditMode}
          isLoading={false}
          style={[getCardStyle(theme).defaultCardItem, styles.button]}
        />
        <Separator height={10} />
        <ActiveOperationButton
          title={translate('governance.my_witness.disable_witness')}
          onPress={() => {
            navigate('TemplateStack', {
              titleScreen: translate(
                `governance.my_witness.${
                  witnessInfo.isDisabled ? 'enable' : 'disable'
                }_witness`,
              ),
              component: (
                <DisableEnableMyWitness
                  mode={witnessInfo.isDisabled ? 'enable' : 'disable'}
                  theme={theme}
                  witnessInfo={witnessInfo}
                />
              ),
            } as TemplateStackProps);
          }}
          isLoading={false}
          style={[getButtonStyle(theme).warningStyleButton, styles.button]}
        />
      </View>
    </>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    flexRowWrapped: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    textBold: {
      fontFamily: FontPoppinsName.BOLD,
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...button_link_primary_small,
    },
    textOpaque: {
      opacity: 0.6,
    },
    smallText: {
      fontSize: 11,
    },
    button: {
      width: '90%',
      alignSelf: 'center',
      borderRadius: 48,
    },
    marginBottom: {
      marginBottom: 15,
    },
  });

export default MyWitnessInformationParams;
