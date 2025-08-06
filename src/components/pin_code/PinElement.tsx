import BackspaceDark from 'assets/new_UI/backspace_dark_theme.svg';
import BackspaceLight from 'assets/new_UI/backspace_light_theme.svg';
import React, {useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  getFontSizeSmallDevices,
  headerH3Primary,
  title_primary_body_2,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';

interface Props {
  number?: number;
  refNumber: number;
  helper?: string;
  back?: boolean;
  onPressElement: (number: number | undefined, back?: boolean) => void;
}

export default ({number, refNumber, helper, back, onPressElement}: Props) => {
  const {theme} = useThemeContext();
  const [activeShape, setActiveshape] = useState(null);
  const [pressed, setPressed] = useState(false);
  const dimensionReducer = 0.2;
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, {width, height}, dimensionReducer, pressed);
  const renderPinElements = (pressed: boolean) => {
    return (
      <View style={styles.pinElements}>
        {number || number === 0 ? (
          <Text style={[styles.number, pressed && styles.pressedText]}>
            {number}
          </Text>
        ) : null}
        {helper ? (
          <Text style={[styles.helper, pressed && styles.pressedText]}>
            {helper}
          </Text>
        ) : null}
        {back ? (
          theme === Theme.DARK ? (
            <BackspaceDark style={styles.backspace} {...styles.backSpaceIcon} />
          ) : (
            <BackspaceLight
              style={styles.backspace}
              {...styles.backSpaceIcon}
            />
          )
        ) : null}
      </View>
    );
  };

  const renderWithGradients = (refNumber: number, pressed: boolean) => {
    return refNumber !== 10 && refNumber !== 12 ? (
      <LinearGradient
        style={styles.pinElements}
        start={{x: 1, y: 0.5}} //initially as {x: 1, y: 0.5}
        end={{x: 1, y: 1.8}} //initially as {x: 1, y: 1.8}
        colors={getColors(theme).gradientShapes}>
        {renderPinElements(pressed)}
      </LinearGradient>
    ) : (
      renderPinElements(pressed)
    );
  };

  return (
    <Pressable
      onPress={() => onPressElement(number, back)}
      style={({pressed}) => {
        return pressed && refNumber !== 12 && refNumber !== 10
          ? [styles.pinElements, styles.pinElementPressed]
          : styles.pinElements;
      }}>
      {({pressed}) => {
        return (
          <>
            {activeShape}
            {renderWithGradients(refNumber, pressed)}
          </>
        );
      }}
    </Pressable>
  );
};

const getStyles = (
  theme: Theme,
  {width, height}: Dimensions,
  dimensionReducer: number,
  pressed: boolean,
) =>
  StyleSheet.create({
    pinElements: {
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      margin: 8,
      width: width * dimensionReducer,
      height: Math.round(width * dimensionReducer),
      borderRadius: width * dimensionReducer,
      transition: 2,
    },
    pinElementPressed: {
      backgroundColor: getColors(theme).primaryRedShape,
    },
    number: {
      flex: 0.65,
      color: !pressed ? getColors(theme).secondaryText : '#FFF',
      ...headerH3Primary,
      includeFontPadding: false,
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: getFontSizeSmallDevices(width, headerH3Primary.fontSize),
    },
    helper: {
      color: !pressed ? getColors(theme).secondaryText : '#FFF',
      ...title_primary_body_2,
      fontSize: getFontSizeSmallDevices(width, title_primary_body_2.fontSize),
    },
    backspace: {
      top: undefined,
      bottom: 0,
      position: 'absolute',
      right: 0,
      width: 40,
      height: 40,
    },
    backSpaceIcon: {
      width: 35,
      height: 35,
    },
    pressedText: {color: 'white'},
  });
