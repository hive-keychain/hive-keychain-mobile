import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {store} from 'store';
import {Dimensions} from 'utils/common.types';
import {DApp} from 'utils/config';

type Props = {
  dApp: DApp;
  updateTabUrl: (link: string) => void;
};

const DAppCard = ({dApp, updateTabUrl}: Props) => {
  const styles = getStyles(useWindowDimensions());
  console.log(dApp);
  return (
    <TouchableOpacity
      style={styles.container}
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
      <Text style={styles.name}>{dApp.name}</Text>
      <Text style={styles.desc}>{dApp.description}</Text>
    </TouchableOpacity>
  );
};

const getStyles = ({width}: Dimensions) => {
  console.log(width);
  return StyleSheet.create({
    container: {
      width: 0.29 * width,
      height: 0.55 * width,
      backgroundColor: 'white',
      borderRadius: 10,
      paddingHorizontal: 10,
      marginBottom: 20,
    },
    imageContainer: {width: '100%', height: 0.29 * width, paddingVertical: 10},
    image: {width: '100%', height: '100%', marginBottom: 20},
    name: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 5,
    },
    desc: {fontSize: 12, textAlign: 'center'},
  });
};
export default DAppCard;
