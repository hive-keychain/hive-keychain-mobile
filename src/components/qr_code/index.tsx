import {BarcodeScanningResult, CameraView} from 'expo-camera';
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import Marker from './MarkerQR';

type Props = {
  onSuccess: (event: BarcodeScanningResult) => void;
  topContent?: React.ReactNode;
  allowMultipleScans?: boolean;
  scanDebounceMs?: number;
};

const QRCode = ({
  onSuccess,
  topContent,
  allowMultipleScans = false,
  scanDebounceMs = 2000,
}: Props) => {
  const {theme} = useThemeContext();
  const [scanned, setScanned] = useState(false);
  const lastScannedTimestampRef = useRef(0);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const allowMultipleScansRef = useRef(allowMultipleScans);

  // Keep ref in sync with prop
  useEffect(() => {
    allowMultipleScansRef.current = allowMultipleScans;
  }, [allowMultipleScans]);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const handleBarcodeScanned = (event: BarcodeScanningResult) => {
    const timestamp = Date.now();

    if (
      scanned ||
      timestamp - lastScannedTimestampRef.current < scanDebounceMs
    ) {
      return;
    }
    lastScannedTimestampRef.current = timestamp;
    setScanned(true);
    onSuccess(event);

    // Always set timeout to reset after debounce
    // The timeout checks allowMultipleScansRef which is kept in sync with the prop
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }
    resetTimeoutRef.current = setTimeout(() => {
      // Check allowMultipleScansRef at timeout execution time to get current value
      if (allowMultipleScansRef.current) {
        setScanned(false);
      }
    }, scanDebounceMs);
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
            marginTop: 5,
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
