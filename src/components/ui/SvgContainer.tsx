import React from 'react';
import {StyleSheet, View} from 'react-native';

export const contentSVGProps = {
  preserveAspectRatio: 'xMidYMid meet',
  width: '100%',
  height: '100%',
};

export interface ContainerStylesProps {
  backgroundColor?: string;
  padding?: number;
  borderRadius?: number;
  borderWidth?: number;
  margin?: number;
  svgContainerWidth?: number | string;
}

interface SvgContainerProps {
  svgFile: React.ReactNode;
  containerStyles?: ContainerStylesProps;
}
const SvgContainer = (props: SvgContainerProps) => {
  const styles = getAppliedStyles(props.containerStyles);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.svgContainer}>{props.svgFile}</View>
      </View>
    </View>
  );
};

const getAppliedStyles = (containerStyles: ContainerStylesProps) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      backgroundColor: containerStyles?.backgroundColor ?? 'none',
      padding: containerStyles?.padding ?? 8,
      borderRadius: containerStyles?.borderRadius ?? 8,
      borderWidth: containerStyles?.borderWidth ?? 1,
      margin: containerStyles?.margin ?? 8,
    },
    innerContainer: {
      marginLeft: '0%',
      marginRight: '0%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    svgContainer: {
      width: +(containerStyles?.svgContainerWidth ?? '70%'),
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default SvgContainer;
