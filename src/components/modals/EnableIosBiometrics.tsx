import EllipticButton from 'components/form/EllipticButton';
import SafeArea from 'components/ui/SafeArea';
import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Width} from 'src/interfaces/common.interface';
import {getColors, PRIMARY_RED_COLOR} from 'src/styles/colors';
import {getSpacing} from 'src/styles/spacing';
import {
  body_primary_body_3,
  button_link_primary_medium,
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation.utils';
import StorageUtils, {BiometricsLoginStatus} from 'utils/storage/storage.utils';

interface Props {
  data: {
    title: string;
  };
}
const EnableIosBiometrics = ({mk, data}: PropsFromRedux & Props) => {
  const {width, height} = useWindowDimensions();
  const {theme} = useThemeContext();
  const styles = getDimensionedStyles({width}, theme);
  const {title} = data;
  return (
    <SafeArea skipTop style={styles.flexSpaceAround}>
      <View>
        <Text
          style={[
            styles.h4,
            styles.textCentered,
            {fontSize: getFontSizeSmallDevices(width, styles.h4.fontSize)},
          ]}>
          {title}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <EllipticButton
          title={translate('common.cancel')}
          onPress={() => {
            goBack();
          }}
          isWarningButton
          style={[styles.warningProceedButton, {backgroundColor: 'grey'}]}
          additionalTextStyle={{...button_link_primary_medium, color: 'white'}}
        />
        <EllipticButton
          title={translate('settings.settings.security.enable_biometrics')}
          onPress={async () => {
            try {
              const res = await StorageUtils.requireBiometricsLoginIOS(title);
              if (res === BiometricsLoginStatus.ENABLED) {
                await StorageUtils.saveOnStore(mk, title);
              }
            } catch (error) {
              console.log(error);
            } finally {
              goBack();
            }
          }}
          style={[styles.warningProceedButton]}
          additionalTextStyle={{...button_link_primary_medium, color: 'white'}}
        />
      </View>
    </SafeArea>
  );
};
const getDimensionedStyles = ({width}: Width, theme: Theme) =>
  StyleSheet.create({
    h4: {
      ...headlines_primary_headline_2,
      color: getColors(theme).secondaryText,
    },
    text: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_3,
      lineHeight: 12 * 2,
    },
    textCentered: {
      textAlign: 'center',
    },
    warningProceedButton: {
      backgroundColor: PRIMARY_RED_COLOR,
      flex: 1,
    },
    marginText: {
      marginHorizontal: getSpacing(width).mainMarginHorizontal,
    },
    flexSpaceAround: {
      flex: 1,
      justifyContent: 'space-around',
    },
  });

const connector = connect(
  (state: RootState) => ({
    mk: state.auth.mk,
  }),
  {},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(EnableIosBiometrics);
