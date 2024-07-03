import IndicatorActive from 'assets/new_UI/circle_indicator_active.svg';
import IndicatorInactive from 'assets/new_UI/circle_indicator_inactive.svg';
import IndicatorInactiveLight from 'assets/new_UI/circle_indicator_inactive_light.svg';
import EllipticButton from 'components/form/EllipticButton';
import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {
  NEUTRAL_WHITE_COLOR,
  PRIMARY_RED_COLOR,
  RED_SHADOW_COLOR,
} from 'src/styles/colors';
import {generateBoxShadowStyle} from 'src/styles/shadow';
import {button_link_primary_medium} from 'src/styles/typography';

interface Props {
  buttonsConfig: {
    prevTitle: string;
    nextTitle: string;
    lastTitle: string;
    lastSlideAction?: () => void | any;
  };
  carouselContent: any[];
  renderItem: (item: any) => React.JSX.Element;
  theme: Theme;
}

const Carousel = ({
  buttonsConfig,
  theme,
  carouselContent,
  renderItem,
}: Props) => {
  const [index, setIndex] = useState(0);

  const handleOnPressNextButton = () => {
    if (carouselContent[index + 1]) {
      setIndex((prevIndex) => prevIndex + 1);
    } else {
      if (buttonsConfig.lastSlideAction) {
        buttonsConfig.lastSlideAction();
      } else {
        setIndex(0);
      }
    }
  };

  const getCurrentTitleOnNextSlideButton = () => {
    if (index === carouselContent.length - 1) {
      return buttonsConfig.lastTitle;
    } else {
      return buttonsConfig.nextTitle;
    }
  };

  const drawPageIndicators = (length: number, currentIndex: number) => {
    if (length <= 0) return;
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
    for (let i = 0; i < length; i++) {
      circleArray.push(createCircleAddKey(i, currentIndex === i));
    }
    return circleArray;
  };

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={[styles.pageIndicatorsContainer]}>
          {drawPageIndicators(carouselContent.length, index).map(
            (indicator) => {
              return indicator;
            },
          )}
        </View>
        {carouselContent.map((item) => renderItem(item))}
        <EllipticButton
          title={getCurrentTitleOnNextSlideButton()}
          onPress={() => handleOnPressNextButton()}
          style={[
            styles.warningProceedButton,
            generateBoxShadowStyle(
              0,
              13,
              RED_SHADOW_COLOR,
              1,
              25,
              30,
              RED_SHADOW_COLOR,
            ),
          ]}
          additionalTextStyle={styles.textButtonFilled}
        />
      </SafeAreaView>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      height: '90%',
      width: '90%',
      alignSelf: 'center',
    },
    image: {
      marginBottom: 30,
      aspectRatio: 2,
      alignSelf: 'center',
      width: '80%',
      borderColor: PRIMARY_RED_COLOR,
      borderWidth: 1,
      borderRadius: 16,
    },
    swapByImageIndicatorsContainer: {
      flexDirection: 'column',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
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
    warningProceedButton: {
      backgroundColor: PRIMARY_RED_COLOR,
      width: '80%',
      marginBottom: 20,
    },
    textButtonFilled: {
      ...button_link_primary_medium,
      fontSize: 13,
      color: NEUTRAL_WHITE_COLOR,
    },
  });

export default Carousel;
