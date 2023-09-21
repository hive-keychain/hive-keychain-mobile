import BackspaceDark from 'assets/new_UI/backspace_dark_theme.svg';
import BackspaceLight from 'assets/new_UI/backspace_light_theme.svg';
import React, {useContext} from 'react';
import {
  Dimensions,
  ScaledSize,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {headerH2Primary, title_primary_body_2} from 'src/styles/typography';

interface Props {
  number?: number;
  refNumber: number;
  helper?: string;
  back?: boolean;
  onPressElement: (number: number | undefined, back?: boolean) => void;
}

export default ({number, refNumber, helper, back, onPressElement}: Props) => {
  const {theme} = useContext(ThemeContext);
  const dimensionReducer = 0.2;
  const styles = getStyles(theme, Dimensions.get('window'), dimensionReducer);

  const renderPinElements = () => {
    return (
      <View style={styles.pinElements}>
        {number || number === 0 ? (
          <Text style={styles.number}>{number}</Text>
        ) : null}
        {helper ? <Text style={styles.helper}>{helper}</Text> : null}
        {back ? (
          theme === Theme.DARK ? (
            <BackspaceDark style={styles.backspace} />
          ) : (
            <BackspaceLight style={styles.backspace} />
          )
        ) : null}
      </View>
    );
  };

  const renderWithGradients = (refNumber: number) => {
    return refNumber !== 10 && refNumber !== 12 ? (
      <LinearGradient
        style={styles.pinElements}
        start={{x: 1, y: 0.5}}
        end={{x: 1, y: 1.8}}
        colors={getColors(theme).gradientShapes}>
        {renderPinElements()}
      </LinearGradient>
    ) : (
      renderPinElements()
    );
  };

  return (
    <TouchableOpacity
      disabled={refNumber === 10}
      onPress={() => onPressElement(number, back)}
      style={styles.pinElements}>
      {renderWithGradients(refNumber)}
    </TouchableOpacity>
  );
};

const getStyles = (
  theme: Theme,
  {width, height}: ScaledSize,
  dimensionReducer: number,
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
    },
    number: {
      flex: 0.65,
      color: getColors(theme).secondaryText,
      ...headerH2Primary,
      includeFontPadding: false,
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    helper: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
    },
    backspace: {
      top: undefined,
      bottom: 0,
      position: 'absolute',
      right: 0,
      width: 40,
      height: 40,
    },
  });
