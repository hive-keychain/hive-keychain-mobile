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
  TouchableOpacity,
  View,
} from 'react-native';
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
}

const Carousel = ({buttonsConfig, content, locale}: Props) => {
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

  const handleOnPressPreviousButton = () => {
    if (content.features[locale][index - 1]) {
      setIndex((prevIndex) => prevIndex - 1);
    } else {
      setIndex(content.features[locale].length - 1);
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
    const createCircleAddKey = (index: number, active?: boolean) => (
      <Text
        key={`${index}-circle-${Math.random().toFixed(5).toString()}`}
        style={active ? styles.indicatorCircleActive : styles.indicatorCircle}>
        o
      </Text>
    );
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

  return (
    <View style={styles.container}>
      <SafeAreaView>
        {renderItem(content.features[locale][index])}
        <View style={styles.buttonsSectionContainer}>
          <View style={styles.emptyButtonContainer}>
            {index !== 0 && (
              <TouchableOpacity
                style={[styles.buttonsContainer, {display: 'flex'}]}
                onPress={() => handleOnPressPreviousButton()}>
                <Text>{buttonsConfig.prevTitle}</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.pageIndicatorsContainer}>
            {drawPageIndicators(content.features[locale].length, index).map(
              (indicator) => {
                return indicator;
              },
            )}
          </View>
          <TouchableOpacity
            style={styles.buttonsContainer}
            onPress={() => handleOnPressNextButton()}>
            <Text>{getCurrentTitleOnNextSlideButton()}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '90%',
  },
  itemContainer: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 12,
    marginBottom: 8,
  },
  readMoreText: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonsSectionContainer: {
    width: '100%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginTop: 35,
  },
  emptyButtonContainer: {
    width: 70,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    width: 70,
    height: 30,
  },
  imageContainer: {
    width: '70%',
    height: '70%',
  },
  image: {
    marginBottom: 30,
    aspectRatio: 1.6,
    alignSelf: 'center',
    width: '100%',
  },
  swapByImageIndicatorsContainer: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageIndicatorsContainer: {
    flexDirection: 'row',
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorCircle: {
    marginRight: 5,
    fontWeight: 'normal',
    fontSize: 16,
  },
  indicatorCircleActive: {
    fontWeight: 'bold',
    marginRight: 5,
    fontSize: 16,
  },
});

export default Carousel;
