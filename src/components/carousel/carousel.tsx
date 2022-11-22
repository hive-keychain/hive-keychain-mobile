import React, {useState} from 'react';
import {
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';

interface Props {
  nextButtonConfig: {
    nextTitle: string;
    lastTitle: string;
    lastSlideAction?: () => void | any;
  };
  itemData: any[];
}

const Carousel = ({nextButtonConfig, itemData}: Props) => {
  const [index, setIndex] = useState(0);

  const handleOnPressNextButton = (direction: number) => {
    if (direction > 0 && itemData[index + 1]) {
      setIndex((prevIndex) => prevIndex + 1);
    } else {
      if (nextButtonConfig.lastSlideAction) {
        nextButtonConfig.lastSlideAction();
      } else {
        setIndex(0);
      }
    }
  };

  const getCurrentTitleOnNextSlideButton = () => {
    if (index === itemData.length - 1) {
      return nextButtonConfig.lastTitle;
    } else {
      return nextButtonConfig.nextTitle;
    }
  };

  const renderItem = (item: any) => {
    return (
      <View style={styles.itemContainer}>
        <FastImage
          style={styles.image}
          source={{uri: item.image}}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.descriptionText}>{item.description}</Text>
        <Text
          style={styles.externalLink}
          onPress={() => {
            Linking.openURL(item.externalUrl);
          }}>
          {item.overrideReadMoreLabel}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        {renderItem(itemData[index])}
        <View style={styles.buttonsSectionContainer}>
          <TouchableOpacity
            style={styles.buttonsContainer}
            onPress={() => handleOnPressNextButton(1)}>
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
    justifyContent: 'flex-end',
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
});

export default Carousel;
