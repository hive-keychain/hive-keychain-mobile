import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {title_primary_body_2} from 'src/styles/typography';

type Props = {
  title: string;
  content: string;
};
export default ({title, content}: Props) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme);
  return (
    <View style={styles.container}>
      {getTitle({title, theme})}
      <Text style={[styles.textBase, styles.content, styles.opaque]}>
        {content}
      </Text>
    </View>
  );
};

export const getTitle = ({title, theme}: {title: string; theme: Theme}) => {
  const styles = getStyles(theme);
  return <Text style={[styles.textBase, styles.title]}>{title}</Text>;
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {paddingVertical: 5},
    title: {fontSize: 14},
    content: {fontSize: 14},
    textBase: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
    },
    opaque: {
      opacity: 0.8,
    },
  });
