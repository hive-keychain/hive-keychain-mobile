import React from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  getFontSizeSmallDevices,
  title_primary_body_2,
} from 'src/styles/typography';

type Props = {
  title: string;
  content: string;
};
export default ({title, content}: Props) => {
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();
  const styles = getStyles(theme, width);
  return (
    <View style={styles.container}>
      {getTitle({title, theme, width})}
      <Text style={[styles.textBase, styles.content, styles.opaque]}>
        {content}
      </Text>
    </View>
  );
};

export const getTitle = ({
  title,
  theme,
  width,
}: {
  title: string;
  theme: Theme;
  width: number;
}) => {
  const styles = getStyles(theme, width);
  return <Text style={[styles.textBase, styles.title]}>{title}</Text>;
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    container: {paddingVertical: 5},
    title: {fontSize: getFontSizeSmallDevices(width, 14)},
    content: {fontSize: getFontSizeSmallDevices(width, 14)},
    textBase: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
    },
    opaque: {
      opacity: 0.8,
    },
  });
