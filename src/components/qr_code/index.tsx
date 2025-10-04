import {useHeaderHeight} from '@react-navigation/elements';
import {BarcodeScanningResult, CameraView} from 'expo-camera';
import React, {useRef, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import Marker from './MarkerQR';

type Props = {
  onSuccess: (event: BarcodeScanningResult) => void;
  topContent?: React.ReactNode;
};

const QRCode = ({onSuccess, topContent}: Props) => {
  const {theme} = useThemeContext();
  const [scanned, setScanned] = useState(false);
  const lastScannedTimestampRef = useRef(0);

  const handleBarcodeScanned = (event: BarcodeScanningResult) => {
    const timestamp = Date.now();

    if (scanned || timestamp - lastScannedTimestampRef.current < 2000) {
      return;
    }
    lastScannedTimestampRef.current = timestamp;
    setScanned(true);
    onSuccess(event);
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: getColors(theme).primaryBackground,
        overflow: 'hidden',
      }}>
      {topContent ? (
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
      ) : undefined}
      <CameraView
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={handleBarcodeScanned}
        style={{flexGrow: 1}}
        // @ts-ignore ensure iOS doesn’t draw any default bg
        isActive={true}
        active
        // Prevent any platform default background from showing at edges
        // @ts-ignore (prop exists on native side)
        enableTorch={false}></CameraView>
      <Marker />
    </View>
  );
};

const styles = StyleSheet.create({
  zeroView: {flex: 0, height: 0},
  cameraContainer: {height: Dimensions.get('window').height},
});

export default QRCode;
