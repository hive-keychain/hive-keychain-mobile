import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {BarCodeReadEvent} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Marker from './MarkerQR';

type Props = {
  onSuccess: (event: BarCodeReadEvent) => void;
};

const QRCode = ({onSuccess}: Props) => {
  return (
    <QRCodeScanner
      onRead={onSuccess}
      showMarker
      topViewStyle={styles.zeroView}
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
