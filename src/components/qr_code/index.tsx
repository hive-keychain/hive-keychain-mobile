import {useHeaderHeight} from '@react-navigation/stack';
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {BarCodeReadEvent} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import Marker from './MarkerQR';

type Props = {
  onSuccess: (event: BarCodeReadEvent) => void;
  topContent?: JSX.Element;
};

const QRCode = ({onSuccess, topContent}: Props) => {
  const {theme} = useThemeContext();
  return (
    <QRCodeScanner
      onRead={onSuccess}
      showMarker
      topContent={
        topContent ? (
          <View
            style={{
              zIndex: 10,
              marginTop: useHeaderHeight() + useSafeAreaInsets().top + 5,
              backgroundColor: getColors(theme).overlay,
              justifyContent: 'center',
              height: 60,
              width: '100%',
              paddingHorizontal: '10%',
            }}>
            {topContent}
          </View>
        ) : undefined
      }
      topViewStyle={topContent ? {flex: 1} : styles.zeroView}
      bottomViewStyle={styles.zeroView}
      cameraStyle={styles.cameraContainer}
      reactivate={true}
      reactivateTimeout={2000}
      customMarker={<Marker />}
    />
  );
};

const styles = StyleSheet.create({
  zeroView: {flex: 0, height: 0},
  cameraContainer: {height: Dimensions.get('window').height},
});

export default QRCode;
