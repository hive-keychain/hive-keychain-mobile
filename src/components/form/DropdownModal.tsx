import Clipboard from '@react-native-community/clipboard';
import Icon from 'components/hive/Icon';
import Separator from 'components/ui/Separator';
import SlidingOverlay from 'components/ui/SlidingOverlay';
import React, {useEffect, useRef, useState} from 'react';
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
import SimpleToast from 'react-native-simple-toast';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {inputStyle} from 'src/styles/input';
import {LABEL_INDENT_SPACE, MIN_SEPARATION_ELEMENTS} from 'src/styles/spacing';
import {
  FontPoppinsName,
  getFontSizeSmallDevices,
  title_primary_body_2,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import CustomSearchBar from './CustomSearchBar';
export interface DropdownModalItem {
  value: string;
  label?: string;
  removable?: boolean;
  icon?: JSX.Element;
}
interface Props {
  list: DropdownModalItem[];
  selected: string | DropdownModalItem;
  onSelected: (itemValue: DropdownModalItem) => void;
  onRemove?: (item: string) => void;
  addExtraHeightFromElements?: number;
  additionalTextStyle?: StyleProp<TextStyle>;
  additionalItemLabelTextStyle?: StyleProp<TextStyle>;
  additionalTitleTextStyle?: StyleProp<TextStyle>;
  dropdownIconScaledSize?: Dimensions;
  additionalDropdowContainerStyle?: StyleProp<ViewStyle>;
  additionalMainContainerDropdown?: StyleProp<ViewStyle>;
  additionalListExpandedContainerStyle?: StyleProp<ViewStyle>;
  additionalOverlayStyle?: StyleProp<ViewStyle>;
  additionalLineStyle?: StyleProp<ViewStyle>;
  dropdownTitle?: string;
  removeDropdownTitleIndent?: boolean;
  enableSearch?: boolean;
  bottomLabelInfo?: string;
  showSelectedIcon?: JSX.Element;
  copyButtonValue?: boolean;
  selectedBgColor?: string;
  drawLineBellowSelectedItem?: boolean;
  hideLabel?: boolean;
}

const DropdownModal = ({
  selected,
  list,
  additionalTextStyle,
  dropdownIconScaledSize,
  additionalDropdowContainerStyle,
  dropdownTitle,
  additionalTitleTextStyle,
  removeDropdownTitleIndent,
  additionalMainContainerDropdown,
  enableSearch,
  onSelected,
  bottomLabelInfo,
  additionalOverlayStyle,
  additionalListExpandedContainerStyle,
  showSelectedIcon,
  copyButtonValue,
  selectedBgColor,
  addExtraHeightFromElements,
  onRemove,
  additionalLineStyle,
  additionalItemLabelTextStyle,
  hideLabel,
}: Props) => {
  const dropdownContainerRef = useRef();
  const [dropdownPageY, setDropdownPageY] = useState(0);
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filteredDropdownList, setFilteredDropdownList] = useState<
    DropdownModalItem[]
  >(list);
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getStyles(
    dropdownPageY,
    width,
    height,
    theme,
    addExtraHeightFromElements,
  );

  useEffect(() => {
    if (searchValue.trim().length > 0) {
      const tempList = [...list];
      setFilteredDropdownList(
        tempList.filter((item) =>
          item.label.toLowerCase().includes(searchValue.toLowerCase()),
        ),
      );
    } else {
      setFilteredDropdownList(list);
    }
  }, [searchValue, list]);

  const onHandleSelectedItem = (item: DropdownModalItem) => {
    setTimeout(() => {
      setIsListExpanded(false);
      setTimeout(() => onSelected(item), 100);
    }, 300);
  };

  const onHandleCopyValue = (username: string) => {
    Clipboard.setString(username);
    SimpleToast.show(translate('toast.copied_username'), SimpleToast.LONG);
  };

  const renderCopyOrSelectedIcon = (item: DropdownModalItem) => {
    const isMatchingObjectSelected =
      typeof selected === 'object' &&
      (selected.value === item.value || selected.label === item.label);

    return showSelectedIcon || copyButtonValue ? (
      <View
        style={[
          styles.flexRow,
          {
            marginLeft: MIN_SEPARATION_ELEMENTS,
          },
        ]}>
        {isMatchingObjectSelected ? (
          <View style={{width: 20}}>{showSelectedIcon}</View>
        ) : null}
        {copyButtonValue && (
          <Icon
            theme={theme}
            name={Icons.COPY}
            onPress={() => onHandleCopyValue(item.value)}
            width={16}
            height={16}
            additionalContainerStyle={{marginLeft: 4}}
            strokeWidth={2}
            color={PRIMARY_RED_COLOR}
          />
        )}
      </View>
    ) : null;
  };

  const renderDropdownItem = (item: DropdownModalItem, index: number) => {
    const showSelectedBgOnItem =
      selectedBgColor && (selected === item.value || selected === item.label);
    const bgStyle = showSelectedBgOnItem
      ? ({
          backgroundColor: selectedBgColor,
        } as ViewStyle)
      : null;
    const innerContainerStyle = {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: item.removable ? '100%' : 'auto',
      alignItems: 'center',
      alignContent: 'center',
    } as ViewStyle;
    const innerContainerBgStyle = selectedBgColor
      ? ({
          paddingHorizontal: 10,
          alignContent: 'space-between',
        } as ViewStyle)
      : undefined;
    const labelTextStyle = showSelectedBgOnItem
      ? ({
          color: 'white',
        } as ViewStyle)
      : ({
          marginLeft: MIN_SEPARATION_ELEMENTS,
        } as ViewStyle);

    return (
      <View style={[{paddingVertical: 4}]}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => onHandleSelectedItem(item)}
          style={[styles.dropdownItem, bgStyle]}>
          <View style={[innerContainerStyle, innerContainerBgStyle]}>
            {item.icon}
            <Text
              style={[
                inputStyle(theme, width).input,
                labelTextStyle,
                {marginLeft: 10},
                additionalItemLabelTextStyle,
              ]}>
              {item.label}
            </Text>
            {item.removable && (
              <Icon
                theme={theme}
                name={Icons.REMOVE}
                onPress={() => onRemove(item.value)}
                color={showSelectedBgOnItem ? 'white' : PRIMARY_RED_COLOR}
              />
            )}
          </View>
          {typeof item === 'object' ? renderCopyOrSelectedIcon(item) : null}
        </TouchableOpacity>
        {index !== list.length - 1 && (
          <Separator
            additionalLineStyle={{
              borderColor: getCardStyle(theme).borderTopCard.borderColor,
            }}
            height={0}
          />
        )}
      </View>
    );
  };

  const renderSelectedValue = (showOpened?: boolean) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => {
        setIsListExpanded(!isListExpanded);
      }}
      style={[
        getCardStyle(theme).defaultCardItem,
        styles.dropdownContainer,
        additionalDropdowContainerStyle,
        showOpened
          ? {
              backgroundColor: getColors(theme).secondaryCardBgColor,
            }
          : undefined,
      ]}>
      {typeof selected === 'string' ? (
        <Text
          style={[
            inputStyle(theme, width).input,
            {flex: 1},
            additionalTextStyle,
          ]}
          numberOfLines={1}>
          {selected}
        </Text>
      ) : (
        <View style={[styles.flexRow, {flex: 1}]}>
          <View>{selected.icon}</View>
          <Text
            numberOfLines={1}
            style={[
              inputStyle(theme, width).input,
              styles.marginLeft,
              {flex: 1},
              additionalTextStyle,
            ]}>
            {selected.label}
          </Text>
        </View>
      )}
      <Icon
        name={Icons.EXPAND_THIN}
        theme={theme}
        additionalContainerStyle={[
          styles.marginLeft,
          showOpened ? undefined : styles.rotateIcon,
        ]}
        {...dropdownIconScaledSize}
        color={PRIMARY_RED_COLOR}
      />
    </TouchableOpacity>
  );

  return (
    <>
      <View style={additionalMainContainerDropdown}>
        {dropdownTitle && !hideLabel && (
          <Text
            style={[
              inputStyle(theme, width).label,
              additionalTitleTextStyle,
              removeDropdownTitleIndent ? undefined : styles.indent,
            ]}>
            {translate(dropdownTitle)}
          </Text>
        )}
        <View ref={dropdownContainerRef}>{renderSelectedValue()}</View>
        {bottomLabelInfo && (
          <Text
            style={[
              styles.textBase,
              styles.italic,
              styles.smallerText,
              styles.positionAbsolute,
            ]}>
            {bottomLabelInfo}
          </Text>
        )}
      </View>
      <SlidingOverlay
        showOverlay={isListExpanded}
        setShowOverlay={setIsListExpanded}>
        <Text
          style={[
            {alignSelf: 'center', marginBottom: 10},
            inputStyle(theme, width).label,
          ]}>
          {translate(dropdownTitle)}
        </Text>
        {enableSearch && (
          <CustomSearchBar
            theme={theme}
            value={searchValue}
            onChangeText={(text) => setSearchValue(text)}
            additionalContainerStyle={styles.searchContainer}
          />
        )}
        <FlatList
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={<Separator />}
          ListFooterComponent={<Separator />}
          ListEmptyComponent={
            <View
              style={[
                {
                  flexGrow: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 16,
                },
              ]}>
              <Text style={[inputStyle(theme, width).label]}>
                {translate('wallet.operations.token_settings.empty_results')}
              </Text>
            </View>
          }
          data={filteredDropdownList}
          keyExtractor={(item) => item.label}
          renderItem={(item) => renderDropdownItem(item.item, item.index)}
          contentContainerStyle={{}}
        />
      </SlidingOverlay>
    </>
  );
};

