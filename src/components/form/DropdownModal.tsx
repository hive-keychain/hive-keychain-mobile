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
import {DropdownItem} from './CustomDropdown';
import CustomSearchBar from './CustomSearchBar';
//TODO
//  bring here bellow DropdownItem interface.

//TODO important:
//  - check with quentin to fix the error happening in swap about not refreshing the icon picture.
//  - add into rpc, will need to add code from other dropdown components.
//  - replace all places!!! just one dropdown from now on. & after testing all good, remove old versions.
//   -> done in: Main.
interface Props {
  //TODO check bellow if not needed to add string[] | dropdown[] and code both.
  list: DropdownItem[];
  selected: string | DropdownItem;
  onSelected: (itemValue: DropdownItem) => void;
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

  const onHandleCopyValue = (username: string) => {
    Clipboard.setString(username);
    SimpleToast.show(translate('toast.copied_username'), SimpleToast.LONG);
  };

  const renderCopyOrSelectedIcon = (item: DropdownItem) => {
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

  const renderDropdownItem = (item: DropdownItem, index: number) => {
    const isLastItem = index === list.length - 1;
    console.log({item}); //TODO remove line
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onHandleSelectedItem(item)}
        style={[
          styles.dropdownItem,
          isLastItem ? {paddingBottom: 20} : undefined,
        ]}>
        {item.icon}
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-end',
          }}>
          <Text style={[styles.textBase, styles.smallerText]}>
            {item.label}
          </Text>
          {typeof item === 'object' ? renderCopyOrSelectedIcon(item) : null}
        </View>
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
              ]}
              data={filteredDropdownList}
              keyExtractor={(item) => item.label}
              renderItem={(item) => renderDropdownItem(item.item, item.index)}
              //TODO bellow add if empty
              // ListEmptyComponent={renderEmpty}
            />
          </>
        </Overlay>
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
    backdrop: {
      flex: 1,
      width: '100%',
      height: '100%',
      backgroundColor: '#00000078',
    },
  });

export default DropdownModal;
