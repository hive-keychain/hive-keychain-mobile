import Icon from 'components/hive/Icon';
import {OptionItem} from 'components/operations/Swap';
import Loader from 'components/ui/Loader';
import PreloadedImage from 'components/ui/PreloadedImage';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {Overlay} from 'react-native-elements';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {LABELINDENTSPACE} from 'src/styles/spacing';
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
  displayIconOnSelectedItem?: boolean;
  addDropdownTitleIndent?: boolean;
  additionalSelectedLabelItemStyle?: StyleProp<TextStyle>;
  additionalDropdownListLabelItemStyle?: StyleProp<TextStyle>;
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
  displayIconOnSelectedItem,
  addDropdownTitleIndent,
  additionalSelectedLabelItemStyle,
  additionalDropdownListLabelItemStyle,
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
    if (selected) {
      setSelectedItem(selected);
    }
  }, [selected]);

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

  const renderSelectedLabel = (item: OptionItem) => {
    const labelElement = (
      <Text
        style={[
          styles.textBase,
          styles.smallerText,
          additionalSelectedLabelItemStyle,
        ]}>
        {item.label}
      </Text>
    );
    if (displayIconOnSelectedItem && item.img) {
      return (
        <View style={styles.flexRowCentered}>
          <PreloadedImage
            uri={item.img}
            symbol={item.value.symbol}
            svgWidth={20}
            svgHeight={20}
            additionalContainerStyle={{width: 20, height: 20}}
          />
          {labelElement}
        </View>
      );
    }
    return labelElement;
  };

  const renderDropdownItem = (item: OptionItem, index: number) => {
    const isLastItem = index === filteredDropdownList.length - 1;
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onHandleSelectedItem(item)}
        style={[
          styles.dropdownItem,
          isLastItem ? {marginBottom: 10} : undefined,
        ]}>
        {item.img && (
          <PreloadedImage uri={item.img} symbol={item.value.symbol} />
        )}
        <Text
          style={[
            styles.textBase,
            styles.smallerText,
            additionalDropdownListLabelItemStyle,
          ]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    return (
      <>
        {!isFiltering && filteredDropdownList.length === 0 && (
          <Text style={[styles.textBase, styles.smallerText]}>
            {translate('wallet.operations.swap.no_tokens_found')}
          </Text>
        )}
        {isFiltering && <Loader animating size={'small'} />}
      </>
    );
  };

  return (
    <View style={[styles.container, additionalContainerStyle]}>
      <View>
        {labelTranslationKey && (
          <Text
            style={[
              styles.textBase,
              addDropdownTitleIndent ? styles.indent : undefined,
            ]}>
            {translate(labelTranslationKey)}
          </Text>
        )}
        <View style={styles.dropdownContainer}>
          {renderSelectedLabel(selectedItem)}
          <Icon
            theme={theme}
            name={Icons.EXPAND_THIN}
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
      </View>
      {isExpanded && (
        <Overlay
          backdropStyle={styles.backDrop}
          overlayStyle={styles.overlay}
          isVisible={isExpanded}
          statusBarTranslucent
          onBackdropPress={() => setIsExpanded(!isExpanded)}>
          <View style={[getCardStyle(theme).defaultCardItem]}>
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
            <View style={styles.dropdownlist}>
              {!isFiltering && (
                <FlatList
                  data={filteredDropdownList}
                  keyExtractor={(item) => item.label}
                  renderItem={(item) =>
                    renderDropdownItem(item.item, item.index)
                  }
                  ListEmptyComponent={renderEmpty}
                />
              )}
            </View>
          </View>
        </Overlay>
      )}
    </View>
  );
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    container: {
      width: '100%',
      maxHeight: 220,
    },
    backDrop: {backgroundColor: '#000000a5', padding: 0},
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
      height: 200,
      alignSelf: 'center',
      zIndex: 30,
    },
    marginLeft: {
      marginLeft: 20,
    },
    overlay: {
      backgroundColor: '#ff000000',
      padding: 0,
    },
    searchContainer: {
      borderColor: getColors(theme).quaternaryCardBorderColor,
      backgroundColor: getColors(theme).secondaryCardBgColor,
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
    flexRowCentered: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    indent: {
      marginLeft: LABELINDENTSPACE,
    },
  });

export default DropdownSelector;
