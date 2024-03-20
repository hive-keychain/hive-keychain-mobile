import Icon from 'components/hive/Icon';
import React from 'react';
import {Linking, StyleSheet, Text, View} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {
  FontPoppinsName,
  button_link_primary_small,
} from 'src/styles/typography';
import {translate} from 'utils/localize';

interface Props {
  labelTranslationKey: string;
  value: string;
  theme: Theme;
  bottomValue?: string;
  urlOnTitle?: string;
}

const MyWitnessDataBlock = ({
  labelTranslationKey,
  value,
  bottomValue,
  theme,
  urlOnTitle,
}: Props) => {
  const styles = getStyles(theme);
  return (
    <View style={[getCardStyle(theme).defaultCardItem, styles.container]}>
      <View style={styles.flexRow}>
        <Text style={[styles.textBase, styles.textBold]}>
          {translate(labelTranslationKey)}
        </Text>
        {urlOnTitle && (
          <Icon
            theme={theme}
            name={Icons.EXTERNAL_LINK}
            onPress={() => Linking.openURL(urlOnTitle)}
            {...styles.icon}
          />
        )}
      </View>
      <Text style={[styles.textBase, styles.textOpaque, styles.smallerText]}>
        {value}
      </Text>
      {bottomValue && (
        <Text style={[styles.textBase, styles.textOpaque, styles.smallerText]}>
          {bottomValue}
        </Text>
      )}
    </View>
  );
};

export default MyWitnessDataBlock;

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '49%',
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    textBold: {
      fontFamily: FontPoppinsName.BOLD,
    },
    textBase: {
      color: getColors(theme).secondaryText,
      ...button_link_primary_small,
    },
    textOpaque: {
      opacity: 0.7,
    },
    smallerText: {
      fontSize: 11,
    },
    flexRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      width: 15,
      height: 15,
    },
  });
