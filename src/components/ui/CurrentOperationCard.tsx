import Icon from 'components/hive/Icon';
import {capitalize} from 'lodash';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {getCardStyle} from 'src/styles/card';
import {getRotateStyle} from 'src/styles/transform';
import {FontJosefineSansName, getFormFontStyle} from 'src/styles/typography';
import {translate} from 'utils/localize';

export const CurrentOperationCard = ({
  onPress,
  title,
  value,
}: {
  onPress: () => void;
  title: string;
  value: string;
}) => {
  const {theme} = useThemeContext();
  const {height} = useWindowDimensions();
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={[getCardStyle(theme).defaultCardItem, styles.displayAction]}>
      <View>
        <Text
          style={[
            getFormFontStyle(height, theme).smallLabel,
            styles.josefineFont,
            styles.opaque,
          ]}>
          {capitalize(translate(title))}
        </Text>
        <Text
          style={[getFormFontStyle(height, theme).input, styles.josefineFont]}>
          {value}
        </Text>
      </View>
      <Icon
        theme={theme}
        name={Icons.EXPAND}
        additionalContainerStyle={getRotateStyle('90')}
        width={13}
        height={13}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  displayAction: {
    marginHorizontal: 15,
    borderRadius: 26,
    paddingHorizontal: 21,
    paddingVertical: 13,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  josefineFont: {
    fontFamily: FontJosefineSansName.MEDIUM,
  },
  opaque: {
    opacity: 0.7,
  },
});
