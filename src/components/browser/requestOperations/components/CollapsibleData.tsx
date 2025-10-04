import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {getFormFontStyle} from 'src/styles/typography';

type Props = {
  title: string;
  hidden: string;
  content: string;
};
export default ({title, hidden, content}: Props) => {
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();
  const styles = getStyles(theme, width);
  const [show, setShow] = useState(false);
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => setShow(!show)}
      style={styles.container}>
      {show ? (
        <Text style={[getFormFontStyle(width, theme).title, styles.content]}>
          {content}
        </Text>
      ) : (
        <Text style={[getFormFontStyle(width, theme).title, styles.content]}>
          {hidden}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    content: {
      color: getColors(theme).secondaryText,
      flexWrap: 'wrap',
      paddingLeft: 5,
    },
    container: {
      flexShrink: 1,
    },
  });
