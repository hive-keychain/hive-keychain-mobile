import React, {useEffect, useState} from 'react';
import {
  FlexStyle,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {
  AutoCompleteCategory,
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
  filterValue: string;
}

const AutoCompleteBox = ({
  autoCompleteValues,
  handleOnChange,
  filterValue,
}: Props) => {
  const {theme} = useThemeContext();
  const [filteredAutoComplete, setFilteredAutoComplete] = useState<
    string[] | AutoCompleteValues
  >([]);

  const styles = getStyles(theme, useWindowDimensions());

  useEffect(() => {
    if (typeof (autoCompleteValues as string[])[0] === 'string') {
      //TODO when needed.
    } else if (!!(autoCompleteValues as AutoCompleteValues).categories) {
      const currentAutoComplete = autoCompleteValues;
      const filteredCategories = (currentAutoComplete as AutoCompleteValues).categories.map(
        (category) => {
          return {
            ...category,
            values: category.values.filter(
              (categoryValue) =>
                categoryValue.value
                  .toLowerCase()
                  .includes(filterValue.trim().toLowerCase()) ||
                categoryValue.subLabel
                  ?.toLowerCase()
                  .includes(filterValue.trim().toLowerCase()),
            ),
          };
        },
      );
      setFilteredAutoComplete({
        categories: filteredCategories.filter(
          (category) => category.values.length > 0,
        ),
      });
    }
  }, [filterValue, autoCompleteValues]);

  const getVisibleStyle = (
    filtered: string[] | AutoCompleteValues,
  ): FlexStyle => {
    if (typeof (filtered as string[])[0] === 'string') {
      //TODO when needed.
      return undefined;
    } else if (!!(filtered as AutoCompleteValues).categories) {
      return (filtered as AutoCompleteValues).categories.length > 0 &&
        filterValue.trim().length >= 2
        ? {display: 'flex'}
        : {display: 'none'};
    }
    return undefined;
  };

  const handleRenderList = (autoCompleteValues: AutoCompleteValuesType) => {
    const getLastItemStyle = (
      index: number,
      category: AutoCompleteCategory,
      catIndex: number,
    ) => {
      return index === category.values.length - 1 &&
        (autoCompleteValues as AutoCompleteValues).categories.length - 1 ===
          catIndex
        ? styles.largerMarginBottom
        : undefined;
    };

    if (typeof (autoCompleteValues as string[])[0] === 'string') {
      return (autoCompleteValues as string[]).map((item, index) => (
        <TouchableOpacity
          key={`${item}-${index}`}
          activeOpacity={1}
          onPress={() => {
            handleOnChange(item);
          }}>
          <Text style={styles.textBase}>{item}</Text>
        </TouchableOpacity>
      ));
    } else if (!!(autoCompleteValues as AutoCompleteValues).categories) {
      return (autoCompleteValues as AutoCompleteValues).categories.map(
        (category, catIndex) =>
          category.values.length > 0 && (
            <View style={styles.fullDimensions} key={category.title}>
              <Text style={[styles.textBase, styles.titleCategory]}>
                {category.translateTitle
                  ? translate(`common.${category.title}`)
                  : category.title}
              </Text>
              <View style={[styles.fullDimensions, styles.marginBottom]}>
                {category.values.map((autoCompleteItem, index) => (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handleOnChange(autoCompleteItem.value)}
                    key={`${autoCompleteItem.value}-${index}`}
                    style={getLastItemStyle(index, category, catIndex)}>
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
    <ScrollView
      style={[
        getCardStyle(theme).defaultCardItem,
        styles.container,
        getVisibleStyle(filteredAutoComplete),
      ]}>
      {handleRenderList(filteredAutoComplete)}
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
      height: 'auto',
      maxHeight: 180,
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
      fontSize: 12,
      paddingLeft: 8,
      paddingVertical: 3,
    },
    fullDimensions: {width: '100%', height: 'auto'},
    largerMarginBottom: {marginBottom: 20},
    marginBottom: {marginBottom: 10},
  });

export default AutoCompleteBox;
