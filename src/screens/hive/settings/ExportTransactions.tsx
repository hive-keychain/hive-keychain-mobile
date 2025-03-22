import EllipticButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import UserDropdown from 'components/form/UserDropdown';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_2,
  body_primary_body_3,
  button_link_primary_medium,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
const ExportTransaction = ({active}: PropsFromRedux) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useWindowDimensions());
  const {width, height} = useWindowDimensions();

  return (
    <Background theme={theme}>
      <View style={styles.container}>
        <FocusAwareStatusBar />
        <UserDropdown />
        <Separator height={height / 22} />

        <Text
          style={[
            styles.text,
            styles.opacity,
            styles.paddingHorizontal,
            styles.centeredText,
          ]}>
          {translate('common.from')}
        </Text>
        <OperationInput
          autoCapitalize={'none'}
          labelInput={translate('common.from')}
          placeholder={'mm/dd/yyyy'}
          value={''}
        />

        <Separator height={height / 50} />
        <Text
          style={[
            styles.text,
            styles.opacity,
            styles.paddingHorizontal,
            styles.centeredText,
          ]}>
          {translate('common.to')}
        </Text>
        <OperationInput
          autoCapitalize={'none'}
          labelInput={translate('common.to')}
          placeholder={'mm/dd/yyyy'}
          value={''}
        />
        <Separator height={height / 22} />

        <EllipticButton
          title={translate('common.export')}
          onPress={() => {}}
          additionalTextStyle={styles.buttonText}
          isWarningButton
        />
      </View>
    </Background>
  );
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    container: {flex: 1, paddingHorizontal: 16},
    itemDropdown: {
      paddingHorizontal: 18,
    },
    marginTop: {marginTop: 20},
    text: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_2,
      fontSize: getFontSizeSmallDevices(width, 15),
    },
    textOperations: {
      ...body_primary_body_3,
      fontSize: getFontSizeSmallDevices(
        width,
        {...body_primary_body_3}.fontSize,
      ),
    },
    textNoPref: {
      textAlign: 'center',
      marginTop: 20,
    },
    searchBar: {
      borderRadius: 33,
      marginVertical: 10,
      width: '100%',
      height: 45,
    },
    opacity: {
      opacity: 0.7,
    },
    marginVertical: {
      marginVertical: 15,
    },
    paddingHorizontal: {
      paddingHorizontal: 10,
    },
    centeredText: {textAlign: 'left'},

    flexCentered: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    buttonText: {
      ...button_link_primary_medium,
      fontSize: getFontSizeSmallDevices(
        width,
        {...button_link_primary_medium}.fontSize,
      ),
    },
  });
const mapStateToProps = (state: RootState) => ({
  active: state.activeAccount,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ExportTransaction);
