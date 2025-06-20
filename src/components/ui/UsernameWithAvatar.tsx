import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import Image, {ImageStyle} from 'react-native-fast-image';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  getFontSizeSmallDevices,
  title_primary_body_2,
} from 'src/styles/typography';

type Props = {
  username: string;
  title?: string;
  style?: StyleProp<ViewStyle>;
  avatarStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<ViewStyle>;
};

export default ({username, title, style, avatarStyle, textStyle}: Props) => {
  username = username.startsWith('@') ? username.slice(1) : username;
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();
  const styles = getStyles(theme, width);

  return (
    <View style={[styles.container, style]}>
      {title && <Text style={[styles.textBase, styles.title]}>{title}</Text>}
      {username.toLowerCase() !== 'none' || username !== '' ? (
        <View style={styles.contentContainer}>
          <Image
            style={[{width: 32, height: 32, borderRadius: 16}, avatarStyle]}
            source={{uri: `https://images.hive.blog/u/${username}/avatar`}}
            resizeMode={Image.resizeMode.contain}
            fallback
          />
          <Text
            style={[
              styles.textBase,
              styles.username,
              textStyle,
              styles.opaque,
            ]}>
            {username}
          </Text>
        </View>
      ) : (
        <Text style={[styles.textBase, textStyle, styles.opaque]}>
          {username ? username : 'None'}
        </Text>
      )}
    </View>
  );
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    container: {
      paddingVertical: 5,
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    title: {
      fontSize: getFontSizeSmallDevices(width, 14),
      color: getColors(theme).secondaryText,
      fontFamily: title_primary_body_2.fontFamily,
    },
    username: {
      marginLeft: 8,
    },
    textBase: {
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(width, 14),
      fontFamily: title_primary_body_2.fontFamily,
    },
    opaque: {
      opacity: 0.8,
    },
  });
