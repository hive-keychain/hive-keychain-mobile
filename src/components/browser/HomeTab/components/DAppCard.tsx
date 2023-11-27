import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Image from 'react-native-fast-image';
import {Theme} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {body_primary_body_3} from 'src/styles/typography';
import {store} from 'store';
import {Dimensions} from 'utils/common.types';
import {DApp} from 'utils/config';
type Props = {
  dApp: DApp;
  updateTabUrl: (link: string) => void;
  theme: Theme;
};

const DAppCard = ({dApp, updateTabUrl, theme}: Props) => {
  const styles = getStyles(useWindowDimensions(), theme);
  return (
    <TouchableOpacity
      style={[getCardStyle(theme).defaultCardItem, styles.container]}
      onPress={() => {
        let url = dApp.url;
        if (dApp.appendUsername) {
          url += store.getState().activeAccount.name;
        }
        updateTabUrl(url);
      }}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{uri: dApp.icon}} />
      </View>
      <Text style={[styles.textBase, styles.name]}>{dApp.name}</Text>
      <Text style={[styles.textBase, styles.desc]}>{dApp.description}</Text>
    </TouchableOpacity>
  );
};

const getStyles = ({width}: Dimensions, theme: Theme) => {
  return StyleSheet.create({
    container: {
      width: 0.45 * width,
      height: 0.55 * width,
      marginRight: 10,
    },
    imageContainer: {
      alignSelf: 'center',
      width: '60%',
      height: 0.45 * 0.65 * width,
      paddingVertical: 10,
    },
    image: {width: '100%', height: '100%', marginBottom: 20, borderRadius: 10},
    textBase: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_3,
    },
    name: {
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 5,
      marginTop: 10,
    },
    desc: {fontSize: 12, textAlign: 'center'},
  });
};
export default DAppCard;
