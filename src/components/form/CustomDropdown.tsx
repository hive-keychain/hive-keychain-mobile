import Icon from 'components/hive/Icon';
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
import {Theme} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {title_primary_body_2} from 'src/styles/typography';

export interface DropdownItem {
  value: string;
  label?: string;
  removable?: boolean;
}

interface Props {
  theme: Theme;
  selected: string;
  list: DropdownItem[];
  onSelected: (item: string) => void;
  onRemove?: (item: string) => void;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  keyExtractor?: keyof DropdownItem;
}

const CustomDropdown = ({
  theme,
  list,
  additionalContainerStyle,
  selected,
  onSelected,
  onRemove,
  keyExtractor,
}: Props) => {
  const [isListExpanded, setIsListExpanded] = useState(false);
  const styles = getStyles(theme);
  //TODO check if need to fix using label, instead of .value
  return (
    <View style={[styles.container, additionalContainerStyle]}>
      <View
        style={[getCardStyle(theme).defaultCardItem, styles.dropdownContainer]}>
        <Text style={styles.text}>{selected}</Text>
        <Icon
          name="expand_thin"
          theme={theme}
          onClick={() => setIsListExpanded(!isListExpanded)}
          additionalContainerStyle={
            isListExpanded ? styles.rotateIcon : undefined
          }
        />
      </View>
      {isListExpanded && list.length > 0 && (
        <View
          style={[
            getCardStyle(theme).defaultCardItem,
            styles.dropdownListContainer,
          ]}>
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
                      item.label === selected
                        ? styles.itemSelectedInList
                        : undefined,
                    ]}>
                    <Text
                      style={[
                        styles.text,
                        item.label === selected ? styles.whiteText : undefined,
                      ]}>
                      {item.label ?? item.value}
                    </Text>
                  </TouchableOpacity>
                  {item.removable && (
                    <Icon
                      theme={theme}
                      name="remove"
                      onClick={() => onRemove(item.value)}
                    />
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
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
  });
