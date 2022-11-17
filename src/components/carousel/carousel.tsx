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

interface Props {
  listItems: any;
}
//TODO keep working on the carousel.
const Carousel = ({listItems}: Props) => {
  const [index, setIndex] = useState(0);

  const handleMoveSlide = (direction: number) => {
    if (direction > 0 && listItems[index + 1]) {
      setIndex((prevIndex) => prevIndex + 1);
    } else {
      setIndex(0);
    }
  };

  const renderItem = (item: any) => {
    console.log({item});
    return (
      <View style={[styles.itemContainer, {backgroundColor: item.color}]}>
        {/* <View style={styles.imageContainer}>{image}</View> */}
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
        {renderItem(listItems[index])}
        <View style={styles.buttonsContainer}>
          <Button title="Next" onPress={() => handleMoveSlide(1)} />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '90%',
    // justifyContent: 'flex-start',
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
