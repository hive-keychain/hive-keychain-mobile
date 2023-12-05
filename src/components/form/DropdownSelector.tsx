import Icon from 'components/hive/Icon';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {getRotateStyle} from 'src/styles/transform';
import {body_primary_body_1} from 'src/styles/typography';
import {translate} from 'utils/localize';
import CustomSearchBar from './CustomSearchBar';

interface Props {
  theme: Theme;
  list: string[];
  onSelectedItem: (item: string) => void;
  labelTranslationKey?: string;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  searchOption?: boolean;
}

const DropdownSelector = ({
  theme,
  list,
  labelTranslationKey,
  additionalContainerStyle,
  searchOption,
  onSelectedItem,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dropdownList, setDropdownList] = useState<string[]>(list);
  const [searchValue, setSearchValue] = useState('');
  const [filteredDropdownList, setFilteredDropdownList] = useState<string[]>(
    list,
  );
  const [selectedItem, setSelectedItem] = useState(dropdownList[0]);

  if (isExpanded) {
    console.log({l: list.length}); //TODO remove line
  }

  useEffect(() => {
    if (searchValue.trim().length > 0) {
      const tempList = [...filteredDropdownList];
      setFilteredDropdownList(
        tempList.filter((item) =>
          item.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      );
    } else {
      setFilteredDropdownList(dropdownList);
    }
  }, [searchValue]);

  const onHandleSelectedItem = (item: string) => {
    setSelectedItem(item);
    onSelectedItem(item);
    setIsExpanded(false);
  };

  const styles = getStyles(theme);

  return (
    <View style={[styles.container, additionalContainerStyle]}>
      <View>
        {labelTranslationKey && (
          <Text style={styles.textBase}>{translate(labelTranslationKey)}</Text>
        )}
        <View style={styles.dropdownContainer}>
          <Text style={[styles.textBase, styles.smallerText]}>
            {selectedItem}
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
        {isExpanded && (
          <ScrollView style={styles.dropdownlist}>
            {searchOption && (
              <CustomSearchBar
                theme={theme}
                value={searchValue}
                onChangeText={(text) => setSearchValue(text)}
              />
            )}
            {filteredDropdownList.map((item, index) => {
              const isLastItem = index === dropdownList.length - 1;
              return (
                <TouchableOpacity
                  activeOpacity={1}
                  key={`${item}-currency-selector-swap`}
                  onPress={() => onHandleSelectedItem(item)}>
                  <Text
                    style={[
                      styles.textBase,
                      styles.smallerText,
                      styles.marginLeft,
                      isLastItem ? {marginBottom: 10} : undefined,
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
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
      position: 'absolute',
      borderRadius: 20,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      borderWidth: 1,
      top: 80,
      width: '100%',
      height: 80,
      alignSelf: 'center',
      overflow: 'hidden',
      zIndex: 30,
    },
    marginLeft: {
      marginLeft: 20,
    },
  });

export default DropdownSelector;
