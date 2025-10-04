import IndicatorActive from 'assets/images/carousel/circle_indicator_active.svg';
import IndicatorInactive from 'assets/images/carousel/circle_indicator_inactive.svg';
import IndicatorInactiveLight from 'assets/images/carousel/circle_indicator_inactive_light.svg';
import EllipticButton from 'components/form/EllipticButton';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import {Theme} from 'src/context/theme.context';
import {NEUTRAL_WHITE_COLOR, PRIMARY_RED_COLOR} from 'src/styles/colors';
import {button_link_primary_medium} from 'src/styles/typography';

interface Props {
  buttonsConfig: {
    prevTitle: string;
    nextTitle: string;
    lastTitle: string;
    lastSlideAction?: () => void | any;
  };
  content: any[];
  renderItem: (item: any) => React.JSX.Element;
  theme: Theme;
  hideButtons?: boolean;
  moveNext?: boolean;
  resetMoveNext?: () => void;
  enableSwipe?: boolean;
}

const Carousel = ({
  buttonsConfig,
  theme,
  content,
  renderItem,
  hideButtons,
  moveNext,
  resetMoveNext,
  enableSwipe,
}: Props) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (moveNext) {
      setIndex((prevIndex) => prevIndex + 1);
      resetMoveNext();
    }
  }, [moveNext]);

  const handleOnPressNextButton = () => {
    if (content[index + 1]) {
      setIndex((prevIndex) => prevIndex + 1);
    } else {
      if (buttonsConfig.lastSlideAction) {
        buttonsConfig.lastSlideAction();
      } else {
        setIndex(0);
      }
    }
  };

  const handleOnPressPreviousButton = () => {
    if (index > 0) {
      setIndex((prevIndex) => prevIndex - 1);
    }
  };

  const getCurrentTitleOnNextSlideButton = () => {
    if (index === content.length - 1) {
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
    const circleArray: React.JSX.Element[] = [];
    for (let i = 0; i < length; i++) {
      circleArray.push(createCircleAddKey(i, currentIndex === i));
    }
    return circleArray;
  };

  const handleSwipeLeft = () => {
    if (content[index + 1] && enableSwipe) {
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleSwipeRight = () => {
    if (content[index - 1] && enableSwipe) {
      setIndex((prevIndex) => prevIndex - 1);
    }
  };

  const styles = getStyles(theme);

  return (
    <GestureRecognizer
      style={styles.container}
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}>
      <SafeAreaView>
        {content.length > 1 && (
          <View style={[styles.pageIndicatorsContainer]}>
            {drawPageIndicators(content.length, index).map((indicator) => {
              return indicator;
            })}
          </View>
        )}
        {renderItem(content[index])}
        {!hideButtons && (
          <View style={styles.buttonsContainer}>
            <EllipticButton
              title={buttonsConfig.prevTitle}
              onPress={() => handleOnPressPreviousButton()}
              style={[
                styles.warningProceedButton,
                index === 0 ? {opacity: 0} : {},
              ]}
              additionalTextStyle={styles.textButtonFilled}
              disabled={index === 0}
            />
            <EllipticButton
              title={getCurrentTitleOnNextSlideButton()}
              onPress={() => handleOnPressNextButton()}
              style={[styles.warningProceedButton]}
              additionalTextStyle={styles.textButtonFilled}
            />
          </View>
        )}
      </SafeAreaView>
    </GestureRecognizer>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      height: '100%',
      width: '90%',
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
    warningProceedButton: {
      backgroundColor: PRIMARY_RED_COLOR,
      width: '40%',
      marginBottom: 20,
    },
    textButtonFilled: {
      ...button_link_primary_medium,
      fontSize: 13,
      color: NEUTRAL_WHITE_COLOR,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
  });

export default Carousel;
