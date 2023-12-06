import Icon from 'components/hive/Icon';
import {OptionItem} from 'components/operations/Swap';
import Loader from 'components/ui/Loader';
import PreloadedImage from 'components/ui/PreloadedImage';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {Overlay} from 'react-native-elements';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {getRotateStyle} from 'src/styles/transform';
import {FontPoppinsName, body_primary_body_1} from 'src/styles/typography';
import {translate} from 'utils/localize';
import CustomSearchBar from './CustomSearchBar';

interface Props {
  theme: Theme;
  list: OptionItem[];
  selected: OptionItem;
  onSelectedItem: (item: OptionItem) => void;
  labelTranslationKey?: string;
  titleTranslationKey?: string;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  searchOption?: boolean;
  bottomLabelInfo?: string;
}

const DropdownSelector = ({
  theme,
  list,
  labelTranslationKey,
  additionalContainerStyle,
  searchOption,
  onSelectedItem,
  titleTranslationKey,
  selected,
  bottomLabelInfo,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dropdownList, setDropdownList] = useState<OptionItem[]>(list);
  const [searchValue, setSearchValue] = useState('');
  const [filteredDropdownList, setFilteredDropdownList] = useState<
    OptionItem[]
  >(list);
  const [selectedItem, setSelectedItem] = useState<OptionItem>(selected);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    setIsFiltering(false);
  }, [filteredDropdownList]);

  useEffect(() => {
    if (searchValue.trim().length > 0) {
      setIsFiltering(true);
      const tempList = [...dropdownList];
      setFilteredDropdownList(
        tempList.filter((item) =>
          item.label.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      );
    } else {
      setFilteredDropdownList(dropdownList);
    }
  }, [searchValue]);

  const onHandleSelectedItem = (item: OptionItem) => {
    setSelectedItem(item);
    onSelectedItem(item);
    setIsExpanded(false);
  };

  const styles = getStyles(theme, useWindowDimensions().width);

  return (
    <View style={[styles.container, additionalContainerStyle]}>
      <View>
        {labelTranslationKey && (
          <Text style={styles.textBase}>{translate(labelTranslationKey)}</Text>
        )}
        <View style={styles.dropdownContainer}>
          <Text style={[styles.textBase, styles.smallerText]}>
            {selectedItem.label}
          </Text>
          <Icon
            theme={theme}
            name="expand_thin"
            {...styles.dropdownIcon}
            onClick={() => setIsExpanded(!isExpanded)}
            additionalContainerStyle={
              isExpanded ? getRotateStyle('180') : getRotateStyle('0')
            }
          />
        </View>
        {bottomLabelInfo && (
          <Text
            style={[
              styles.textBase,
              styles.italic,
              styles.opaque,
              styles.smallerText,
              styles.positionAbsolute,
            ]}>
            {bottomLabelInfo}
          </Text>
        )}
        {isExpanded && (
          <Overlay
            style={styles.overlay}
            isVisible={isExpanded}
            onBackdropPress={() => setIsExpanded(!isExpanded)}>
            <View style={styles.container}>
              {titleTranslationKey && (
                <Text style={[styles.textBase, styles.smallerText]}>
                  {translate(titleTranslationKey)}
                </Text>
              )}
              {searchOption && (
                <CustomSearchBar
                  theme={theme}
                  value={searchValue}
                  onChangeText={(text) => setSearchValue(text)}
                  additionalContainerStyle={styles.searchContainer}
                />
              )}
              <ScrollView style={styles.dropdownlist}>
                {!isFiltering &&
                  filteredDropdownList.map((item, index) => {
                    const isLastItem =
                      index === filteredDropdownList.length - 1;
                    return (
                      <TouchableOpacity
                        activeOpacity={1}
                        key={`${item.label}-currency-selector-swap`}
                        onPress={() => onHandleSelectedItem(item)}
                        style={[
                          styles.dropdownItem,
                          isLastItem ? {marginBottom: 10} : undefined,
                        ]}>
                        {item.img && (
                          <PreloadedImage
                            uri={item.img}
                            symbol={item.value.symbol}
                          />
                        )}
                        <Text style={[styles.textBase, styles.smallerText]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                {!isFiltering && filteredDropdownList.length === 0 && (
                  <Text style={[styles.textBase, styles.smallerText]}>
                    {translate('wallet.operations.swap.no_tokens_found')}
                  </Text>
                )}
                {isFiltering && <Loader animating size={'small'} />}
              </ScrollView>
            </View>
          </Overlay>
        )}
      </View>
    </View>
  );
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    container: {
      width: '100%',
      maxHeight: 220,
    },
    dropdownContainer: {
      width: '100%',
      display: 'flex',
      marginLeft: 0,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      borderWidth: 1,
      borderRadius: 30,
      padding: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      zIndex: 11,
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_1,
    },
    smallerText: {
      fontSize: 12,
    },
    dropdownIcon: {
      width: 15,
      height: 15,
    },
    dropdownlist: {
      width: width * 0.5,
      maxHeight: 200,
      alignSelf: 'center',
      zIndex: 30,
    },
    marginLeft: {
      marginLeft: 20,
    },
    overlay: {
      borderRadius: 20,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      borderWidth: 1,
    },
    searchContainer: {
      borderColor: getColors(theme).quaternaryCardBorderColor,
      borderWidth: 1,
      width: 'auto',
      height: 40,
      marginBottom: 8,
    },
    dropdownItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
    },
    itemImg: {
      width: 20,
      height: 20,
      backgroundColor: '#FFF',
      borderRadius: 50,
    },
    italic: {
      fontFamily: FontPoppinsName.ITALIC,
    },
    opaque: {
      opacity: 0.6,
    },
    positionAbsolute: {
      position: 'absolute',
      bottom: -20,
      alignSelf: 'center',
    },
  });

export default DropdownSelector;
