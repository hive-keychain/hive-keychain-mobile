import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {
  AutoCompleteValues,
  AutoCompleteValuesType,
} from 'src/interfaces/autocomplete.interface';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {getInputHeight} from 'src/styles/input';
import {fields_primary_text_2} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';

interface Props {
  autoCompleteValues: AutoCompleteValuesType;
  //   isFocused: boolean;
  handleOnChange: (value: any) => void;
}

const AutoCompleteBox = ({
  autoCompleteValues,
  //   isFocused,
  handleOnChange,
}: Props) => {
  console.log({autoCompleteValues}); //TODO remove line
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useWindowDimensions());

  //   const handlePress = (item: any) => {
  //     console.log({pressed: item});
  //   };

  const handleRenderList = (autoCompleteValues: AutoCompleteValuesType) => {
    if (typeof (autoCompleteValues as string[])[0] === 'string') {
      return (autoCompleteValues as string[]).map((item, index) => (
        <TouchableOpacity
          key={`${item}-${index}`}
          activeOpacity={1}
          onPress={() => {
            console.log({item});
            handleOnChange(item);
          }}>
          <Text style={styles.textBase}>{item}</Text>
        </TouchableOpacity>
      ));
    } else if (!!(autoCompleteValues as AutoCompleteValues).categories) {
      //TODO bellow
      return <Text>TODO</Text>;
    }
    return null;
  };

  return (
    <View style={[getCardStyle(theme).defaultCardItem, styles.container]}>
      {handleRenderList(autoCompleteValues)}
    </View>
  );
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: getInputHeight(height),
      bottom: undefined,
      width: '100%',
      zIndex: 10,
    },
    textBase: {
      ...fields_primary_text_2,
      color: getColors(theme).secondaryText,
    },
  });

export default AutoCompleteBox;
