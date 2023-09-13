import Backspace from 'assets/new_UI/backspace.svg';
import React, {useContext} from 'react';
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
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
  //TODo bellow, cleanup
  // if (refNumber > 3) {
  //   style.borderTopWidth = 1;
  // }
  // if (refNumber < 10) {
  //   style.borderBottomWidth = 1;
  // }
  // if (refNumber % 3 !== 0) {
  //   style.borderRightWidth = 1;
  // }
  // if (refNumber % 3 !== 1) {
  //   style.borderLeftWidth = 1;
  // }
  style.height =
    refNumber < 10
      ? Math.round(Dimensions.get('window').width * 0.25)
      : Math.round(Dimensions.get('window').width * 0.125);

  const styles = getStyles(theme);
  //TODO bellow
  //  - add the circle around each number
  //  - placed the backspace to the bottom rigth.
  return (
    <TouchableOpacity
      disabled={refNumber === 10}
      onPress={() => onPressElement(number, back)}
      style={{...styles.pinElements, ...style}}>
      {number || number === 0 ? (
        <Text style={styles.number}>{number}</Text>
      ) : null}
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
      {back ? (
        <Backspace
          stroke={getColors(theme).secondaryText}
          width={30}
          height={30}
          style={{
            alignContent: 'flex-end',
            justifyContent: 'flex-end',
          }}
        />
      ) : null}
    </TouchableOpacity>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    pinElements: {
      width: '30%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: 'rgba(255,255,255,0.3)',
      borderWidth: 0,
    },
    number: {
      color: getColors(theme).secondaryText,
      fontSize: 24,
      fontWeight: '700',
    },
    helper: {color: getColors(theme).secondaryText, fontSize: 14},
  });
