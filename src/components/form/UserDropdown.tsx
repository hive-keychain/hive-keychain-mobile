import Clipboard from '@react-native-community/clipboard';
import Icon from 'components/hive/Icon';
import {ModalScreenProps} from 'navigators/Root.types';
import React, {useState} from 'react';
import {
  ScrollView,
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
import {TOPCONTAINERSEPARATION} from 'src/styles/spacing';
import {
  getFontSizeSmallDevices,
  title_primary_body_2,
} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import {goBack, navigate} from 'utils/navigation';
import {DropdownItem} from './CustomDropdown';

interface Props {
  list: DropdownItem[];
  selected: string | DropdownItem;
  onSelected: (item: string) => void;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  additionalDropdowContainerStyle?: StyleProp<ViewStyle>;
  copyButtonValue?: boolean;
  dropdownIconScaledSize?: Dimensions;
  showSelectedIcon?: JSX.Element;
  additionalTextStyle?: StyleProp<TextStyle>;
  additionalMainOverlayStyle?: StyleProp<ViewStyle>;
  additionalRenderButtonElementStyle?: StyleProp<ViewStyle>;
}

const UserDropdown = ({
  list,
  selected,
  onSelected,
  additionalContainerStyle,
  additionalDropdowContainerStyle,
  copyButtonValue,
  dropdownIconScaledSize,
  showSelectedIcon,
  additionalTextStyle,
  additionalMainOverlayStyle,
  additionalRenderButtonElementStyle,
}: Props) => {
  const [isListExpanded, setIsListExpanded] = useState(false);
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, {width, height});
  //TODO after finishing this one, go check each use of the same component & fix

  const onHandleClick = () => {
    setIsListExpanded(!isListExpanded);
    navigate('ModalScreen', {
      name: 'UserDropDown',
      modalContent:
        list.length > 0 ? (
          <ScrollView
            style={[
              getCardStyle(theme).defaultCardItem,
              {
                width: '100%',
                borderRadius: 10,
                maxHeight: 300,
                marginBottom: 0,
              },
            ]}>
            {list.map((item) => {
              return (
                <View
                  style={[styles.dropdownItemContainer]}
                  key={`dropdown-item-${item.value}`}>
                  <TouchableOpacity
                    onPress={() => {
                      onSelected(item.value);
                      setIsListExpanded(!isListExpanded);
                      goBack();
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
                        additionalTextStyle,
                      ]}>
                      {item.label ?? item.value}
                    </Text>
                  </TouchableOpacity>
                  {typeof item === 'object'
                    ? renderCopyOrSelectedIcon(item)
                    : null}
                </View>
              );
            })}
          </ScrollView>
        ) : null,
      fixedHeight: 0.5,
      additionalWrapperFixedStyle: [styles.wrapperFixed],
      modalPosition: undefined,
      modalContainerStyle: [styles.modalContainer],
      renderButtonElement: (
        <View style={[additionalRenderButtonElementStyle]}>
          {renderDropdownTop(true)}
        </View>
      ),
    } as ModalScreenProps);
  };

  const renderDropdownTop = (showOpened?: boolean) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onHandleClick}
      style={[
        getCardStyle(theme).defaultCardItem,
        styles.dropdownContainer,
        additionalDropdowContainerStyle,
      ]}>
      {typeof selected === 'string' ? (
        <Text style={[styles.text, additionalTextStyle]}>{selected}</Text>
      ) : (
        <View style={styles.flexRow}>
          {selected.icon}
          <Text style={[styles.text, styles.marginLeft, additionalTextStyle]}>
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

  return <View>{renderDropdownTop()}</View>;
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    modalContainer: {
      width: '80%',
      backgroundColor: 'none',
      borderWidth: 0,
      height: 'auto',
    },
    wrapperFixed: {
      top: 55 + TOPCONTAINERSEPARATION,
      bottom: undefined,
      left: undefined,
      right: width * 0.05,
      width: '80%',
      height: 'auto',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
    },
    dropdownContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
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
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    marginLeft: {
      marginLeft: 8,
    },
  });

export default UserDropdown;
