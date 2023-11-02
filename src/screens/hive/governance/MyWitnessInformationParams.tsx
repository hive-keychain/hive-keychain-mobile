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
}

const MyWitnessInformationParams = ({theme, witnessInfo}: Props) => {
  const styles = getStyles(theme);
  return (
    <>
      <Separator height={10} />
      <Text style={[styles.textBase, styles.textBold]}>
        {translate('governance.my_witness.information_signing_key')}
      </Text>
      <Text style={[styles.textBase, styles.smallText, styles.textOpaque]}>
        {witnessInfo.signingKey}
      </Text>
      <Separator />
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
      <Separator />
      <ActiveOperationButton
        byPassForTestings
        title={translate('common.edit')}
        //TODO finish bellow
        onPress={() => {}}
        isLoading={false}
        style={[getCardStyle(theme).defaultCardItem, styles.button]}
      />
      <Separator height={10} />
      <ActiveOperationButton
        byPassForTestings
        title={translate('governance.my_witness.disable_witness')}
        //TODO finish bellow
        onPress={() => {
          navigate('TemplateStack', {
            titleScreen: translate('governance.my_witness.disable_witness'),
            component: <DisableEnableMyWitness mode="disable" theme={theme} />,
          } as TemplateStackProps);
        }}
        isLoading={false}
        style={[getButtonStyle(theme).warningStyleButton, styles.button]}
      />
    </>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    flexBetween: {
      height: '100%',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
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
    buttonsContainer: {
      width: '100%',
    },
    button: {
      width: '90%',
      alignSelf: 'center',
      borderRadius: 48,
    },
  });

export default MyWitnessInformationParams;
