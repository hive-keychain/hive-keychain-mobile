import BackgroundSquares from 'assets/new_UI/background_squares.svg';
import IndicatorActive from 'assets/new_UI/circle_indicator_active.svg';
import IndicatorInactive from 'assets/new_UI/circle_indicator_inactive.svg';
import IndicatorInactiveLight from 'assets/new_UI/circle_indicator_inactive_light.svg';
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
import React, {useEffect, useRef} from 'react';
import {
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {
  NEUTRAL_WHITE_COLOR,
  PRIMARY_RED_COLOR,
  getColors,
} from 'src/styles/colors';
import {getSpaceAdjustMultiplier, getSpacing} from 'src/styles/spacing';
import {
  button_link_primary_medium,
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
  title_primary_title_1,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';
import {hiveConfig} from 'utils/config';
import {translate} from 'utils/localize';

const INTROSTEPS = 3;

const Introduction = ({navigation}: IntroductionNavProp) => {
  const scrollViewRef = useRef();
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

  const [currentStep, setCurrentStep] = React.useState(0);

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  useEffect(() => {
    if (scrollViewRef && scrollViewRef.current) {
      (scrollViewRef.current as any).scrollTo({
        x: width * currentStep,
        animated: true,
      });
    }
  }, [currentStep]);

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const {x} = event.nativeEvent.contentOffset;
    const indexOfNextScreen = Math.round(x / width);
    setCurrentStep(indexOfNextScreen);
  };

  const drawPageIndicators = (currentIndex: number) => {
    const createCircleAddKey = (index: number, active?: boolean) => {
      const key = `${index}-circle-${Math.random().toFixed(5).toString()}`;
      const indicatorProps = {
        key: key,
        style: {marginRight: 6},
        ...styles.indicatorCircle,
      };
      return active ? (
        <IndicatorActive {...indicatorProps} />
      ) : theme === Theme.LIGHT ? (
        <IndicatorInactiveLight {...indicatorProps} />
      ) : (
        <IndicatorInactive {...indicatorProps} />
      );
    };
    const circleArray: JSX.Element[] = [];
    for (let i = 0; i < INTROSTEPS; i++) {
      circleArray.push(createCircleAddKey(i, currentIndex === i));
    }
    return circleArray;
  };

  return (
    <Background theme={theme}>
      <View style={{flex: 1}}>
        <FocusAwareStatusBar
          backgroundColor={getColors(theme).primaryBackground}
          barStyle={theme === Theme.DARK ? 'light-content' : 'dark-content'}
        />
        <ScrollView
          ref={scrollViewRef}
          style={{flex: 1}}
          horizontal={true}
          scrollEventThrottle={0}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          pagingEnabled={true}>
          <View style={styles.scrollableScreen}>
            <Separator height={10} />
            <View style={[styles.centeredView, styles.flexAbsCentered]}>
              <BackgroundSquares {...styles.backgroundSquares} />
            </View>
            <View style={[styles.centeredView, styles.flexBetween70]}>
              {renderLogos(false)}
              <Person1 {...styles.imageHive} />
              <View style={[styles.pageIndicatorsContainer]}>
                {drawPageIndicators(0).map((indicator) => {
                  return indicator;
                })}
              </View>
              <Text style={[styles.text, styles.biggerText]}>
                {translate('intro.intro_text_1')}
              </Text>
            </View>
            <EllipticButton
              title={translate('common.next')}
              onPress={handleNextStep}
              style={styles.warningProceedButton}
              additionalTextStyle={styles.textButtonFilled}
            />
            <Separator height={10} />
          </View>

          <View style={[styles.scrollableScreen]}>
            <Separator height={10} />
            <View style={[styles.centeredView, styles.flexBetween70]}>
              {renderLogos(false)}
              <Hand {...styles.imageHive} />
              <View style={[styles.pageIndicatorsContainer]}>
                {drawPageIndicators(1).map((indicator) => {
                  return indicator;
                })}
              </View>
              <Text style={[styles.text, styles.biggerText]}>
                {translate('intro.intro_text_2')}
              </Text>
            </View>
            <EllipticButton
              title={translate('common.next')}
              onPress={handleNextStep}
              style={styles.warningProceedButton}
              additionalTextStyle={styles.textButtonFilled}
            />
            <Separator height={10} />
          </View>

          <View style={styles.scrollableScreen}>
            <Separator height={10} />
            <View style={[styles.centeredView, styles.flexBetween60]}>
              {renderLogos(true)}
              <View style={[styles.pageIndicatorsContainer]}>
                {drawPageIndicators(2).map((indicator) => {
                  return indicator;
                })}
              </View>
              <View>
                <Text style={[styles.text, styles.dynamicTextSize]}>
                  {translate('intro.text')}
                </Text>
                <Text style={[styles.text, styles.dynamicTextSize]}>
                  {translate('intro.manage')}
                </Text>
              </View>
            </View>
            <View style={{width: '100%'}}>
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
            </View>
            <Separator height={10} />
          </View>
        </ScrollView>
      </View>
    </Background>
  );
};
const getDimensionedStyles = (
  {width, height}: Dimensions,
  theme: Theme,
  adjustMultiplier: number,
) =>
  StyleSheet.create({
    scrollableScreen: {
      width,
      height,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
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
    centeredView: {
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    },
    flexBetween70: {justifyContent: 'space-between', height: '70%'},
    flexBetween60: {justifyContent: 'space-between', height: '60%'},
    flexAbsCentered: {
      position: 'absolute',
      top: -5,
      bottom: undefined,
      flex: 1,
      alignSelf: 'center',
    },
    pageIndicatorsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignContent: 'center',
      marginBottom: 10,
      alignSelf: 'center',
    },
    indicatorCircle: {
      width: 12,
      height: 12,
    },
    dynamicTextSize: {
      fontSize: getFontSizeSmallDevices(width, 16),
    },
    biggerText: {
      ...headlines_primary_headline_2,
      fontSize: getFontSizeSmallDevices(
        width,
        headlines_primary_headline_2.fontSize,
      ),
    },
  });

export default Introduction;
