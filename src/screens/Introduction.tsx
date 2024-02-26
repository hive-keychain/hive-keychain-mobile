import BackgroundSquares from 'assets/new_UI/background_squares.svg';
import Dots1Dark from 'assets/new_UI/dots_1_dark.svg';
import Dots1Light from 'assets/new_UI/dots_1_light.svg';
import Dots2Dark from 'assets/new_UI/dots_2_dark.svg';
import Dots2Light from 'assets/new_UI/dots_2_light.svg';
import Hand from 'assets/new_UI/hand_1.svg';
import HiveImageSignupDark from 'assets/new_UI/hive_logo_signup_dark.svg';
import HiveImageSignupLight from 'assets/new_UI/hive_logo_signup_light.svg';
import KeychainLogoDark from 'assets/new_UI/keychain_logo_powered_dark_theme.svg';
import KeychainLogoLight from 'assets/new_UI/keychain_logo_powered_light_theme.svg';
import Person1 from 'assets/new_UI/person_1.svg';
import EllipticButton from 'components/form/EllipticButton';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import {IntroductionNavProp} from 'navigators/Signup.types';
import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {
  NEUTRAL_WHITE_COLOR,
  PRIMARY_RED_COLOR,
  getColors,
} from 'src/styles/colors';
import {getSpaceAdjustMultiplier, getSpacing} from 'src/styles/spacing';
import {
  button_link_primary_medium,
  headlines_primary_headline_2,
  title_primary_title_1,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';
import {hiveConfig} from 'utils/config';
import {translate} from 'utils/localize';

const Introduction = ({navigation}: IntroductionNavProp) => {
  const {height, width} = useWindowDimensions();
  const {theme} = useThemeContext();
  const spaced = getSpaceAdjustMultiplier(width, height);
  const styles = getDimensionedStyles(
    {height, width},
    theme,
    spaced.adjustMultiplier,
  );

  const renderLogos = (hiveImage: boolean) => {
    return theme === Theme.LIGHT ? (
      <View style={[styles.centeredView]}>
        <KeychainLogoLight {...styles.imageLogo} />
        {hiveImage && (
          <>
            <Separator height={height * spaced.multiplier * 2} />
            <HiveImageSignupLight {...styles.imageHive} />
          </>
        )}
      </View>
    ) : (
      <View style={[styles.centeredView]}>
        <KeychainLogoDark {...styles.imageLogo} />
        {hiveImage && (
          <>
            <Separator height={height * spaced.multiplier * 2} />
            <HiveImageSignupDark {...styles.imageHive} />
          </>
        )}
      </View>
    );
  };

  const [introductionStepList, setIntroductionStepList] = React.useState<
    JSX.Element[]
  >([
    <>
      <View style={[styles.centeredView, styles.flexAbsCentered]}>
        <BackgroundSquares {...styles.backgroundSquares} />
      </View>
      <View style={[styles.centeredView, styles.flexBetween70]}>
        {renderLogos(false)}
        <Person1 {...styles.imageHive} />
        {theme === Theme.DARK ? <Dots1Dark /> : <Dots1Light />}
        <Text style={{...styles.text, ...headlines_primary_headline_2}}>
          {translate('intro.intro_text_1')}
        </Text>
      </View>
    </>,
    <View style={[styles.centeredView, styles.flexBetween70]}>
      {renderLogos(false)}
      <Hand {...styles.imageHive} />
      {theme === Theme.DARK ? <Dots2Dark /> : <Dots2Light />}
      <Text style={{...styles.text, ...headlines_primary_headline_2}}>
        {translate('intro.intro_text_2')}
      </Text>
    </View>,
    <>
      <View style={[styles.flexBetween70]}>
        {renderLogos(true)}
        <Text style={styles.text}>{translate('intro.text')}</Text>
        <Text style={styles.text}>{translate('intro.manage')}</Text>
      </View>
      <View>
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
            Linking.openURL(hiveConfig.CREATE_ACCOUNT_URL);
          }}
          style={styles.warningProceedButton}
          additionalTextStyle={styles.textButtonFilled}
        />
        <Separator height={height * spaced.multiplier} />
      </View>
    </>,
  ]);
  const [currentStep, setCurrentStep] = React.useState(0);

  const handleNextStep = () => {
    let step = currentStep;
    step++;
    if (introductionStepList[step]) setCurrentStep(step);
  };

  return (
    <Background theme={theme}>
      <>
        <FocusAwareStatusBar
          backgroundColor={getColors(theme).primaryBackground}
          barStyle={theme === Theme.DARK ? 'light-content' : 'dark-content'}
        />
        <GestureRecognizer
          style={styles.flexAround}
          onSwipeLeft={() => handleNextStep()}>
          {introductionStepList[currentStep]}
          {currentStep < introductionStepList.length - 1 && (
            <EllipticButton
              title={translate('common.next')}
              onPress={() => handleNextStep()}
              style={styles.warningProceedButton}
              additionalTextStyle={styles.textButtonFilled}
            />
          )}
        </GestureRecognizer>
      </>
    </Background>
  );
};
const getDimensionedStyles = (
  {width, height}: Dimensions,
  theme: Theme,
  adjustMultiplier: number,
) =>
  StyleSheet.create({
    backgroundSquares: {
      width: width * 0.85,
      bottom: undefined,
    },
    imageLogo: {
      width: width * adjustMultiplier,
    },
    imageHive: {
      width: width * 0.75 * adjustMultiplier,
      height: width * 0.75 * adjustMultiplier,
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
    flexAround: {
      flex: 1,
      justifyContent: 'space-around',
    },
    flexBetween70: {justifyContent: 'space-between', height: '70%'},
    flexAbsCentered: {
      position: 'absolute',
      top: -5,
      bottom: undefined,
      flex: 1,
      alignSelf: 'center',
    },
  });

export default Introduction;
