import KeychainLogoDark from 'assets/new_UI/keychain_logo_powered_dark_theme.svg';
import KeychainLogoLight from 'assets/new_UI/keychain_logo_powered_light_theme.svg';
import UserOnCoins from 'assets/new_UI/user_on_coins.svg';
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
import {button_link_primary_medium} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';
import {hiveConfig} from 'utils/config';
import {translate} from 'utils/localize';

const Introduction = ({navigation}: IntroductionNavProp) => {
  const {height, width} = useWindowDimensions();
  const {theme} = useContext(ThemeContext);
  const styles = getDimensionedStyles({height, width}, theme);
  return (
    <Background using_new_ui={true} theme={theme}>
      <>
        <Separator height={height / 15} />
        {/* //TODO add squares bg */}
        <View
          style={{
            //TODO remove bellow
            borderColor: 'red',
            borderWidth: 1,
          }}>
          {theme === Theme.LIGHT ? (
            <KeychainLogoLight {...styles.imageLogo} />
          ) : (
            <KeychainLogoDark {...styles.imageLogo} />
          )}
          <Separator height={height / 15} />
          <UserOnCoins {...styles.imageUser} />
        </View>
        <Separator height={height * 0.01} />
        {/* <GradientEllipse style={styles.gradient} dotColor="red"> */}
        <Text style={styles.text}>{translate('intro.text')}</Text>
        {/* </GradientEllipse> */}
        {/* <GradientEllipse style={styles.gradient} dotColor="white"> */}
        <Text style={styles.text}>{translate('intro.manage')}</Text>
        {/* </GradientEllipse> */}
        <Separator height={height * 0.01} />
        <EllipticButton
          title={translate('intro.existingAccount')}
          onPress={() => {
            navigation.navigate('SignupScreen');
          }}
          style={styles.outlineButton}
          additionalTextStyle={styles.textOutLineButton}
        />
        <Separator height={height * 0.01} />
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
          //TODO bellow find a better way:
          //  - or create an elliptic button customizable
          //  - or define functions as /styles.
          style={styles.warningProceedButton}
          additionalTextStyle={styles.textButtonFilled}
        />
      </>
    </Background>
  );
};
const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    imageLogo: {
      width: '100%',
      alignSelf: 'center',
    },
    imageUser: {
      width: width * 0.6,
      alignSelf: 'center',
    },
    gradient: {height: height / 10, marginTop: height / 20},
    text: {
      color: 'white',
      marginHorizontal: width * 0.05,
      fontSize: 15,
      textAlign: 'justify',
      // flex: 1,
    },
    outlineButton: {
      borderColor: getColors(theme).borderContrast,
      borderWidth: 1,
      backgroundColor: '#00000000',
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
  });

export default Introduction;
