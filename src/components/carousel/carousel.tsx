import IndicatorActive from 'assets/new_UI/circle_indicator_active.svg';
import IndicatorInactive from 'assets/new_UI/circle_indicator_inactive.svg';
import IndicatorInactiveLight from 'assets/new_UI/circle_indicator_inactive_light.svg';
import EllipticButton from 'components/form/EllipticButton';
import {
  Feature,
  WhatsNewContent,
} from 'components/popups/whats-new/whats-new.interface';
import React, {useState} from 'react';
import {
  Image,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {
  NEUTRAL_WHITE_COLOR,
  PRIMARY_RED_COLOR,
  RED_SHADOW_COLOR,
  getColors,
} from 'src/styles/colors';
import {generateBoxShadowStyle} from 'src/styles/shadow';
import {
  body_primary_body_3,
  button_link_primary_medium,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {translate} from 'utils/localize';

interface Props {
  buttonsConfig: {
    prevTitle: string;
    nextTitle: string;
    lastTitle: string;
    lastSlideAction?: () => void | any;
  };
  content: WhatsNewContent;
  locale: string;
  theme: Theme;
}

const Carousel = ({buttonsConfig, content, locale, theme}: Props) => {
  const [index, setIndex] = useState(0);

  const handleOnPressNextButton = () => {
    if (content.features[locale][index + 1]) {
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
    if (index === content.features[locale].length - 1) {
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

  const handleOnClick = (content: WhatsNewContent, feature: Feature) => {
    if (feature.externalUrl) {
      Linking.openURL(feature.externalUrl);
    } else {
      Linking.openURL(`${content.url}#${feature.anchor}`);
    }
  };

  const renderItem = (feature: Feature) => {
    return (
      <View style={styles.itemContainer}>
        <Image
          style={styles.image}
          source={{uri: feature.image}}
          resizeMode={'contain'}
        />
        <Text style={styles.titleText}>{feature.title}</Text>
        <Text style={styles.descriptionText}>{feature.description}</Text>
        <Text
          style={styles.readMoreText}
          onPress={() => handleOnClick(content, feature)}>
          {feature.overrideReadMoreLabel ?? translate('common.popup_read_more')}
        </Text>
      </View>
    );
  };

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={[styles.pageIndicatorsContainer]}>
          {drawPageIndicators(content.features[locale].length, index).map(
            (indicator) => {
              return indicator;
            },
          )}
        </View>
        {renderItem(content.features[locale][index])}
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
    itemContainer: {
      alignItems: 'center',
      flexDirection: 'column',
    },
    titleText: {
      marginBottom: 8,
      color: getColors(theme).secondaryText,
      ...headlines_primary_headline_2,
      fontSize: 14,
    },
    descriptionText: {
      ...body_primary_body_3,
      color: getColors(theme).secondaryText,
      fontSize: 13,
      marginBottom: 8,
      textAlign: 'center',
    },
    readMoreText: {
      textDecorationLine: 'underline',
      ...body_primary_body_3,
      color: PRIMARY_RED_COLOR,
      fontSize: 15,
      marginBottom: 8,
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
