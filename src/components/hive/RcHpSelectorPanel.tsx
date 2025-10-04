import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {useThemeContext} from 'src/context/theme.context';
import {getCardStyle} from 'src/styles/card';
import {getFormFontStyle} from 'src/styles/typography';
import {getCurrency} from 'utils/hiveLibs.utils';

interface Props {
  valueLabelList: number[];
  onHandlePreset: (value: number) => void;
}

const RcHpSelectorPanel = ({valueLabelList, onHandlePreset}: Props) => {
  const {theme} = useThemeContext();
  const {height} = useWindowDimensions();
  const styles = getStyles();
  return (
    <View style={[styles.delegationValuesButtons]}>
      {valueLabelList.map((value) => {
        return (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => onHandlePreset(value)}
            key={`preset-rc-delegation-panel-item-${value}`}
            style={[getCardStyle(theme).roundedCardItem, styles.button]}>
            <Text
              style={
                getFormFontStyle(height, theme).smallLabel
              }>{`${value.toString()} ${getCurrency('HP')}`}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const getStyles = () =>
  StyleSheet.create({
    delegationValuesButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      justifyContent: 'space-evenly',
      marginVertical: 24,
    },
    button: {width: 60, justifyContent: 'center', alignItems: 'center'},
  });

export default RcHpSelectorPanel;
