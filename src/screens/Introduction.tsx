import HiveImageSignupDark from 'assets/new_UI/hive_logo_signup_dark.svg';
import HiveImageSignupLight from 'assets/new_UI/hive_logo_signup_light.svg';
import KeychainLogoDark from 'assets/new_UI/keychain_logo_powered_dark_theme.svg';
import KeychainLogoLight from 'assets/new_UI/keychain_logo_powered_light_theme.svg';
import EllipticButton from 'components/form/EllipticButton';
import Background from 'components/ui/Background';
import Separator from 'components/ui/Separator';
import {IntroductionNavProp} from 'navigators/Signup.types';
import React, {useContext} from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {
  NEUTRAL_WHITE_COLOR,
  PRIMARY_RED_COLOR,
  getColors,
} from 'src/styles/colors';
import {getSpacing} from 'src/styles/spacing';
import {
  button_link_primary_medium,
  title_primary_title_1,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';
import {hiveConfig} from 'utils/config';
import {capitalizeSentence} from 'utils/format';
import {translate} from 'utils/localize';

const Introduction = ({navigation}: IntroductionNavProp) => {
  const {height, width} = useWindowDimensions();
  const {theme} = useContext(ThemeContext);
  const styles = getDimensionedStyles({height, width}, theme);
  const spaceBase = 0.02;
  const spaceMultiplier: number = height <= 800 ? 0.8 : 2;

  return (
    <Background using_new_ui={true} theme={theme}>
      <View style={styles.flexBetween}>
        <View>
          <Separator height={height * spaceBase * spaceMultiplier} />
          {theme === Theme.LIGHT ? (
            <View style={styles.centeredView}>
              <KeychainLogoLight {...styles.imageLogo} />
              <Separator height={height * spaceBase * spaceMultiplier * 2} />
              <HiveImageSignupLight {...styles.imageHive} />
            </View>
          ) : (
            <View style={styles.centeredView}>
              <KeychainLogoDark {...styles.imageLogo} />
              <Separator height={height * spaceBase * spaceMultiplier * 2} />
              <HiveImageSignupDark {...styles.imageHive} />
            </View>
          )}
          <Separator height={height * spaceBase * spaceMultiplier * 2} />
          <Text style={styles.text}>
            {capitalizeSentence(translate('intro.text'))}
          </Text>
          <Text style={styles.text}>
            {capitalizeSentence(translate('intro.manage'))}
          </Text>
        </View>
        <View>
          <Separator height={height * spaceBase * spaceMultiplier} />
          <EllipticButton
            title={translate('intro.existingAccount')}
            onPress={() => {
              navigation.navigate('SignupScreen');
            }}
            style={styles.outlineButton}
            additionalTextStyle={styles.textOutLineButton}
          />
          <Separator height={height * 0.02} />
          <EllipticButton
            title={translate('intro.createAccount')}
            onPress={() => {
              Linking.canOpenURL(hiveConfig.CREATE_ACCOUNT_URL).then(
                (supported) => {
                  if (supported) {
                    Linking.openURL(hiveConfig.CREATE_ACCOUNT_URL);
                  }
                },
              );
            }}
            style={styles.warningProceedButton}
            additionalTextStyle={styles.textButtonFilled}
          />
          <Separator height={height * spaceBase * spaceMultiplier} />
        </View>
      </View>
    </Background>
  );
};
const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    imageLogo: {
      width: '100%',
    },
    imageHive: {
      width: width * 0.75,
    },
    text: {
      color: getColors(theme).secondaryText,
      marginHorizontal: getSpacing(width).mainmarginHorizontalExtra,
      ...title_primary_title_1,
      textAlign: 'center',
      alignSelf: 'stretch',
      opacity: 0.7,
    },
    outlineButton: {
      borderColor: getColors(theme).borderContrast,
      borderWidth: 1,
      backgroundColor: '#00000000',
      zIndex: 10,
    },
    textOutLineButton: {
      ...button_link_primary_medium,
      fontSize: 13,
      color: getColors(theme).secondaryText,
    },
    warningProceedButton: {
      backgroundColor: PRIMARY_RED_COLOR,
    },
    textButtonFilled: {
      ...button_link_primary_medium,
      fontSize: 13,
      color: NEUTRAL_WHITE_COLOR,
    },
    backgroundImage: {
      alignSelf: 'center',
      position: 'absolute',
      top: 0,
      bottom: undefined,
      zIndex: 1,
    },
    centeredView: {
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    },
    flexBetween: {
      flex: 1,
      justifyContent: 'space-between',
    },
  });

export default Introduction;
