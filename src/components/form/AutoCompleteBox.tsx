import React, {useEffect, useState} from 'react';
import {
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {
  AutoCompleteCategory,
  AutoCompleteValues,
  AutoCompleteValuesType,
} from 'src/interfaces/autocomplete.interface';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
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
  const [mainContainerStyle, setMainContainerStyle] = useState<ViewStyle>({
    display: 'none',
  });

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
      getVisibleStyle({
        categories: filteredCategories,
      });
    }
  }, [filterValue, autoCompleteValues]);

  const getVisibleStyle = (filtered: string[] | AutoCompleteValues) => {
    if (typeof (filtered as string[])[0] === 'string') {
      setMainContainerStyle({display: 'none'});
    } else if (!!(filtered as AutoCompleteValues).categories) {
      if (
        (filtered as AutoCompleteValues).categories.length > 0 &&
        filterValue.trim().length >= 2 &&
        (filtered as AutoCompleteValues).categories.some(
          (cat) => cat.values.length > 0,
        )
      ) {
        setMainContainerStyle({display: 'flex'});
      } else {
        setMainContainerStyle({display: 'none'});
      }
    }
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        try {
          const _target = (evt as any)._targetInst;
          const {memoizedProps} = _target;
          const {nativeID, children} = memoizedProps;
          if (nativeID === 'automplete-item-text') {
            handleOnChange(children[0]);
          }
        } catch (error) {
          console.log('Autocomplete error', {error});
        }
        return gestureState.dx != 0 && gestureState.dy != 0;
      },
      onPanResponderTerminationRequest: (evt, gestureState) => false,
    }),
  ).current;

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
          activeOpacity={1}
          key={`${item}-${index}`}
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
                <FlatList
                  nativeID="flatlist-automplete"
                  data={category.values}
                  keyExtractor={(e) => e.value}
                  renderItem={({item: autoCompleteItem, index}) => (
                    <TouchableOpacity
                      activeOpacity={1}
                      testID="automplete-item"
                      onPress={() => handleOnChange(autoCompleteItem.value)}
                      style={getLastItemStyle(index, category, catIndex)}>
                      <Text
                        nativeID="automplete-item-text"
                        style={[styles.textBase, styles.autoCompleteValue]}>
                        {autoCompleteItem.translateValue
                          ? translate(autoCompleteItem.value)
                          : autoCompleteItem.value}
                        {autoCompleteItem.subLabel
                          ? ` (${autoCompleteItem.subLabel})`
                          : ''}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          ),
      );
    }
    return null;
  };

  return (
    <View
      {...panResponder.panHandlers}
      nativeID="autocomplete-box"
      style={[
        mainContainerStyle,
        getCardStyle(theme).defaultCardItem,
        styles.container,
      ]}>
      {handleRenderList(filteredAutoComplete)}
    </View>
  );
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 48 + 5,
      bottom: undefined,
      width: '100%',
      height: 'auto',
      maxHeight: 180,
      zIndex: 10,
    },
    textBase: {
      ...fields_primary_text_2,
      color: getColors(theme).secondaryText,
    },
    titleCategory: {
      fontFamily: FontPoppinsName.SEMI_BOLD,
      fontSize: getFontSizeSmallDevices(width, 14),
    },
    autoCompleteValue: {
      fontSize: 13,
      paddingLeft: 8,
      paddingVertical: 3,
    },
    fullDimensions: {width: '100%', height: 'auto'},
    largerMarginBottom: {marginBottom: 10},
    marginBottom: {marginBottom: 10},
  });

export default AutoCompleteBox;
