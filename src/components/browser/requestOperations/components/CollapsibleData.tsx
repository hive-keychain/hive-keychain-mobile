import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {FontPoppinsName, getFormFontStyle} from 'src/styles/typography';
import {translate} from 'utils/localize';

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
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setShow(!show)}
        style={styles.row}>
        <Text
          style={[
            getFormFontStyle(width, theme).title,
            styles.confirmationLabel,
          ]}>
          {translate(title)}
        </Text>
        <Text style={[getFormFontStyle(width, theme).title, styles.content]}>
          {show ? translate('request.item.hide_data') : hidden}
        </Text>
      </TouchableOpacity>
      {show && (
        <View style={styles.expandedContentContainer}>
          <Text
            style={[
              getFormFontStyle(width, theme).title,
              styles.expandedContent,
            ]}>
            {content}
          </Text>
        </View>
      )}
    </View>
  );
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    confirmationLabel: {
      paddingRight: 4,
      fontFamily: FontPoppinsName.SEMI_BOLD,
    },
    content: {
      color: getColors(theme).secondaryText,
      flexWrap: 'wrap',
      textAlign: 'right',
      flexShrink: 1,
    },
    container: {
      width: '100%',
    },
    expandedContentContainer: {
      width: '100%',
      marginTop: 12,
    },
    expandedContent: {
      color: getColors(theme).secondaryText,
      flexWrap: 'wrap',
      textAlign: 'left',
      width: '100%',
      lineHeight: 18,
    },
    row: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 4,
    },
  });
