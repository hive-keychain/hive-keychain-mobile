import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {Dimensions} from 'utils/common.types';

export type Category = {
  title: string;
  color: string;
  logo: string;
};

const Category = ({category}: {category: Category}) => {
  const styles = getStyles(useWindowDimensions());

  return (
    <View style={[styles.category, {backgroundColor: category.color}]}>
      <Text style={styles.text}>{category.title}</Text>
    </View>
  );
};

const getStyles = ({width}: Dimensions) =>
  StyleSheet.create({
    category: {
      marginHorizontal: 0.05 * width,
      width: width * 0.9,
      height: 46,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 7,
      borderRadius: 10,
    },
    text: {color: 'white', textTransform: 'uppercase', fontSize: 20},
  });

export default Category;
