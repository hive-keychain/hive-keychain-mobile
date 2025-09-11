import BgSquares from 'assets/new_UI/background_squares.svg';
import IndicatorActive from 'assets/new_UI/circle_indicator_active.svg';
import IndicatorInactive from 'assets/new_UI/circle_indicator_inactive.svg';
import IndicatorInactiveLight from 'assets/new_UI/circle_indicator_inactive_light.svg';
import HandImage from 'assets/new_UI/hand_1.svg';
import HiveImageSignupDark from 'assets/new_UI/hive_logo_signup_dark.svg';
import HiveImageSignupLight from 'assets/new_UI/hive_logo_signup_light.svg';
import PersonImage from 'assets/new_UI/person_1.svg';
import EllipticButton from 'components/form/EllipticButton';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import {IntroductionNavProp} from 'navigators/Signup.types';
import React, {useEffect, useRef, useState} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
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
  SMALLEST_SCREEN_WIDTH_SUPPORTED,
  button_link_primary_medium,
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
  title_primary_title_1,
} from 'src/styles/typography';
import {translate} from 'utils/localize';

const INTRO_STEPS = 3;

const Introduction = ({navigation}: IntroductionNavProp) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const {height, width} = useWindowDimensions();
  const {theme} = useThemeContext();
  const styles = getDimensionedStyles(
    {height, width},
    theme,
    useSafeAreaInsets(),
  );

  const renderLogos = (pageIndex: number) => {
    const renderBGImage = () => {
      if (pageIndex === 0) {
        return (
          <View style={[styles.flexAbsCentered]}>
            <BgSquares {...styles.backgroundSquares} />
          </View>
        );
      }
    };
    const renderHIVEProperLogo = () =>
      theme === Theme.LIGHT ? (
        <HiveImageSignupLight {...styles.imageHive} />
      ) : (
        <HiveImageSignupDark {...styles.imageHive} />
      );
    const renderImages = () => {
      return (
        <View>
          {pageIndex === 0 && <PersonImage {...styles.imageHive} />}
          {pageIndex === 1 && <HandImage {...styles.imageHive} />}
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

  const [currentStep, setCurrentStep] = useState(0);

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
      const circleKey = `${index}-circle-${Math.random()
        .toFixed(5)
        .toString()}`;
      const indicatorProps = {
        style: {marginRight: 6},
        ...styles.indicatorCircle,
      };
      return active ? (
        <IndicatorActive key={circleKey} {...indicatorProps} />
      ) : theme === Theme.LIGHT ? (
        <IndicatorInactiveLight key={circleKey} {...indicatorProps} />
      ) : (
        <IndicatorInactive key={circleKey} {...indicatorProps} />
      );
    };
    const circleArray: React.ReactNode[] = [];
    for (let i = 0; i < INTRO_STEPS; i++) {
      circleArray.push(createCircleAddKey(i, currentIndex === i));
    }
    return (
      <View
        style={{width: '100%', justifyContent: 'center', flexDirection: 'row'}}>
        {circleArray}
      </View>
    );
  };

  const renderCustomLayout = (
    pageIndex: number,
    textElements: React.ReactNode,
  ) => {
    return (
      <View style={[styles.layoutContainer]}>
        <View style={[styles.layoutTopContainer]}>
          {renderLogos(pageIndex)}
        </View>
        <View style={[{justifyContent: 'center'}]}>{textElements}</View>
      </View>
    );
  };

  return (
    <Background theme={theme}>
      <View style={styles.container}>
        <FocusAwareStatusBar
          backgroundColor={getColors(theme).primaryBackground}
          barStyle={theme === Theme.DARK ? 'light-content' : 'dark-content'}
        />
        {drawPageIndicators(currentStep)}
        <ScrollView
          ref={scrollViewRef}
          style={{flex: 1}}
          horizontal={true}
          bounces={false}
          scrollEventThrottle={0}
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          pagingEnabled={true}>
          {renderCustomLayout(
            0,
            <Text style={[styles.text, styles.biggerText]}>
              {translate('intro.intro_text_1')}
            </Text>,
          )}
          {renderCustomLayout(
            1,
            <Text style={[styles.text, styles.biggerText]}>
              {translate('intro.intro_text_2')}
            </Text>,
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
          )}
        </ScrollView>

        <View style={[{height: 120, justifyContent: 'flex-end'}]}>
          {currentStep === 2 ? (
            <>
              <EllipticButton
                title={translate('common.lets_go')}
                onPress={() => {
                  navigation.navigate('SignupScreen');
                }}
                style={styles.outlineButton}
                additionalTextStyle={styles.textOutLineButton}
              />
            </>
          ) : (
            <EllipticButton
              title={translate('common.next')}
              onPress={handleNextStep}
              style={styles.warningProceedButton}
              additionalTextStyle={styles.textButtonFilled}
            />
          )}
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
      paddingTop: 20,
      paddingBottom: 20,
      justifyContent: 'space-between',
    },
    backgroundSquares: {
      width: width * 0.85,
    },
    imageHive: {
      width: width * (width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 0.65 : 0.75),
      height: width * (width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 0.65 : 0.75),
    },
    text: {
      color: getColors(theme).secondaryText,
      marginHorizontal: 16,
      ...title_primary_title_1,
      textAlign: 'center',
      alignSelf: 'stretch',
      opacity: 0.7,
    },
    outlineButton: {
      backgroundColor: '#FFFFFF',
      zIndex: 10,
      height: getButtonHeight(width),
    },
    textOutLineButton: {
      ...button_link_primary_medium,
      fontSize: 13,
      color: '#212838',
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
    flexAbsCentered: {
      position: 'absolute',
      top: -100,
      alignSelf: 'center',
    },
    indicatorCircle: {
      width: width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 8 : 12,
      height: width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 8 : 12,
    },
    biggerText: {
      ...headlines_primary_headline_2,
      fontSize: getFontSizeSmallDevices(
        width,
        headlines_primary_headline_2.fontSize,
      ),
    },
    layoutContainer: {
      height: '100%',
      width,
      justifyContent: 'space-around',
      flexDirection: 'column',
      alignItems: 'center',
    },
    layoutTopContainer: {
      width: '100%',
      height: 'auto',
    },
  });

export default Introduction;
