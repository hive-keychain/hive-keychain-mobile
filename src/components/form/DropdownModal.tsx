import Icon from 'components/hive/Icon';
import Separator from 'components/ui/Separator';
import SlidingOverlay from 'components/ui/SlidingOverlay';
import * as Clipboard from 'expo-clipboard';
import React, {
  ReactElement,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Pressable,
  FlatList as RNFlatList,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import DraggableFlatList, {
  DragEndParams,
} from 'react-native-draggable-flatlist';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SimpleToast from 'react-native-root-toast';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {Dimensions} from 'src/interfaces/common.interface';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {inputStyle} from 'src/styles/input';
import {LABEL_INDENT_SPACE, MIN_SEPARATION_ELEMENTS} from 'src/styles/spacing';
import {
  FontPoppinsName,
  getFontSizeSmallDevices,
  title_primary_body_2,
} from 'src/styles/typography';
import {translate} from 'utils/localize';
import CustomSearchBar from './CustomSearchBar';
export interface DropdownModalItem {
  value: string;
  label?: string;
  removable?: boolean;
  icon?: React.ReactNode;
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
  showSelectedIcon?: boolean;
  copyButtonValue?: boolean;
  selectedBgColor?: string;
  drawLineBellowSelectedItem?: boolean;
  hideLabel?: boolean;
  canBeReordered?: boolean;
  onReorder?: (reorderedList: DropdownModalItem[]) => void;
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
  showSelectedIcon,
  copyButtonValue,
  selectedBgColor,
  addExtraHeightFromElements,
  onRemove,
  additionalItemLabelTextStyle,
  hideLabel,
  canBeReordered,
  onReorder,
}: Props) => {
  const dropdownContainerRef = useRef<View>(null);
  const [dropdownPageY, setDropdownPageY] = useState(0);
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filteredDropdownList, setFilteredDropdownList] =
    useState<DropdownModalItem[]>(list);
  const [isDragging, setIsDragging] = useState(false);
  const [pendingSelect, setPendingSelect] = useState<DropdownModalItem | null>(
    null,
  );
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

  const onHandleSelectedItem = useCallback(
    (item: DropdownModalItem) => {
      setPendingSelect(item);
      setIsListExpanded(false);
      onReorder?.([...filteredDropdownList]);
    },
    [onSelected, onReorder, filteredDropdownList],
  );

  // After overlay closes, apply pending selection
  useEffect(() => {
    if (!isListExpanded && pendingSelect) {
      const toSelect = pendingSelect;
      setPendingSelect(null);
      setTimeout(() => onSelected(toSelect), 0);
    }
  }, [isListExpanded, pendingSelect, onSelected]);

  const onHandleCopyValue = (username: string) => {
    Clipboard.setStringAsync(username);
    SimpleToast.show(translate('toast.copied_username'), {
      duration: SimpleToast.durations.LONG,
    });
  };

  const onHandleCopyValueCb = useCallback(
    (value: string) => () => onHandleCopyValue(value),
    [onHandleCopyValue],
  );
  const onRemoveCb = useCallback(
    (value: string) => () => onRemove && onRemove(value),
    [onRemove],
  );
  const dragCb = useCallback((drag: any) => () => drag && drag(), []);

  // Helper function to compare selected and item by value/label (robust, handles undefined)
  function isItemSelected(
    selected: string | DropdownModalItem | undefined,
    item: DropdownModalItem | undefined,
  ) {
    if (!selected || !item) return false;
    if (typeof selected === 'object' && selected !== null) {
      if (selected.value !== undefined && item.value !== undefined) {
        return selected.value === item.value;
      }
      if (selected.label !== undefined && item.label !== undefined) {
        return selected.label === item.label;
      }
      return false;
    }
    return selected === item.value || selected === item.label;
  }

  const renderIcons = useCallback(
    (item: DropdownModalItem, drag: any) => {
      const matchingSelected = isItemSelected(selected, item);

      return showSelectedIcon || copyButtonValue ? (
        <View
          style={[
            styles.flexRow,
            {
              marginLeft: MIN_SEPARATION_ELEMENTS,
            },
          ]}>
          {matchingSelected ? (
            <View style={{width: 20}}>
              {
                <Icon
                  name={Icons.CHECK}
                  theme={theme}
                  width={18}
                  height={18}
                  strokeWidth={1.5}
                  color={PRIMARY_RED_COLOR}
                />
              }
            </View>
          ) : null}
          {copyButtonValue && (
            <Icon
              theme={theme}
              name={Icons.COPY}
              onPress={onHandleCopyValueCb(item.value)}
              width={16}
              height={16}
              additionalContainerStyle={{marginLeft: 6}}
              strokeWidth={2}
              color={PRIMARY_RED_COLOR}
            />
          )}
          {drag && canBeReordered && (
            <Pressable onPressIn={dragCb(drag)}>
              <Icon
                name={Icons.DRAG}
                theme={theme}
                width={16}
                height={16}
                additionalContainerStyle={{marginLeft: 6}}
                strokeWidth={2}
                color={PRIMARY_RED_COLOR}
              />
            </Pressable>
          )}
        </View>
      ) : null;
    },
    [
      selected,
      showSelectedIcon,
      copyButtonValue,
      theme,
      canBeReordered,
      dragCb,
    ],
  );

  // Memoized DropdownItem
  const DropdownItem = memo(function DropdownItem({
    item,
    index,
    drag,
    isActive,
    selected,
    selectedBgColor,
    theme,
    width,
    additionalItemLabelTextStyle,
    onRemoveCb,
    renderIcons,
    listLength,
  }: {
    item: DropdownModalItem;
    index: number;
    drag?: () => void;
    isActive: boolean;
    selected: string | DropdownModalItem;
    selectedBgColor?: string;
    theme: Theme;
    width: number;
    additionalItemLabelTextStyle?: StyleProp<TextStyle>;
    onRemoveCb: (value: string) => () => void;
    renderIcons: (item: DropdownModalItem, drag: any) => React.ReactNode | null;
    listLength: number;
  }) {
    const showSelectedBgOnItem =
      selectedBgColor && isItemSelected(selected, item);
    const bgStyle = showSelectedBgOnItem
      ? ({backgroundColor: selectedBgColor} as ViewStyle)
      : null;
    const innerContainerStyle = {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: item.removable ? '100%' : 'auto',
      alignItems: 'center',
      alignContent: 'center',
    } as ViewStyle;
    const innerContainerBgStyle = selectedBgColor
      ? ({paddingHorizontal: 10, alignContent: 'space-between'} as ViewStyle)
      : undefined;
    const labelTextStyle = showSelectedBgOnItem
      ? ({color: 'white'} as ViewStyle)
      : ({marginLeft: MIN_SEPARATION_ELEMENTS} as ViewStyle);

    return (
      <View style={[{paddingVertical: 4}]}>
        <Pressable
          onPress={onHandleSelectedItem.bind(null, item)}
          hitSlop={{top: 10, bottom: 10, left: 8, right: 8}}
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
                onPress={onRemoveCb(item.value)}
                color={showSelectedBgOnItem ? 'white' : PRIMARY_RED_COLOR}
              />
            )}
          </View>
          {typeof item === 'object' ? renderIcons(item, drag) : null}
        </Pressable>
        {index !== listLength - 1 && (
          <Separator
            additionalLineStyle={{
              borderColor: getCardStyle(theme).borderTopCard.borderColor,
            }}
            height={0}
          />
        )}
      </View>
    );
  });

  // Extracted PossiblyDraggableFlatList as a separate component
  const PossiblyDraggableFlatList = React.memo(
    ({
      canBeReordered,
      onDragEnd,
      renderDraggableItem,
      renderFlatItem,
      filteredDropdownList,
      ...props
    }: {
      canBeReordered: boolean;
      onDragEnd?: (data: DragEndParams<DropdownModalItem>) => void;
      renderDraggableItem: ({
        item,
        drag,
        getIndex,
        isActive,
      }: any) => ReactElement;
      renderFlatItem: ({item, index}: any) => ReactElement;
      filteredDropdownList: DropdownModalItem[];
      [key: string]: any;
    }) => {
      if (canBeReordered) {
        return (
          <GestureHandlerRootView>
            <DraggableFlatList
              {...props}
              onDragEnd={onDragEnd}
              data={filteredDropdownList}
              renderItem={renderDraggableItem}
              keyExtractor={(item) => item.value}
            />
          </GestureHandlerRootView>
        );
      }
      // Use RN FlatList for better press reliability
      return (
        <RNFlatList
          {...props}
          data={filteredDropdownList}
          renderItem={renderFlatItem}
          keyExtractor={(item) => item.value}
          keyboardShouldPersistTaps="always"
        />
      );
    },
  );

  // Memoized renderDraggableItem
  const renderDraggableItem = useCallback(
    ({
      item,
      drag,
      getIndex,
      isActive,
    }: {
      item: DropdownModalItem;
      drag?: () => void;
      getIndex: () => number;
      isActive: boolean;
    }) => (
      <DropdownItem
        item={item}
        index={getIndex()}
        drag={drag}
        isActive={isActive}
        selected={selected}
        selectedBgColor={selectedBgColor}
        theme={theme}
        width={width}
        additionalItemLabelTextStyle={additionalItemLabelTextStyle}
        onRemoveCb={onRemoveCb}
        renderIcons={renderIcons}
        listLength={filteredDropdownList.length}
      />
    ),
    [
      selected,
      selectedBgColor,
      theme,
      width,
      additionalItemLabelTextStyle,
      onRemoveCb,
      renderIcons,
      filteredDropdownList.length,
    ],
  );
  // Memoized renderFlatItem
  const renderFlatItem = useCallback(
    ({item, index}: {item: DropdownModalItem; index: number}) => (
      <DropdownItem
        item={item}
        index={index}
        isActive={false}
        selected={selected}
        selectedBgColor={selectedBgColor}
        theme={theme}
        width={width}
        additionalItemLabelTextStyle={additionalItemLabelTextStyle}
        onRemoveCb={onRemoveCb}
        renderIcons={renderIcons}
        listLength={filteredDropdownList.length}
      />
    ),
    [
      selected,
      selectedBgColor,
      theme,
      width,
      additionalItemLabelTextStyle,
      onRemoveCb,
      renderIcons,
      filteredDropdownList.length,
    ],
  );

  const renderSelectedValue = (showOpened?: boolean) => (
    <Pressable
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
    </Pressable>
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
      {isListExpanded ? (
        <SlidingOverlay
          showOverlay={isListExpanded}
          setShowOverlay={(isOpen) => {
            setIsListExpanded(isOpen);
            if (!isOpen) {
              onReorder?.([...filteredDropdownList]);
            }
          }}
          title={dropdownTitle}>
          {enableSearch && (
            <CustomSearchBar
              theme={theme}
              value={searchValue}
              onChangeText={(text) => setSearchValue(text)}
              additionalContainerStyle={styles.searchContainer}
            />
          )}
          <PossiblyDraggableFlatList
            canBeReordered={canBeReordered}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
            scrollEnabled={true}
            initialNumToRender={12}
            maxToRenderPerBatch={12}
            windowSize={7}
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
            filteredDropdownList={filteredDropdownList}
            scrollToOverflowEnabled
            onDragEnd={({data}) => {
              setFilteredDropdownList([...data]);
            }}
            renderDraggableItem={renderDraggableItem}
            renderFlatItem={renderFlatItem}
          />
        </SlidingOverlay>
      ) : null}
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
      height: 50,
      marginBottom: 5,
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
