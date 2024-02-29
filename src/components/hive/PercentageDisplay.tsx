import React from 'react';
import {
  ScaledSize,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {DARKER_RED_COLOR, getColors} from 'src/styles/colors';
import {
  fields_primary_text_2,
  getFontSizeSmallDevices,
  title_secondary_body_3,
  title_secondary_title_2,
} from 'src/styles/typography';
import Icon from './Icon';

type Props = {
  IconBgcolor: string;
  percent: number;
  name: string;
  theme: Theme;
  iconName: Icons;
  bgColor: string;
  secondary?: string;
};
const PercentageDisplay = ({
  IconBgcolor,
  percent,
  name,
  secondary,
  theme,
  iconName,
  bgColor,
}: Props) => {
  const styles = getDimensionedStyles(
    useWindowDimensions(),
    IconBgcolor,
    percent,
    theme,
    bgColor,
  );

  return (
    <View style={styles.container}>
      <Icon
        color={'#FFF'}
        theme={theme}
        name={iconName}
        additionalContainerStyle={styles.iconContainer}
        width={22}
        height={22}
      />
      <View style={styles.textWrapper}>
        <View style={{flexGrow: 1}}>
          <Text style={styles.name}>{name}</Text>
          <View style={[styles.textWrapper]}>
            <Text style={[styles.percent]}>
              {`${percent.toFixed(0)}`}
              <Text style={[{...title_secondary_body_3}]}> % </Text>

              <Text style={styles.secondary}>{secondary}</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const getDimensionedStyles = (
  {width, height}: ScaledSize,
  IconBgcolor: string,
  percent: number,
  theme: Theme,
  bgColor: string,
) =>
  StyleSheet.create({
    textWrapper: {
      display: 'flex',
      flexDirection: 'row',
      flexGrow: 1,
    },
    justifyBetween: {
      display: 'flex',
      justifyContent: 'space-between',
      flexGrow: 1,
      maxWidth: '90%',
    },
    name: {
      color: '#FFF',
      opacity: 0.7,
      ...title_secondary_body_3,
      fontSize: getFontSizeSmallDevices(
        width,
        {...title_secondary_body_3}.fontSize,
      ),
    },
    percent: {
      color: '#FFF',
      ...title_secondary_title_2,
      fontSize: getFontSizeSmallDevices(width, 30),
      lineHeight: 30,
    },
    container: {
      display: 'flex',
      flexDirection: 'row',
      width: '48%',
      borderColor: getColors(theme).cardBorderColorJustDark,
      borderWidth: theme === Theme.DARK && bgColor !== DARKER_RED_COLOR ? 1 : 0,
      borderRadius: 13,
      paddingHorizontal: 15,
      paddingVertical: 10,
      backgroundColor: bgColor,
    },
    iconContainer: {
      backgroundColor: IconBgcolor,
      borderRadius: 12,
      padding: 3,
      width: 35,
      height: 35,
      marginRight: 5,
    },
    secondary: {
      color: '#FFF',
      paddingLeft: 10,
      ...fields_primary_text_2,
      textAlignVertical: 'bottom',
      fontSize: getFontSizeSmallDevices(width, fields_primary_text_2.fontSize),
    },
  });

export default PercentageDisplay;
