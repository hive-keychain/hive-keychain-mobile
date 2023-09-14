import BackspaceDark from 'assets/new_UI/backspace_dark_theme.svg';
import BackspaceLight from 'assets/new_UI/backspace_light_theme.svg';
import React, {useContext} from 'react';
import {
  Dimensions,
  ScaledSize,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';

interface Props {
  number?: number;
  refNumber: number;
  helper?: string;
  back?: boolean;
  onPressElement: (number: number | undefined, back?: boolean) => void;
}

export default ({number, refNumber, helper, back, onPressElement}: Props) => {
  const {theme} = useContext(ThemeContext);
  const style: StyleProp<ViewStyle> = {};
  const dimensionReducer = 0.2;
  //TODo bellow, cleanup
  // if (refNumber > 3) {
  //   style.borderTopWidth = 1;
  // }
  // if (refNumber < 10) {
  //   style.borderBottomWidth = 1;
  // }
  if (refNumber === 10 || refNumber === 12) {
    style.borderWidth = 0;
  }
  // if (refNumber % 3 !== 1) {
  //   style.borderLeftWidth = 1;
  // }
  // style.height =
  //   refNumber < 10
  //     ? Math.round(Dimensions.get('window').width * 0.25)
  //     : Math.round(Dimensions.get('window').width * 0.125);
  const height = Math.round(Dimensions.get('window').width * dimensionReducer);
  style.height = height;
  style.borderRadius = height;

  const styles = getStyles(theme, Dimensions.get('window'), dimensionReducer);
  //TODO bellow
  //  - placed the backspace to the bottom rigth.
  console.log({secondaryText: getColors(theme).secondaryText}); //TODO remove line
  const renderPinElements = () => {
    return (
      <>
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
      </>
    );
  };

  const renderWithGradients = (refNumber: number) => {
    return refNumber !== 10 && refNumber !== 12 ? (
      <LinearGradient
        //TODO bellow find a way to switch using theme, maybe adding gradientShapes: theme ===...
        style={{...styles.pinElements, ...style}}
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
      style={{...styles.pinElements, ...style}}>
      {renderWithGradients(refNumber)}
    </TouchableOpacity>
  );
};

const getStyles = (
  theme: Theme,
  {width}: ScaledSize,
  dimensionReducer: number,
) =>
  StyleSheet.create({
    pinElements: {
      width: width * dimensionReducer,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 8,
      //TODo cleanup
      // borderColor: 'rgba(255, 255, 255, 1)',
      // borderWidth: 1,
    },
    number: {
      color: getColors(theme).secondaryText,
      fontSize: 32,
      fontWeight: '900',
    },
    helper: {color: getColors(theme).secondaryText, fontSize: 12},
    backspace: {
      top: undefined,
      bottom: 0,
      position: 'absolute',
      right: 0,
      width: 40,
      height: 40,
    },
  });
