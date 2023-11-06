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
import {Overlay} from 'react-native-elements';

import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
  title_primary_body_2,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';

export interface PickerItemInterface {
  label: string;
  value: string;
  icon?: JSX.Element;
}

type Props = {
  selected?: PickerItemInterface;
  pickerItemList: PickerItemInterface[];
  theme: Theme;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  additionalContainerListStyle?: StyleProp<ViewStyle>;
  additionalExpandedListItemContainerStyle?: StyleProp<ViewStyle>;
  additionalSelectedItemContainerStyle?: StyleProp<ViewStyle>;
  labelsToUppercase?: boolean;
  onSelectedItem?: (item: PickerItemInterface) => void;
  removeDropdownIcon?: boolean;
};
const PickerItem = ({
  selected,
  additionalContainerStyle,
  theme,
  pickerItemList,
  labelsToUppercase,
  additionalContainerListStyle,
  additionalExpandedListItemContainerStyle,
  additionalSelectedItemContainerStyle,
  onSelectedItem,
  removeDropdownIcon,
}: Props) => {
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({width, height}, theme);
  const [selectedItem, setSelectedItem] = React.useState(
    selected ?? pickerItemList[0],
  );
  const [expandList, setExpandList] = React.useState(false);

  const renderItem = (item: PickerItemInterface) => {
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

  const handleSelectedItem = (item: PickerItemInterface) => {
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
        {!removeDropdownIcon && (
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
        )}
      </TouchableOpacity>
      <Overlay
        overlayStyle={{padding: 0}}
        isVisible={expandList}
        onBackdropPress={() => setExpandList(!expandList)}>
        <View
          style={[styles.expandedListContainer, additionalContainerListStyle]}>
          {pickerItemList.map((item) => {
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
      </Overlay>
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
      backgroundColor: getColors(theme).menuHamburguerBg,
      width: 200,
      borderColor: getColors(theme).cardBorderColorContrast,
      borderWidth: 1,
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

export default PickerItem;
