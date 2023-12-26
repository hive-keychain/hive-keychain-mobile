import Icon from 'components/hive/Icon';
import React, {useContext} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {InputProps} from 'react-native-elements';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getColors} from 'src/styles/colors';
import {FontPoppinsName, body_primary_body_1} from 'src/styles/typography';
import CustomInput from './CustomInput';

interface OperationInputProps {
  infoIconAction?: () => void;
  labelInput?: string;
  labelExtraInfo?: string;
  labelBottomExtraInfo?: string;
  additionalOuterContainerStyle?: StyleProp<ViewStyle>;
  additionalLabelStyle?: StyleProp<ViewStyle>;
  additionalInputContainerStyle?: StyleProp<ViewStyle>;
  additionalBottomLabelContainerStyle?: StyleProp<ViewStyle>;
  additionalBottomLabelTextStyle?: StyleProp<TextStyle>;
}

export default (props: InputProps & OperationInputProps) => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

  const renderCustomInput = () => (
    <CustomInput
      {...props}
      containerStyle={styles.container}
      additionalInputContainerStyle={props.additionalInputContainerStyle}
    />
  );

  return props.labelInput ? (
    <View style={[styles.outerContainer, props.additionalOuterContainerStyle]}>
      <View style={styles.labelInputContainer}>
        <Text style={[styles.labelStyle, props.additionalLabelStyle]}>
          {props.labelInput}
        </Text>
        {props.infoIconAction && (
          <Icon
            theme={theme}
            name={Icons.INFO}
            onClick={props.infoIconAction}
            additionalContainerStyle={styles.marginLeft}
          />
        )}
        {props.labelExtraInfo && (
          <Text
            style={[
              styles.labelStyle,
              styles.smallerLabelSize,
              props.additionalLabelStyle,
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

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      display: 'flex',
      marginLeft: 0,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
    },
    outerContainer: {
      display: 'flex',
      width: '100%',
    },
    labelStyle: {
      ...body_primary_body_1,
      color: getColors(theme).secondaryText,
    },
    labelInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    smallerLabelSize: {
      marginLeft: 10,
      fontFamily: FontPoppinsName.ITALIC,
      fontSize: 13,
    },
    marginLeft: {
      marginLeft: 8,
    },
  });
