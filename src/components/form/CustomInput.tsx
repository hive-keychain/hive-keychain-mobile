import Separator from 'components/ui/Separator';
import React, {MutableRefObject, useRef, useState} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {Input, InputProps} from 'react-native-elements';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {AutoCompleteValuesType} from 'src/interfaces/autocomplete.interface';
import {getColors} from 'src/styles/colors';
import {getInputHeight} from 'src/styles/input';
import {fields_primary_text_2} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import AutoCompleteBox from './AutoCompleteBox';

type Props = InputProps & {
  textAlign?: string;
  containerStyle?: StyleProp<ViewStyle>;
  additionalInputContainerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  inputColor?: string;
  makeExpandable?: boolean;
  autoCompleteValues?: AutoCompleteValuesType;
  disableFocus?: boolean;
};

export default ({
  backgroundColor,
  inputColor,
  textAlign,
  containerStyle,
  additionalInputContainerStyle,
  makeExpandable,
  autoCompleteValues,
  disableFocus,
  onFocus,
  ...props
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const {theme} = useThemeContext();
  const styles = getDimensionedStyles({
    ...useWindowDimensions(),
    theme,
    backgroundColor,
    inputColor,
    textAlign,
  });
  const ref: MutableRefObject<Input> = useRef(null);
  const handleOnBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };
  const onFocusHandler = () => {
    if (!!onFocus) onFocus(null);
    setIsFocused(true);
    if (disableFocus && ref.current) ref.current.blur();
  };
  const renderInput = () => {
    if (autoCompleteValues) {
      return (
        <View>
          <Input
            autoCapitalize={'none'}
            onBlur={handleOnBlur}
            placeholderTextColor="#B9C9D6"
            containerStyle={[styles.container, containerStyle]}
            inputStyle={styles.input}
            leftIconContainerStyle={styles.leftIcon}
            rightIconContainerStyle={styles.rightIcon}
            inputContainerStyle={[
              styles.inputContainer,
              additionalInputContainerStyle,
            ]}
            {...props}
            onFocus={() => setIsFocused(true)}
          />
          {isFocused && autoCompleteValues && (
            <AutoCompleteBox
              autoCompleteValues={autoCompleteValues}
              handleOnChange={props.onChangeText}
              filterValue={props.value}
            />
          )}
        </View>
      );
    } else
      return (
        <Input
          autoCapitalize={'none'}
          onBlur={handleOnBlur}
          placeholderTextColor="#B9C9D6"
          ref={ref}
          containerStyle={[styles.container, containerStyle]}
          inputStyle={styles.input}
          leftIconContainerStyle={styles.leftIcon}
          rightIconContainerStyle={styles.rightIcon}
          inputContainerStyle={[
            styles.inputContainer,
            additionalInputContainerStyle,
          ]}
          {...props}
          onFocus={onFocusHandler}
        />
      );
  };

  return makeExpandable ? (
    <>
      <View style={styles.flexRow}>
        <Separator
          height={2}
          drawLine
          additionalLineStyle={styles.lineSeparator}
        />
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setIsExpanded(!isExpanded)}>
          <Text style={styles.textBase}>
            {translate('common.search_box_placeholder')}
          </Text>
        </TouchableOpacity>
      </View>
      {isExpanded && renderInput()}
    </>
  ) : (
    renderInput()
  );
};

const getDimensionedStyles = ({
  width,
  height,
  theme,
  backgroundColor,
  inputColor,
  textAlign,
}: Dimensions & {
  theme: Theme;
  backgroundColor?: string;
  inputColor?: string;
  textAlign?: string;
}) =>
  StyleSheet.create({
    container: {
      marginLeft: 0.05 * width,
      marginRight: 0.05 * width,
      width: 0.9 * width,
      backgroundColor: backgroundColor || '#000000',
      borderRadius: 25,
      height: getInputHeight(width),
      borderWidth: 1,
    },
    leftIcon: {height: 30},
    rightIcon: {height: 30, marginLeft: 15},
    input: {color: inputColor || '#ffffff'},
    inputContainer: {
      height: '100%',
      borderBottomWidth: 0,
      textAlign: textAlign || 'left',
    },
    flexRow: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    lineSeparator: {
      width: '85%',
      borderColor: getColors(theme).lineSeparatorStroke,
      position: 'absolute',
      left: -5,
      right: undefined,
    },
    textBase: {
      ...fields_primary_text_2,
      color: getColors(theme).secondaryText,
    },
  });
