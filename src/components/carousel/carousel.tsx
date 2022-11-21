import React, {useState} from 'react';
import {
  Button,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {WhatsNewContent} from '../popups/whats-new/whats-new.interface';

interface Props {
  whatsNewContent: WhatsNewContent;
  locale: string;
  nextButtonConfig: {
    nextTitle: string;
    lastTitle: string;
    lastSlideAction?: any; //TODO set type
  };
}
//TODO save in async storage & have 2 options to load from
const Carousel = ({whatsNewContent, locale, nextButtonConfig}: Props) => {
  const [index, setIndex] = useState(0);

  const handleOnPressNextButton = (direction: number) => {
    if (direction > 0 && whatsNewContent.features[locale][index + 1]) {
      setIndex((prevIndex) => prevIndex + 1);
    } else {
      if (nextButtonConfig.lastSlideAction) {
        nextButtonConfig.lastSlideAction();
      } else {
        setIndex(0);
      }
    }
  };

  const renderItem = (item: any) => {
    console.log({item});
    return (
      <View style={[styles.itemContainer, {backgroundColor: item.color}]}>
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

  const getCurrentTitleOnNextSlideButton = () => {
    if (index === whatsNewContent.features[locale].length - 1) {
      return nextButtonConfig.lastTitle;
    } else {
      return nextButtonConfig.nextTitle;
    }
  };
  return (
    <View style={styles.container}>
      <SafeAreaView>
        {renderItem(whatsNewContent.features[locale][index])}
        <View style={styles.buttonsContainer}>
          <Button
            title={getCurrentTitleOnNextSlideButton()}
            onPress={() => handleOnPressNextButton(1)}
          />
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
    height: '90%',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column',
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  descriptionText: {
    fontSize: 12,
  },
  externalLink: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
});

export default Carousel;
