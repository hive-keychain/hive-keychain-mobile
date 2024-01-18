import React from 'react';
import {
  ScrollView,
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
import {
  FontPoppinsName,
  fields_primary_text_2,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';

interface Props {
  autoCompleteValues: AutoCompleteValuesType;
  handleOnChange: (value: any) => void;
}

const AutoCompleteBox = ({autoCompleteValues, handleOnChange}: Props) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useWindowDimensions());

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
      return (autoCompleteValues as AutoCompleteValues).categories.map(
        (category) =>
          category.values.length > 0 && (
            <View key={category.title}>
              <Text style={[styles.textBase, styles.titleCategory]}>
                {category.translateTitle
                  ? translate(`common.${category.title}`)
                  : category.title}
              </Text>
              <View>
                {category.values.map((autoCompleteItem, index) => (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handleOnChange(autoCompleteItem.value)}
                    key={`${autoCompleteItem.value}-${index}`}>
                    <Text style={[styles.textBase, styles.autoCompleteValue]}>
                      {autoCompleteItem.translateValue
                        ? translate(autoCompleteItem.value)
                        : autoCompleteItem.value}
                      {autoCompleteItem.subLabel
                        ? ` (${autoCompleteItem.subLabel})`
                        : ''}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ),
      );
    }
    return null;
  };

  return (
    <ScrollView style={[getCardStyle(theme).defaultCardItem, styles.container]}>
      {handleRenderList(autoCompleteValues)}
    </ScrollView>
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
      maxHeight: 150,
    },
    textBase: {
      ...fields_primary_text_2,
      color: getColors(theme).secondaryText,
    },
    titleCategory: {
      fontFamily: FontPoppinsName.SEMI_BOLD,
      fontSize: getFontSizeSmallDevices(height, 13),
    },
    autoCompleteValue: {
      fontSize: 11,
      paddingLeft: 8,
    },
  });

export default AutoCompleteBox;
