import Icon from 'components/hive/Icon';
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
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {getRotateStyle} from 'src/styles/transform';
import {fields_primary_text_1} from 'src/styles/typography';

interface Props {
  theme: Theme;
  toggle: boolean;
  setToggle: () => void;
  textLine1: string;
  textLine2: string;
  date: string;
  textLine3?: string;
  memo?: string;
  icon?: JSX.Element;
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
}: Props) => {
  const styles = getStyles(theme, useWindowDimensions());
  return (
    <TouchableOpacity
      style={[getCardStyle(theme).defaultCardItem, styles.container]}
      onPress={setToggle}>
      <View style={styles.main}>
        <View style={styles.rowContainerSpaced}>
          <View style={[styles.row]}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <View
              style={[
                {flexWrap: 'wrap', flexDirection: 'row'},
                styles.width140,
              ]}>
              <Text style={[styles.textBase]}>{textLine1}</Text>
              <Text style={[styles.textBase]}>{textLine2}</Text>
              {textLine3 && <Text style={[styles.textBase]}>{textLine3}</Text>}
            </View>
            <Text style={styles.textBase}>{date}</Text>
            <View>
              {memo && memo.length ? (
                <Icon
                  name="expand_thin"
                  theme={theme}
                  additionalContainerStyle={[
                    toggle ? getRotateStyle('180') : getRotateStyle('0'),
                    styles.expandIconcontainer,
                  ]}
                  {...styles.expandIcon}
                />
              ) : null}
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
    width140: {width: 140},
    main: {
      display: 'flex',
      flexDirection: 'column',
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...fields_primary_text_1,
    },
    iconContainer: {
      width: width / 9,
      height: width / 8.5,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    },
    rowContainerSpaced: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    padding: {
      padding: 8,
    },
    expandIcon: {
      width: 15,
      height: 15,
    },
    expandIconcontainer: {
      marginRight: 10,
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
  });

export default ItemCardExpandable;
