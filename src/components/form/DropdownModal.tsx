import Clipboard from '@react-native-community/clipboard';
import Icon from 'components/hive/Icon';
import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import SimpleToast from 'react-native-simple-toast';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {
  CONTENTMARGINPADDING,
  LABELINDENTSPACE,
  MARGINLEFTRIGHTMIN,
  MARGINPADDING,
  MIN_SEPARATION_ELEMENTS,
} from 'src/styles/spacing';
import {
  FontPoppinsName,
  getFontSizeSmallDevices,
  title_primary_body_2,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';
import {capitalize} from 'utils/format';
import {translate} from 'utils/localize';
import CustomSearchBar from './CustomSearchBar';

export interface DropdownModalItem {
  value: string;
  label?: string;
  removable?: boolean;
  icon?: JSX.Element;
}

//TODO important:
//  - check with quentin to fix the error happening in swap about not refreshing the icon picture.
//  - add into rpc, will need to add code from other dropdown components.
//  - replace all places!!! just one dropdown from now on. & after testing all good, remove old versions.
//   -> done in: Main.
interface Props {
  //TODO check bellow if not needed to add string[] | dropdown[] and code both.
  list: DropdownModalItem[];
  selected: string | DropdownModalItem;
  onSelected: (itemValue: DropdownModalItem) => void;
  onRemove?: (item: string) => void;
  addExtraHeightFromElements?: number;
  additionalTextStyle?: StyleProp<TextStyle>;
  additionalTitleTextStyle?: StyleProp<TextStyle>;
  dropdownIconScaledSize?: Dimensions;
  additionalDropdowContainerStyle?: StyleProp<ViewStyle>;
  additionalMainContainerDropdown?: StyleProp<ViewStyle>;
  additionalListExpandedContainerStyle?: StyleProp<ViewStyle>;
  additionalOverlayStyle?: StyleProp<ViewStyle>;
  dropdownTtitleTr?: string;
  removeDropdownTitleIndent?: boolean;
  enableSearch?: boolean;
  bottomLabelInfo?: string;
  showSelectedIcon?: JSX.Element;
  copyButtonValue?: boolean;
  selectedBgColor?: string;
}

const DropdownModal = ({
  selected,
  list,
  additionalTextStyle,
  dropdownIconScaledSize,
  additionalDropdowContainerStyle,
  dropdownTtitleTr,
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
    onSelected(item);
    setIsListExpanded(false);
  };

  const onHandleCopyValue = (username: string) => {
    Clipboard.setString(username);
    SimpleToast.show(translate('toast.copied_username'), SimpleToast.LONG);
  };

  const renderCopyOrSelectedIcon = (item: DropdownModalItem) => {
    return showSelectedIcon || copyButtonValue ? (
      <View
        style={[
          styles.flexRow,
          {
            marginLeft: MIN_SEPARATION_ELEMENTS,
          },
        ]}>
        {copyButtonValue && (
          <Icon
            theme={theme}
            name={Icons.COPY}
            onClick={() => onHandleCopyValue(item.value)}
            width={16}
            height={16}
            additionalContainerStyle={{marginRight: 4}}
            strokeWidth={2}
            color={PRIMARY_RED_COLOR}
          />
        )}
        <View style={{width: 20}}>
          {typeof selected === 'object' && selected.value === item.value
            ? showSelectedIcon
            : null}
        </View>
      </View>
    ) : null;
  };

  const renderDropdownItem = (item: DropdownModalItem, index: number) => {
    const isLastItem = index === list.length - 1;
    const showSelectedBgOnItem =
      selectedBgColor && (selected === item.value || selected === item.label);
    const bgStyle = showSelectedBgOnItem
      ? ({
          backgroundColor: selectedBgColor,
          borderRadius: 10,
          paddingVertical: 8,
          alignItems: 'center',
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
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onHandleSelectedItem(item)}
        style={[
          styles.dropdownItem,
          bgStyle,
          isLastItem && index > 2 ? {paddingBottom: 20} : undefined,
        ]}>
        <View style={[innerContainerStyle, innerContainerBgStyle]}>
          {item.icon}
          <Text style={[styles.textBase, styles.smallerText, labelTextStyle]}>
            {item.label}
          </Text>
          {item.removable && (
            <Icon
              theme={theme}
              name={Icons.REMOVE}
              onClick={() => onRemove(item.value)}
              color={showSelectedBgOnItem ? 'white' : PRIMARY_RED_COLOR}
            />
          )}
        </View>
        {typeof item === 'object' ? renderCopyOrSelectedIcon(item) : null}
      </TouchableOpacity>
    );
  };

  const renderDropdownTop = (showOpened?: boolean) => (
    <TouchableOpacity
      onPress={() => setIsListExpanded(!isListExpanded)}
      style={[
        getCardStyle(theme).defaultCardItem,
        styles.dropdownContainer,
        additionalDropdowContainerStyle,
      ]}>
      {typeof selected === 'string' ? (
        <Text style={[styles.textBase, additionalTextStyle]}>{selected}</Text>
      ) : (
        <View style={styles.flexRow}>
          {selected.icon}
          <Text
            style={[styles.textBase, styles.marginLeft, additionalTextStyle]}>
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

  const _measure = useCallback(() => {
    if (dropdownContainerRef && dropdownContainerRef?.current) {
      (dropdownContainerRef.current as any).measureInWindow(
        (pageX: any, pageY: any, width: any, height: any) => {
          setDropdownPageY(pageY);
        },
      );
    }
  }, [height, width]);

  return (
    <>
      <View style={additionalMainContainerDropdown}>
        {dropdownTtitleTr && (
          <Text
            style={[
              styles.textBase,
              additionalTitleTextStyle,
              removeDropdownTitleIndent ? undefined : styles.indent,
            ]}>
            {capitalize(translate(dropdownTtitleTr))}
          </Text>
        )}
        <View ref={dropdownContainerRef} onLayout={_measure}>
          {renderDropdownTop()}
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
      {isListExpanded && (
        <Overlay
          onBackdropPress={() => setIsListExpanded(!isListExpanded)}
          isVisible={isListExpanded}
          backdropStyle={styles.backdrop}
          overlayStyle={[
            styles.dropdownListContainer,
            styles.overlay,
            additionalOverlayStyle,
          ]}>
          <>
            <View style={additionalMainContainerDropdown}>
              {renderDropdownTop(true)}
            </View>
            <FlatList
              ListHeaderComponent={
                enableSearch ? (
                  <CustomSearchBar
                    theme={theme}
                    value={searchValue}
                    onChangeText={(text) => setSearchValue(text)}
                    additionalContainerStyle={styles.searchContainer}
                  />
                ) : null
              }
              style={[
                getCardStyle(theme).defaultCardItem,
                styles.dropdownListContainer,
                additionalListExpandedContainerStyle,
                selectedBgColor
                  ? {
                      paddingHorizontal: 4,
                      paddingVertical: 6,
                    }
                  : null,
              ]}
              data={filteredDropdownList}
              keyExtractor={(item) => item.label}
              renderItem={(item) => renderDropdownItem(item.item, item.index)}
              contentContainerStyle={{
                alignContent: 'center',
              }}
              //TODO bellow add if empty when needed
              // ListEmptyComponent={renderEmpty}
            />
          </>
        </Overlay>
      )}
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
    overlay: {
      backgroundColor: '#00000000',
      width: '100%',
      height: 'auto',
      maxHeight: undefined,
      marginTop: 0,
      top: dropdownPageY + (addExtraY ?? 0),
      position: 'absolute',
      zIndex: 10,
      elevation: 0,
      paddingHorizontal: MARGINPADDING + CONTENTMARGINPADDING,
      paddingTop: 0,
    },
    dropdownListContainer: {
      marginTop: MIN_SEPARATION_ELEMENTS,
      bottom: undefined,
      width: '100%',
      height: 'auto',
      maxHeight: 120,
    },
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
      justifyContent: 'space-between',
    },
    marginLeft: {
      marginLeft: MARGINLEFTRIGHTMIN,
    },
    dropdownContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 60,
      marginBottom: 0,
      borderRadius: 25,
      width: '100%',
      zIndex: 30,
      paddingVertical: 0,
      marginTop: 0,
      paddingTop: 0,
    },
    dropdownItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
    },
    smallerText: {
      fontSize: 12,
    },
    indent: {
      marginLeft: LABELINDENTSPACE,
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
    opaque: {
      opacity: 0.6,
    },
    positionAbsolute: {
      position: 'absolute',
      bottom: -24,
      alignSelf: 'center',
    },
    backdrop: {
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: '#00000078',
    },
  });

export default DropdownModal;
