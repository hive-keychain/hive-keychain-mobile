import {TabFields} from 'actions/interfaces';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Image from 'react-native-fast-image';
import {Theme} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {body_primary_body_1} from 'src/styles/typography';

type Props = {
  data: TabFields;
  onSubmit: (url: string) => void;
  theme: Theme;
  indexItem?: number;
};
export default ({data, onSubmit, theme, indexItem}: Props) => {
  const {name, url, icon} = data;
  const styles = getStyles(theme);
  return (
    <TouchableOpacity
      style={[getCardStyle(theme).defaultCardItem, styles.card]}
      onPress={() => onSubmit(url)}
      key={`${url}-${indexItem}`}>
      <View style={styles.itemWrapper}>
        <Image style={styles.img} source={{uri: icon}} />
        <View style={styles.text}>
          <Text style={[styles.textBase, styles.name]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={[styles.textBase, styles.textLink]} numberOfLines={1}>
            {url}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    itemWrapper: {
      flexDirection: 'row',
      marginHorizontal: 20,
      marginVertical: 5,
      alignItems: 'center',
    },
    text: {marginLeft: 10},
    name: {fontWeight: 'bold'},
    img: {width: 30, height: 30, borderRadius: 50},
    card: {
      paddingHorizontal: 8,
      paddingVertical: 8,
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_1,
      fontSize: 14,
    },
    textLink: {
      fontSize: 10,
      opacity: 0.6,
    },
  });
