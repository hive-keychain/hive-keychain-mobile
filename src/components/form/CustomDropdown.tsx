import Clipboard from '@react-native-community/clipboard';
import Icon from 'components/hive/Icon';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
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
import SimpleToast from 'react-native-simple-toast';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {
  SMALLEST_SCREEN_HEIGHT_SUPPORTED,
  getFontSizeSmallDevices,
  title_primary_body_2,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';

export interface DropdownItem {
  value: string;
  label?: string;
  removable?: boolean;
  icon?: JSX.Element;
}

type CustomDropdownBehaviour = 'down' | 'overlay';

interface Props {
  theme: Theme;
  selected: string | DropdownItem;
  list: DropdownItem[];
  onSelected: (item: string) => void;
  onRemove?: (item: string) => void;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  additionalDropdowContainerStyle?: StyleProp<ViewStyle>;
  dropdownIconScaledSize?: Dimensions;
  keyExtractor?: keyof DropdownItem;
  behaviour?: CustomDropdownBehaviour;
  titleTranslationKey?: string;
  copyButtonValue?: boolean;
  showSelectedIcon?: JSX.Element;
}

const CustomDropdown = ({
  theme,
  list,
  additionalContainerStyle,
  selected,
  onSelected,
  onRemove,
  keyExtractor,
  behaviour,
  titleTranslationKey,
  additionalDropdowContainerStyle,
  dropdownIconScaledSize,
  copyButtonValue,
  showSelectedIcon,
}: Props) => {
  const [isListExpanded, setIsListExpanded] = useState(false);
  const styles = getStyles(theme, useWindowDimensions().height);
  const behaveAs = behaviour ?? 'down';

  const renderExpandedList = (children: JSX.Element) => {
    if (behaveAs === 'down') {
      return (
        <View
          style={[
            getCardStyle(theme).defaultCardItem,
            styles.dropdownListContainer,
          ]}>
          {children}
        </View>
      );
    } else {
      return (
        <Overlay
          overlayStyle={[getCardStyle(theme).defaultCardItem, styles.overlay]}
          isVisible={isListExpanded}
          onBackdropPress={() => setIsListExpanded(!isListExpanded)}>
          <>
            {titleTranslationKey && (
              <>
                <Text style={[styles.text, styles.aligned]}>
                  {translate(titleTranslationKey)}
                </Text>
                <Separator
                  drawLine
                  height={10}
                  additionalLineStyle={styles.bottomLine}
                />
              </>
            )}
            {children}
          </>
        </Overlay>
      );
    }
  };

  const onHandleCopyValue = (username: string) => {
    Clipboard.setString(username);
    SimpleToast.show(translate('toast.copied_username'), SimpleToast.LONG);
  };

  const renderCopyOrSelectedIcon = (item: DropdownItem) => {
    return showSelectedIcon || copyButtonValue ? (
      <View style={styles.flexRow}>
        {copyButtonValue && (
          <Icon
            theme={theme}
            name={Icons.COPY}
            onClick={() => onHandleCopyValue(item.value)}
            width={16}
            height={16}
            additionalContainerStyle={{marginRight: 4}}
            strokeWidth={2}
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

  return (
    <View style={[styles.container, additionalContainerStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setIsListExpanded(!isListExpanded)}
        style={[
          getCardStyle(theme).defaultCardItem,
          styles.dropdownContainer,
          additionalDropdowContainerStyle,
        ]}>
        {typeof selected === 'string' ? (
          <Text style={styles.text}>{selected}</Text>
        ) : (
          <View style={styles.flexRow}>
            {selected.icon}
            <Text style={[styles.text, styles.marginLeft]}>
              {selected.label}
            </Text>
          </View>
        )}
        <Icon
          name={Icons.EXPAND_THIN}
          theme={theme}
          additionalContainerStyle={[
            styles.marginLeft,
            isListExpanded ? styles.rotateIcon : undefined,
          ]}
          {...dropdownIconScaledSize}
        />
      </TouchableOpacity>
      {isListExpanded &&
        list.length > 0 &&
        renderExpandedList(
          <ScrollView>
            {list.map((item) => {
              return (
                <View
                  style={[styles.dropdownItemContainer]}
                  key={
                    keyExtractor
                      ? `dropdown-${item[keyExtractor]}`
                      : `dropdown-item-${item.value}`
                  }>
                  <TouchableOpacity
                    onPress={() => {
                      onSelected(item.value);
                      setIsListExpanded(!isListExpanded);
                    }}
                    style={[
                      item.value === selected || item.label === selected
                        ? styles.itemSelectedInList
                        : undefined,
                      typeof item === 'object' ? styles.flexRow : undefined,
                    ]}>
                    {typeof item === 'object' && item.icon ? item.icon : null}
                    <Text
                      style={[
                        styles.text,
                        item.value === selected || item.label === selected
                          ? styles.whiteText
                          : undefined,
                        typeof selected === 'object'
                          ? styles.marginLeft
                          : undefined,
                      ]}>
                      {item.label ?? item.value}
                    </Text>
                  </TouchableOpacity>
                  {item.removable && (
                    <Icon
                      theme={theme}
                      name={Icons.REMOVE}
                      onClick={() => onRemove(item.value)}
                    />
                  )}
                  {typeof item === 'object'
                    ? renderCopyOrSelectedIcon(item)
                    : null}
                </View>
              );
            })}
          </ScrollView>,
        )}
    </View>
  );
};

export default CustomDropdown;

const getStyles = (theme: Theme, height: number) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: height <= SMALLEST_SCREEN_HEIGHT_SUPPORTED ? 45 : 60,
    },
    dropdownContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dropdownListContainer: {
      width: 250,
      position: 'absolute',
      top: 51,
      zIndex: 10,
      maxHeight: 200,
      right: 0,
      left: undefined,
    },
    rotateIcon: {
      transform: [{rotateX: '180deg'}],
    },
    text: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
      fontSize: getFontSizeSmallDevices(
        height,
        {...title_primary_body_2}.fontSize,
      ),
    },
    whiteText: {color: '#FFF'},
    dropdownItemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
      paddingRight: 5,
    },
    itemSelectedInList: {
      padding: 10,
      backgroundColor: PRIMARY_RED_COLOR,
      borderRadius: 15,
      marginBottom: 8,
    },
    overlay: {
      maxHeight: 250,
      height: 'auto',
      maxWidth: 250,
    },
    aligned: {
      textAlign: 'center',
    },
    bottomLine: {
      width: 200,
      borderColor: getColors(theme).contrastBackground,
      alignSelf: 'center',
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    marginLeft: {
      marginLeft: 8,
    },
    title: {
      fontSize: getFontSizeSmallDevices(
        height,
        {...title_primary_body_2}.fontSize,
      ),
    },
  });
