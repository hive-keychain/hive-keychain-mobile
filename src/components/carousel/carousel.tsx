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
  itemData: any[];
}

const Carousel = ({buttonsConfig, itemData}: Props) => {
  const [index, setIndex] = useState(0);
  console.log({itemData});
  const handleOnPressNextButton = () => {
    if (itemData[index + 1]) {
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
    if (itemData[index - 1]) {
      setIndex((prevIndex) => prevIndex - 1);
    } else {
      setIndex(itemData.length - 1);
    }
  };

  const getCurrentTitleOnNextSlideButton = () => {
    if (index === itemData.length - 1) {
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

  //TODO missing handleOnClick on link as there is 2 types: link or ...(check the extension)
  const renderItem = (item: any) => {
    return (
      <View style={styles.itemContainer}>
        {/* <FastImage
          style={styles.image}
          source={{uri: item.image}}
          onLoadEnd={() => console.log('Img loaded!')}
          resizeMode={FastImage.resizeMode.contain}
        /> */}
        <Image
          style={styles.image}
          source={{uri: item.image}}
          resizeMode={'contain'}
        />
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.descriptionText}>{item.description}</Text>
        <Text
          style={styles.externalLink}
          onPress={() => {
            Linking.openURL(item.externalUrl);
          }}>
          {item.overrideReadMoreLabel ?? translate('common.popup_read_more')}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        {renderItem(itemData[index])}
        <View style={styles.buttonsSectionContainer}>
          {index != 0 && (
            <TouchableOpacity
              style={styles.buttonsContainer}
              onPress={() => handleOnPressPreviousButton()}>
              <Text>{buttonsConfig.prevTitle}</Text>
            </TouchableOpacity>
          )}
          <View style={styles.pageIndicatorsContainer}>
            {drawPageIndicators(itemData.length, index).map((indicator) => {
              return indicator;
            })}
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
  externalLink: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  buttonsSectionContainer: {
    width: '100%',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    width: 70,
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
