import Icon from 'components/hive/Icon';
import {VscStatus} from 'hive-keychain-commons';
import React from 'react';
import {
  ScaledSize,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getRotateStyle} from 'src/styles/transform';
import {fields_primary_text_1} from 'src/styles/typography';

interface Props {
  theme: Theme;
  toggle: boolean;
  setToggle: () => void;
  textLine1: string;
  date: string;
  textLine2?: string;
  textLine3?: string;
  memo?: string;
  icon?: JSX.Element;
  status?: string | VscStatus;
}

const ItemCardExpandable = ({
  theme,
  toggle,
  setToggle,
  icon,
  textLine1,
  textLine2,
  date,
  memo,
  textLine3,
  status,
}: Props) => {
  const styles = getStyles(theme, useWindowDimensions());

  const getStatusIcon = () => {
    switch (status) {
      case VscStatus.CONFIRMED:
        return Icons.CHECK;
      case VscStatus.FAILED:
        return Icons.CLOSE_CIRCLE;
      default:
        return Icons.CLOCK;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[getCardStyle(theme).defaultCardItem, styles.container]}
      onPress={setToggle}>
      <View style={styles.main}>
        <View style={styles.rowContainerSpaced}>
          <View style={[styles.row]}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <View style={[styles.flexWrapGrow2, styles.width140]}>
              <View>
                <Text style={[styles.textBase]}>{textLine1}</Text>
                {textLine2 && (
                  <Text style={[styles.textBase]}>{textLine2}</Text>
                )}
                {textLine3 && (
                  <Text style={[styles.textBase]}>{textLine3}</Text>
                )}
              </View>
            </View>
            <View
              style={[
                styles.dateExpanderContainer,
                !status && styles.dateExpanderContainerNoStatus,
              ]}>
              <View style={[styles.dateContainer]}>
                <Text style={styles.textBase}>{date}</Text>
              </View>
              {status && (
                <View style={styles.statusContainer}>
                  <Icon
                    name={getStatusIcon()}
                    theme={theme}
                    color={PRIMARY_RED_COLOR}
                  />
                </View>
              )}
              <View style={styles.memoContainer}>
                {memo && memo.length ? (
                  <Icon
                    name={Icons.EXPAND_THIN}
                    theme={theme}
                    additionalContainerStyle={[
                      toggle ? getRotateStyle('0') : getRotateStyle('180'),
                      styles.expandIconcontainer,
                    ]}
                    {...styles.expandIcon}
                    color={PRIMARY_RED_COLOR}
                  />
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </View>
      {toggle && memo && memo.length ? (
        <Text style={[styles.textBase, styles.padding]}>{memo}</Text>
      ) : null}
    </TouchableOpacity>
  );
};

const getStyles = (theme: Theme, {width, height}: ScaledSize) =>
  StyleSheet.create({
    container: {
      borderRadius: 20,
      paddingVertical: 2,
      paddingHorizontal: 4,
    },
    width140: {
      width: width / 6,
      paddingHorizontal: 1,
    },
    main: {
      display: 'flex',
      flexDirection: 'column',
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...fields_primary_text_1,
    },
    iconContainer: {
      marginLeft: 2,
      width: width / 9,
      height: width / 8.5,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    },
    rowContainerSpaced: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: '100%',
    },
    padding: {
      padding: 8,
    },
    dateExpanderContainer: {
      flexGrow: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: width / 4,
      alignItems: 'center',
    },
    dateExpanderContainerNoStatus: {
      flexGrow: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: width / 14,
      alignItems: 'center',
    },
    dateContainer: {
      minWidth: width / 5,
    },
    statusContainer: {
      width: 16,
      alignItems: 'center',
      marginHorizontal: 8,
    },
    memoContainer: {
      width: 24,
      alignItems: 'center',
      paddingRight: 12,
    },
    expandIcon: {
      width: 15,
      height: 15,
    },
    expandIconcontainer: {
      marginLeft: 0,
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    flexWrapGrow2: {flexWrap: 'wrap', flexDirection: 'row', flexGrow: 2},
  });

export default ItemCardExpandable;
