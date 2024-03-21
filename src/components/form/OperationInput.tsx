import Icon from 'components/hive/Icon';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {InputProps} from 'react-native-elements';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {AutoCompleteValuesType} from 'src/interfaces/autocomplete.interface';
import {getColors} from 'src/styles/colors';
import {inputStyle} from 'src/styles/input';
import {LABEL_INDENT_SPACE} from 'src/styles/spacing';
import {FontPoppinsName} from 'src/styles/typography';
import CustomInput from './CustomInput';

interface OperationInputProps {
  infoIconAction?: () => void;
  labelInput?: string;
  labelExtraInfo?: string;
  labelBottomExtraInfo?: string;
  additionalOuterContainerStyle?: StyleProp<ViewStyle>;
  additionalLabelStyle?: StyleProp<TextStyle>;
  additionalInputContainerStyle?: StyleProp<ViewStyle>;
  additionalBottomLabelContainerStyle?: StyleProp<ViewStyle>;
  additionalBottomLabelTextStyle?: StyleProp<TextStyle>;
  additionalLabelExtraInfoTextStyle?: StyleProp<TextStyle>;
  removeLabelInputIndent?: boolean;
  autoCompleteValues?: AutoCompleteValuesType;
  additionalinfoIconActionColor?: string;
  trim?: boolean;
}

export default ({trim = true, ...props}: InputProps & OperationInputProps) => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, width, height);

  const renderCustomInput = () => (
    <CustomInput
      {...props}
      containerStyle={styles.container}
      additionalInputContainerStyle={props.additionalInputContainerStyle}
      inputColor={getColors(theme).secondaryText}
      autoCompleteValues={props.autoCompleteValues}
      inputStyle={inputStyle(theme, width).input}
      value={trim ? props.value.trim() : props.value}
    />
  );

  return props.labelInput ? (
    <View style={[styles.outerContainer, props.additionalOuterContainerStyle]}>
      <View style={styles.labelInputContainer}>
        <Text
          style={[
            inputStyle(theme, width).label,
            props.additionalLabelStyle,
            props.removeLabelInputIndent ? undefined : styles.labelIndent,
          ]}>
          {props.labelInput}
        </Text>
        {props.infoIconAction && (
          <Icon
            theme={theme}
            name={Icons.INFO}
            onPress={props.infoIconAction}
            additionalContainerStyle={styles.marginLeft}
            color={inputStyle(theme, width).label.color}
          />
        )}
        {props.labelExtraInfo && (
          <Text
            style={[
              styles.smallerLabelSize,
              props.additionalLabelExtraInfoTextStyle,
            ]}>
            {props.labelExtraInfo}
          </Text>
        )}
      </View>
      {renderCustomInput()}
      {props.labelBottomExtraInfo && (
        <View style={props.additionalBottomLabelContainerStyle}>
          <Text style={props.additionalBottomLabelTextStyle}>
            {props.labelBottomExtraInfo}
          </Text>
        </View>
      )}
    </View>
  ) : (
    renderCustomInput()
  );
};

const getStyles = (theme: Theme, width: number, height: number) =>
  StyleSheet.create({
    container: {
      width: '100%',
      display: 'flex',
      marginLeft: 0,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      height: 48,
    },
    outerContainer: {
      display: 'flex',
      width: '100%',
    },
    labelInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      flex: 1,
    },
    smallerLabelSize: {
      marginLeft: 10,
      fontFamily: FontPoppinsName.ITALIC,
      fontSize: 13,
      color: getColors(theme).primaryText,
    },
    marginLeft: {
      marginLeft: 8,
    },
    labelIndent: {
      marginLeft: LABEL_INDENT_SPACE,
    },
  });
