import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';

export type Category = {
  title: string;
  color: string;
  logo: string;
};

type Props = {
  category: Category;
  setCategory: (c: string) => void;
};

const CategoryButton = ({category, setCategory}: Props) => {
  const styles = getStyles(useWindowDimensions());

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[styles.category, {backgroundColor: category.color}]}
      onPress={() => {
        setCategory(category.title);
      }}>
      <Text style={styles.text}>
        {translate(`browser.home.categories.${category.title}`)}
      </Text>
    </TouchableOpacity>
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

export default CategoryButton;
