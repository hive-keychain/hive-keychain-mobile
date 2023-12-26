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
} from 'react-native';
import {Overlay} from 'react-native-elements';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {title_primary_body_2} from 'src/styles/typography';
import {translate} from 'utils/localize';

export interface DropdownItem {
  value: string;
  label?: string;
  removable?: boolean;
}

type CustomDropdownBehaviour = 'down' | 'overlay';

interface Props {
  theme: Theme;
  selected: string;
  list: DropdownItem[];
  onSelected: (item: string) => void;
  onRemove?: (item: string) => void;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  keyExtractor?: keyof DropdownItem;
  behaviour?: CustomDropdownBehaviour;
  titleTranslationKey?: string;
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
}: Props) => {
  const [isListExpanded, setIsListExpanded] = useState(false);
  const styles = getStyles(theme);

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

  return (
    <View style={[styles.container, additionalContainerStyle]}>
      <View
        style={[getCardStyle(theme).defaultCardItem, styles.dropdownContainer]}>
        <Text style={styles.text}>{selected}</Text>
        <Icon
          name={Icons.EXPAND_THIN}
          theme={theme}
          onClick={() => setIsListExpanded(!isListExpanded)}
          additionalContainerStyle={
            isListExpanded ? styles.rotateIcon : undefined
          }
        />
      </View>
      {isListExpanded &&
        list.length > 0 &&
        renderExpandedList(
          <ScrollView>
            {list.map((item) => {
              return (
                <View
                  style={styles.dropdownItemContainer}
                  key={
                    keyExtractor
                      ? `dropdown-${item[keyExtractor]}`
                      : `dropdown-item-${item.value}`
                  }>
                  <TouchableOpacity
                    onPress={() => onSelected(item.value)}
                    style={[
                      item.value === selected || item.label === selected
                        ? styles.itemSelectedInList
                        : undefined,
                    ]}>
                    <Text
                      style={[
                        styles.text,
                        item.value === selected || item.label === selected
                          ? styles.whiteText
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
                </View>
              );
            })}
          </ScrollView>,
        )}
    </View>
  );
};

export default CustomDropdown;

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    dropdownContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: 1,
      flexGrow: 1,
      minHeight: 55,
    },
    dropdownListContainer: {
      width: '100%',
      position: 'absolute',
      top: 55,
      zIndex: 10,
      maxHeight: 200,
    },
    rotateIcon: {
      transform: [{rotateX: '180deg'}],
    },
    text: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
    },
    whiteText: {color: '#FFF'},
    dropdownItemContainer: {
      paddingBottom: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
  });
