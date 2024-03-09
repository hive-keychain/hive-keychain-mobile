import BACKGROUNDSQUARES from 'assets/new_UI/background_squares.svg';
import IndicatorActive from 'assets/new_UI/circle_indicator_active.svg';
import IndicatorInactive from 'assets/new_UI/circle_indicator_inactive.svg';
import IndicatorInactiveLight from 'assets/new_UI/circle_indicator_inactive_light.svg';
import HANDIMAGE from 'assets/new_UI/hand_1.svg';
import HIVEIMAGESIGNUPDARK from 'assets/new_UI/hive_logo_signup_dark.svg';
import HiveImageSignupLight from 'assets/new_UI/hive_logo_signup_light.svg';
import PERSONIMAGE from 'assets/new_UI/person_1.svg';
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
import {getButtonHeight} from 'src/styles/button';
import {
  NEUTRAL_WHITE_COLOR,
  PRIMARY_RED_COLOR,
  getColors,
} from 'src/styles/colors';
import {getSpaceAdjustMultiplier} from 'src/styles/spacing';
import {
  SMALLEST_SCREEN_WIDTH_SUPPORTED,
  button_link_primary_medium,
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
  title_primary_title_1,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';
import {hiveConfig} from 'utils/config';
import {translate} from 'utils/localize';

const INTROSTEPS = 3;
//TODO
//  -> while coding this task: Fix intro : page is poorly aligned on smaller devices
//    -> if not enough screen height to fit in both sizes(XL & S), remove the Keychain logo.
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

  const renderLogos = (pageIndex: number) => {
    const renderBGImage = () => {
      if (pageIndex === 0) {
        return (
          <View style={[styles.flexAbsCentered]}>
            <BACKGROUNDSQUARES {...styles.backgroundSquares} />
          </View>
        );
      }
    };
    const renderHIVEProperLogo = () =>
      theme === Theme.LIGHT ? (
        <HiveImageSignupLight {...styles.imageHive} />
      ) : (
        <HIVEIMAGESIGNUPDARK {...styles.imageHive} />
      );
    const renderImages = () => {
      return (
        <View>
          {pageIndex === 0 && <PERSONIMAGE {...styles.imageHive} />}
          {pageIndex === 1 && <HANDIMAGE {...styles.imageHive} />}
          {pageIndex === 2 && renderHIVEProperLogo()}
        </View>
      );
    };
    return (
      <View style={[styles.centeredView]}>
        {renderBGImage()}
        {renderImages()}
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
  //TODO cleanup
  const renderCustomLayout = (
    pageIndex: number,
    textElements: JSX.Element,
    buttons: JSX.Element,
  ) => {
    return (
      <View
        style={[
          {flex: 1, justifyContent: 'center', width, height},
          // getBorderTest('red'),
        ]}>
        <View
          style={[
            {
              width: '100%',
              height: height * 0.5,
            },
            // getBorderTest('yellow'),
          ]}>
          {renderLogos(pageIndex)}
        </View>
        <View
          style={[
            {
              width: '100%',
              height: height * 0.04,
              alignItems: 'center',
            },
            // getBorderTest('blue'),
          ]}>
          <View style={[styles.pageIndicatorsContainer]}>
            {drawPageIndicators(pageIndex).map((indicator) => {
              return indicator;
            })}
          </View>
        </View>
        <View
          style={[
            {
              width: '100%',
              height: height * 0.46,
              justifyContent: 'space-between',
              paddingVertical: 20,
            },
            // getBorderTest('purple'),
          ]}>
          <View
            style={[
              {justifyContent: 'center'},
              // getBorderTest('yellow'),
            ]}>
            {textElements}
          </View>
          <View
            style={[
              {justifyContent: 'flex-end'},
              // getBorderTest('red'),
            ]}>
            {buttons}
          </View>
        </View>
      </View>
    );
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
          {renderCustomLayout(
            0,
            <Text style={[styles.text, styles.biggerText]}>
              {translate('intro.intro_text_1')}
            </Text>,
            <EllipticButton
              title={translate('common.next')}
              onPress={handleNextStep}
              style={styles.warningProceedButton}
              additionalTextStyle={styles.textButtonFilled}
            />,
          )}
          {renderCustomLayout(
            1,
            <Text style={[styles.text, styles.biggerText]}>
              {translate('intro.intro_text_2')}
            </Text>,
            <EllipticButton
              title={translate('common.next')}
              onPress={handleNextStep}
              style={styles.warningProceedButton}
              additionalTextStyle={styles.textButtonFilled}
            />,
          )}
          {renderCustomLayout(
            2,
            <>
              <Text style={[styles.text, styles.biggerText]}>
                {translate('intro.text')}
              </Text>
              <Text style={[styles.text, styles.biggerText]}>
                {translate('intro.manage')}
              </Text>
            </>,
            <View
              style={[
                {flex: 1, justifyContent: 'flex-end'},
                // getBorderTest('yellow'),
              ]}>
              <EllipticButton
                title={translate('intro.existingAccount')}
                onPress={() => {
                  navigation.navigate('SignupScreen');
                }}
                style={styles.outlineButton}
                additionalTextStyle={styles.textOutLineButton}
              />
              <Separator height={height * 0.015} />
              <EllipticButton
                title={translate('intro.createAccount')}
                onPress={() => {
                  Linking.openURL(hiveConfig.CREATE_ACCOUNT_URL);
                }}
                style={styles.warningProceedButton}
                additionalTextStyle={styles.textButtonFilled}
              />
            </View>,
          )}
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
    },
    imageLogo: {
      height: width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 30 : 100,
    },
    imageHive: {
      width: width * (width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 0.65 : 0.75),
      height: width * (width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 0.65 : 0.75),
    },
    text: {
      color: getColors(theme).secondaryText,
      marginHorizontal: 10,
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
      height: getButtonHeight(width),
    },
    textOutLineButton: {
      ...button_link_primary_medium,
      fontSize: 13,
      color: getColors(theme).secondaryText,
    },
    warningProceedButton: {
      backgroundColor: PRIMARY_RED_COLOR,
      height: getButtonHeight(width),
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
      top: -100,
      alignSelf: 'center',
    },
    pageIndicatorsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      flex: 1,
    },
    indicatorCircle: {
      width: width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 8 : 12,
      height: width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 8 : 12,
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
