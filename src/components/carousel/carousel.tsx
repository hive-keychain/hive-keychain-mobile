import React, {useState} from 'react';
import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';

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
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <SafeAreaView>
        {renderItem(listItems[index])}
        <View style={styles.buttonsContainer}>
          {/* <Button title="Prev" onPress={() => handleMoveSlide(-1)} /> */}
          <Button title="Next" onPress={() => handleMoveSlide(1)} />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '80%',
    justifyContent: 'flex-start',
  },
  itemContainer: {
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default Carousel;