const getStyles = (
  dropdownPageY: number,
  width: number,
  height: number,
  theme: Theme,
  addExtraY?: number,
) =>
  StyleSheet.create({
    textBase: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
      fontSize: getFontSizeSmallDevices(
        width,
        {...title_primary_body_2}.fontSize,
      ),
    },
    rotateIcon: {
      transform: [{rotateX: '180deg'}],
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexGrow: 1,
      justifyContent: 'flex-end',
    },
    marginLeft: {
      marginLeft: 8,
    },
    dropdownContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 48,
      marginBottom: 0,
      borderRadius: 25,
      zIndex: 30,
      paddingVertical: 0,
      marginTop: 0,
      paddingTop: 0,
    },
    dropdownItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
      marginTop: 6,
    },
    smallerText: {
      fontSize: 12,
    },
    indent: {
      marginLeft: LABEL_INDENT_SPACE,
    },
    searchContainer: {
      borderColor: getColors(theme).quaternaryCardBorderColor,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderWidth: 1,
      width: 'auto',
      height: 40,
      marginBottom: 8,
    },
    italic: {
      fontFamily: FontPoppinsName.ITALIC,
    },
    positionAbsolute: {
      position: 'absolute',
      bottom: -24,
      alignSelf: 'center',
    },
  });

export default DropdownModal;
