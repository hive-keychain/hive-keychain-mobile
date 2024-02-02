import Clipboard from '@react-native-community/clipboard';
import {showFloatingBar} from 'actions/floatingBar';
import Icon from 'components/hive/Icon';
import React, {useEffect, useRef, useState} from 'react';
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
import SimpleToast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getElementHeight} from 'src/styles/spacing';
import {
  getFontSizeSmallDevices,
  title_primary_body_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import {DropdownItem} from './CustomDropdown';

interface Props {
  list: DropdownItem[];
  selected: string | DropdownItem;
  onSelected: (item: string) => void;
  showSelectedIcon?: JSX.Element;
  dropdownIconScaledSize?: Dimensions;
  copyButtonValue?: boolean;
  additionalListContainerStyle?: StyleProp<ViewStyle>;
}

const Dropdown = ({
  list,
  selected,
  onSelected,
  dropdownIconScaledSize,
  showFloatingBar,
  copyButtonValue,
  showSelectedIcon,
  additionalListContainerStyle,
}: Props & PropsFromRedux) => {
  const {width, height} = useWindowDimensions();
  const {theme} = useThemeContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [dropdownCoordinates, setDropdownCoordinates] = useState<{
    x: number;
    y: number;
  }>({x: 0, y: 0});
  const dropdownRef = useRef();

  useEffect(() => {
    showFloatingBar(!isExpanded);
  }, [isExpanded]);

  useEffect(() => {
    if (dropdownRef && dropdownRef.current) {
      (dropdownRef.current as any).measure(
        (
          fx: number,
          fy: number,
          width: number,
          height: number,
          px: number,
          py: number,
        ) => {
          if (px && px !== 0 && py && py !== 0) {
            setDropdownCoordinates({
              x: px,
              y: py,
            });
          }
        },
      );
    }
  }, []);

  const styles = getStyles(theme, {width, height});

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

  return (
    <TouchableOpacity
      ref={dropdownRef}
      onPress={() => setIsExpanded(!isExpanded)}
      style={{
        zIndex: 100,
        width: '100%',
        height: '100%',
      }}>
      <View
        style={[
          getCardStyle(theme).defaultCardItem,
          styles.dropdownContainer,
          {zIndex: 120},
        ]}>
        {typeof selected === 'string' ? (
          <Text style={[styles.text, {zIndex: 120}]}>{selected}</Text>
        ) : (
          <View style={[styles.flexRow, {zIndex: 120}]}>
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
            isExpanded ? undefined : styles.rotateIcon,
          ]}
          {...dropdownIconScaledSize}
          color={PRIMARY_RED_COLOR}
        />
      </View>
      {list.length > 0 && isExpanded && (
        <ScrollView
          style={[
            getCardStyle(theme).defaultCardItem,
            styles.listContainer,
            {
              zIndex: 120,
              top: getElementHeight(height),
              position: 'absolute',
            },
            additionalListContainerStyle,
          ]}>
          {list.map((item) => {
            return (
              <View
                style={[styles.dropdownItemContainer]}
                key={`dropdown-item-${item.value}`}>
                <TouchableOpacity
                  onPress={() => {
                    onSelected(item.value);
                    setIsExpanded(!isExpanded);
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
                {typeof item === 'object'
                  ? renderCopyOrSelectedIcon(item)
                  : null}
              </View>
            );
          })}
        </ScrollView>
      )}
      {/* //Overlay */}
      {isExpanded && (
        <TouchableOpacity
          activeOpacity={1}
          style={{
            backgroundColor: '#00000097',
            position: 'absolute',
            zIndex: 110,
            width: width * (dropdownCoordinates.y === 0 ? 10 : 1),
            height: height * (dropdownCoordinates.y === 0 ? 10 : 1),
            top: -(dropdownCoordinates.y === 0 ? 200 : dropdownCoordinates.y),
            left: -(dropdownCoordinates.x === 0 ? 300 : dropdownCoordinates.x),
          }}
          onPress={() => setIsExpanded(!isExpanded)}
        />
      )}
    </TouchableOpacity>
  );
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    dropdownContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: getElementHeight(height),
      width: '100%',
      marginBottom: 0,
    },
    dropdownItemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
      paddingRight: 5,
    },
    text: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
      fontSize: getFontSizeSmallDevices(
        height,
        {...title_primary_body_2}.fontSize,
      ),
    },
    listContainer: {
      width: '100%',
      borderRadius: 10,
      maxHeight: 300,
      marginBottom: 0,
    },
    itemSelectedInList: {
      padding: 10,
      backgroundColor: PRIMARY_RED_COLOR,
      borderRadius: 15,
      marginBottom: 8,
    },
    whiteText: {color: '#FFF'},
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    marginLeft: {
      marginLeft: 8,
    },
    rotateIcon: {
      transform: [{rotateX: '180deg'}],
    },
  });

const connector = connect(
  (state: RootState) => {
    return {};
  },
  {
    showFloatingBar,
  },
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Dropdown);
