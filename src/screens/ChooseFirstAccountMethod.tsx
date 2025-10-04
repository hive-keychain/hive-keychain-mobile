import EllipticButton from 'components/form/EllipticButton';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import {SignupNavProp} from 'navigators/Signup.types';
import React from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Dimensions} from 'src/interfaces/common.interface';
import {getButtonHeight} from 'src/styles/button';
import {
  NEUTRAL_WHITE_COLOR,
  PRIMARY_RED_COLOR,
  getColors,
} from 'src/styles/colors';
import {
  button_link_primary_medium,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {translate} from 'utils/localize';

const ChooseAccountOption = ({navigation}: SignupNavProp) => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles(
    {width, height},
    theme,
    useSafeAreaInsets(),
  );
  return (
    <Background theme={theme} skipTop skipBottom>
      <View style={styles.container}>
        <FocusAwareStatusBar
          backgroundColor={getColors(theme).primaryBackground}
          barStyle={theme === Theme.DARK ? 'light-content' : 'dark-content'}
        />
        <View style={[styles.captionContainer]}>
          <Caption text={'signup.first_account'} />
        </View>
        <View style={styles.buttonsContainer}>
          <EllipticButton
            title={translate('intro.existingAccount')}
            onPress={() => {
              navigation.navigate('AddAccountByKeyScreen');
            }}
            style={styles.outlineButton}
            additionalTextStyle={styles.textOutLineButton}
          />
          <Separator />
          <EllipticButton
            title={translate('navigation.import_all')}
            onPress={() => {
              navigation.navigate('ScanQRScreen');
            }}
            style={styles.outlineButton}
            additionalTextStyle={styles.textOutLineButton}
          />
          <Separator />
          <EllipticButton
            title={translate('intro.createAccount')}
            onPress={() => {
              // Route to AddAccount stack's CreateAccount screen within drawer context
              // For signup flow we still route to local CreateAccountScreen
              navigation.navigate('CreateAccountScreen');
            }}
            style={styles.warningProceedButton}
            additionalTextStyle={styles.textButtonFilled}
          />
        </View>
      </View>
    </Background>
  );
};

const getDimensionedStyles = (
  {width, height}: Dimensions,
  theme: Theme,
  insets: EdgeInsets,
) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 10,
      paddingBottom: 20,
    },
    imagesContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 30,
    },
    buttonsContainer: {
      marginVertical: 20,
    },
    outlineButton: {
      backgroundColor: '#FFFFFF',
      zIndex: 10,
      height: getButtonHeight(width),
    },
    textOutLineButton: {
      ...button_link_primary_medium,
      fontSize: getFontSizeSmallDevices(width, 13),
      color: '#212838',
    },
    warningProceedButton: {
      backgroundColor: PRIMARY_RED_COLOR,
      height: getButtonHeight(width),
    },
    textButtonFilled: {
      ...button_link_primary_medium,
      fontSize: getFontSizeSmallDevices(width, 13),
      color: NEUTRAL_WHITE_COLOR,
    },
    captionContainer: {paddingHorizontal: 16, alignSelf: 'center'},
  });

export default ChooseAccountOption;
