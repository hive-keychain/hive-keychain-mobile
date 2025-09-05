import {useHeaderHeight} from '@react-navigation/elements';
import {BarcodeScanningResult, Camera, CameraView} from 'expo-camera';
import React, {useEffect} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';

type Props = {
  onSuccess: (event: BarcodeScanningResult) => void;
  topContent?: React.ReactNode;
};

const QRCode = ({onSuccess, topContent}: Props) => {
  const {theme} = useThemeContext();
  useEffect(() => {
    Camera.requestCameraPermissionsAsync();
  }, []);
  return (
    <View style={{flex: 1}}>
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
        onBarcodeScanned={onSuccess}
        style={{flex: 1}}

        // reactivate={true}
        // reactivateTimeout={2000}
        // customMarker={<Marker />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  zeroView: {flex: 0, height: 0},
  cameraContainer: {height: Dimensions.get('window').height},
});

export default QRCode;
