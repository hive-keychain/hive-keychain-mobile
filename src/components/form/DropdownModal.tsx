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
import {DropdownItem} from './CustomDropdown';
import CustomSearchBar from './CustomSearchBar';
//TODO important:
//  - Let us try the way they did it, using useCallback:
// const _measure = useCallback(() => {
//   if (ref && ref?.current) {
//     ref.current.measureInWindow((pageX, pageY, width, height) => {
//    - test it to see if gives the meassures no matter what.
//  - replace all places!!! just one dropdown from now on.
interface Props {
  //TODO check bellow if not needed to add string[] | dropdown[] and code both.
  list: DropdownItem[];
  selected: string | DropdownItem;
  onSelected: (itemValue: DropdownItem) => void;
  additionalTextStyle?: StyleProp<TextStyle>;
  additionalTitleTextStyle?: StyleProp<TextStyle>;
  dropdownIconScaledSize?: Dimensions;
  additionalModalContainerStyle?: StyleProp<ViewStyle>;
  additionalDropdowContainerStyle?: StyleProp<ViewStyle>;
  additionalMainContainerDropdown?: StyleProp<ViewStyle>;
  dropdownTtitleTr?: string;
  removeDropdownTitleIndent?: boolean;
  enableSearch?: boolean;
  bottomLabelInfo?: string;
}

const DropdownModal = ({
  selected,
  list,
  additionalTextStyle,
  dropdownIconScaledSize,
  additionalModalContainerStyle,
  additionalDropdowContainerStyle,
  dropdownTtitleTr,
  additionalTitleTextStyle,
  removeDropdownTitleIndent,
  additionalMainContainerDropdown,
  enableSearch,
  onSelected,
  bottomLabelInfo,
}: Props) => {
  const dropdownContainerRef = useRef();
  const [dropdownPageY, setDropdownPageY] = useState(0);
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filteredDropdownList, setFilteredDropdownList] = useState<
    DropdownItem[]
  >(list);

  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();

  const styles = getStyles(dropdownPageY, width, height, theme);

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
  }, [searchValue]);

  const onHandleSelectedItem = (item: DropdownItem) => {
    onSelected(item);
    setIsListExpanded(false);
  };

  const renderDropdownItem = (item: DropdownItem, index: number) => {
    const isLastItem = index === list.length - 1;
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onHandleSelectedItem(item)}
        style={[
          styles.dropdownItem,
          isLastItem ? {marginBottom: 10} : undefined,
        ]}>
        {item.icon}
        <Text style={[styles.textBase, styles.smallerText]}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  const renderDropdownTop = (showOpened?: boolean) => (
    <TouchableOpacity
      onPress={() => setIsListExpanded(!isListExpanded)}
      style={[
        getCardStyle(theme).defaultCardItem,
        styles.dropdownContainer,
        // additionalDropdowContainerStyle,
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
          console.log('Self meassures: ', {pageX, pageY, width, height});
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
          backdropStyle={{
            flex: 1,
            width: '100%',
            height: '100%',
            backgroundColor: '#00000078',
          }}
          overlayStyle={[styles.dropdownListContainer, styles.overlay]}>
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
              ]}
              data={filteredDropdownList}
              keyExtractor={(item) => item.label}
              renderItem={(item) => renderDropdownItem(item.item, item.index)}
              //TODO bellow add if empty
              // ListEmptyComponent={renderEmpty}
            />
          </>
        </Overlay>
        // <TouchableOpacity
        //   style={{
        //     position: 'absolute',
        //     top: 0,
        //     left: 0,
        //     width: '100%',
        //     height: '100%',
        //     zIndex: 2,
        //     backgroundColor: '#0000002d',
        //   }}></TouchableOpacity>
      )}
    </>
  );
};
//TODO bellow cleanup
const getStyles = (
  dropdownPageY: number,
  width: number,
  height: number,
  theme: Theme,
) =>
  StyleSheet.create({
    overlay: {
      backgroundColor: '#00000000',
      width: '100%',
      height: 'auto',
      maxHeight: undefined,
      marginTop: 0,
      top: dropdownPageY,
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
      maxHeight: 120,
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
      fontSize: getFontSizeSmallDevices(
        height,
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
  });

export default DropdownModal;
