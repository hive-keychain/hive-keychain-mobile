import React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {Width} from 'utils/common.types';

const Marker = () => {
  const styles = getStyles(useWindowDimensions());
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={styles.marker}>
        <View style={[styles.markerSide, styles.topLeft]}></View>
        <View style={[styles.markerSide, styles.topRight]}></View>
        <View style={[styles.markerSide, styles.bottomLeft]}></View>
        <View style={[styles.markerSide, styles.bottomRight]}></View>
      </View>
    </View>
  );
};

const getStyles = ({width}: Width) =>
  StyleSheet.create({
    marker: {
      width: 0.8 * width,
      height: 0.8 * width,
    },
    markerSide: {
      borderColor: 'black',
      borderWidth: 6,
      width: 0.2 * width,
      height: 0.2 * width,
      position: 'absolute',
    },
    topLeft: {
      top: 0,
      left: 0,
      borderBottomWidth: 0,
      borderRightWidth: 0,
    },
    topRight: {
      top: 0,
      right: 0,
      borderBottomWidth: 0,
      borderLeftWidth: 0,
    },
    bottomLeft: {
      bottom: 0,
      left: 0,
      borderTopWidth: 0,
      borderRightWidth: 0,
    },
    bottomRight: {
      bottom: 0,
      right: 0,
      borderTopWidth: 0,
      borderLeftWidth: 0,
    },
  });

export default Marker;
