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
import {
  body_primary_body_3,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {store} from 'store';
import {Dimensions} from 'utils/common.types';
import {DApp} from 'utils/config';
type Props = {
  dApp: DApp;
  updateTabUrl: (link: string) => void;
  theme: Theme;
};

const DAppCard = ({dApp, updateTabUrl, theme}: Props) => {
  console.log({dApp}); //TODO remove line
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

const getStyles = ({width, height}: Dimensions, theme: Theme) => {
  return StyleSheet.create({
    container: {
      width: 0.45 * width,
      height: 0.6 * width,
      marginRight: 10,
    },
    imageContainer: {
      alignSelf: 'center',
      height: 0.21 * width,
      width: 0.21 * width,
      padding: 10,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_3,
    },
    name: {
      fontSize: getFontSizeSmallDevices(height, 14),
      textAlign: 'center',
      marginBottom: 5,
      marginTop: 10,
    },
    desc: {fontSize: getFontSizeSmallDevices(height, 12), textAlign: 'center'},
  });
};
export default DAppCard;
