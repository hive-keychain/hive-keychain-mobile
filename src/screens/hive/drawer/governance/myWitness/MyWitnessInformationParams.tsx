import ActiveOperationButton from 'components/form/ActiveOperationButton';
import EllipticButton from 'components/form/EllipticButton';
import Separator from 'components/ui/Separator';
// import {TemplateStackProps} from 'navigators/Root.types';
import React from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Theme} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {spacingStyle} from 'src/styles/spacing';
import {
  FontPoppinsName,
  button_link_primary_small,
} from 'src/styles/typography';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation.utils';
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
  const {width} = useWindowDimensions();
  const styles = getStyles(theme, width);
  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <Text style={[styles.textBase, styles.textBold]}>
        {translate('governance.my_witness.information_signing_key')}
      </Text>
      <Text style={[styles.textBase, styles.smallText, styles.textOpaque]}>
        {witnessInfo.signingKey}
      </Text>
      <Separator height={24} />
      <View style={styles.flexRowWrapped}>
        <MyWitnessDataBlock
          theme={theme}
          labelTranslationKey="governance.my_witness.information_maximum_block_size"
          value={witnessInfo.params.maximumBlockSize}
        />
        <MyWitnessDataBlock
          theme={theme}
          labelTranslationKey="governance.my_witness.information_hbd_interest_rate"
          value={`${witnessInfo.params.hbdInterestRate.toFixed(2)}%`}
        />
        <MyWitnessDataBlock
          theme={theme}
          labelTranslationKey="governance.my_witness.information_account_creation_fee"
          value={witnessInfo.params.accountCreationFeeFormatted}
        />
      </View>
      <View style={spacingStyle.fillSpace}></View>
      <View style={styles.marginBottom}>
        <EllipticButton
          title={translate('common.edit')}
          onPress={setEditMode}
          isLoading={false}
          style={[getButtonStyle(theme).secondaryButton, styles.editButton]}
          additionalTextStyle={styles.editButtonText}
        />

        <ActiveOperationButton
          title={translate('governance.my_witness.disable_witness')}
          onPress={() =>
            navigate('ToggleWitness', {
              title: translate(
                `governance.my_witness.${
                  witnessInfo.isDisabled ? 'enable' : 'disable'
                }_witness`,
              ),
              mode: witnessInfo.isDisabled ? 'enable' : 'disable',
              witnessInfo,
            })
          }
          isLoading={false}
          style={[getButtonStyle(theme).warningStyleButton, styles.button]}
        />
      </View>
    </ScrollView>
  );
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    flexRowWrapped: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
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
    editButton: {
      width: '90%',
      alignSelf: 'center',
      marginBottom: 16,
    },
    editButtonText: {
      color: getColors(theme).secondaryText,
    },
  });

export default MyWitnessInformationParams;
