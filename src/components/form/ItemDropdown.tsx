import ArrowDropDownDark from 'assets/new_UI/dropdown_arrow_dark.svg';
import ArrowDropDownLight from 'assets/new_UI/dropdown_arrow_light.svg';

import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';

import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
  title_primary_body_2,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';

export interface ItemDropdownInterface {
  label: string;
  value: string;
  icon: JSX.Element;
}

type Props = {
  selected?: ItemDropdownInterface;
  itemDropdownList: ItemDropdownInterface[];
  theme: Theme;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  additionalContainerListStyle?: StyleProp<ViewStyle>;
  additionalExpandedListItemContainerStyle?: StyleProp<ViewStyle>;
  additionalSelectedItemContainerStyle?: StyleProp<ViewStyle>;
  labelsToUppercase?: boolean;
  onSelectedItem?: (item: ItemDropdownInterface) => void;
};
const ItemDropdown = ({
  selected,
  additionalContainerStyle,
  theme,
  itemDropdownList,
  labelsToUppercase,
  additionalContainerListStyle,
  additionalExpandedListItemContainerStyle,
  additionalSelectedItemContainerStyle,
  onSelectedItem,
}: Props) => {
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({width, height}, theme);
  const [selectedItem, setSelectedItem] = React.useState(
    selected ?? itemDropdownList[0],
  );
  const [expandList, setExpandList] = React.useState(false);

  const renderItem = (item: ItemDropdownInterface) => {
    return (
      <View
        key={`item-dropdown-list-${item.label}`}
        style={[
          styles.selectedItemContainer,
          additionalSelectedItemContainerStyle,
        ]}>
        {item.icon}
        <Text style={styles.itemTextStyle}>
          {labelsToUppercase ? item.label.toUpperCase() : item.label}
        </Text>
      </View>
    );
  };

  const handleSelectedItem = (item: ItemDropdownInterface) => {
    setSelectedItem(item);
    setExpandList(false);
    if (onSelectedItem) onSelectedItem(item);
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setExpandList(!expandList)}
        style={[styles.container, additionalContainerStyle]}>
        {renderItem(selectedItem)}
        <View style={[styles.dropdownContainer]}>
          {theme === Theme.LIGHT ? (
            <ArrowDropDownLight
              {...styles.dropdownIcon}
              style={expandList ? styles.rotateSvg : null}
            />
          ) : (
            <ArrowDropDownDark
              {...styles.dropdownIcon}
              style={expandList ? styles.rotateSvg : null}
            />
          )}
        </View>
      </TouchableOpacity>
      {expandList && (
        <View
          style={[styles.expandedListContainer, additionalContainerListStyle]}>
          {itemDropdownList.map((item) => {
            return (
              <View
                style={[
                  styles.expandedListItemContainer,
                  additionalExpandedListItemContainerStyle,
                ]}
                key={`item-dropddown-${item.label}`}>
                <TouchableOpacity onPress={() => handleSelectedItem(item)}>
                  {renderItem(item)}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      )}
    </>
  );
};

const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      height: headlines_primary_headline_2.fontSize * 3,
      justifyContent: 'space-between',
      borderRadius: height / 2,
      borderWidth: 1,
      alignItems: 'center',
      padding: 8,
      borderColor: getColors(theme).cardBorderColorContrast,
    },
    dropdownContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      width: width / 15,
      height: width / 15,
      borderRadius: width / 1,
    },
    dropdownIcon: {
      width: 20,
      height: 20,
    },
    itemTextStyle: {
      ...title_primary_body_2,
      fontSize: getFontSizeSmallDevices(height, 13),
      color: getColors(theme).secondaryText,
      textAlignVertical: 'center',
      height: 20,
      marginLeft: 4,
    },
    expandedListContainer: {
      position: 'absolute',
      backgroundColor: getColors(theme).menuHamburguerBg,
      width: '90%',
      padding: 4,
      top: 40,
      left: 5,
      borderColor: getColors(theme).cardBorderColorContrast,
      borderWidth: 1,
      borderBottomLeftRadius: width / 15,
      borderBottomRightRadius: width / 15,
    },
    expandedListItemContainer: {
      backgroundColor: getColors(theme).menuHamburguerBg,
      marginBottom: 4,
    },
    selectedItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },
    rotateSvg: {
      transform: [{rotate: '180deg'}],
    },
  });

export default ItemDropdown;
