import {Image, ImageStyle} from 'expo-image';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  button_link_primary_medium,
  getFontSizeSmallDevices,
  title_primary_body_2,
} from 'src/styles/typography';

type Props = {
  username: string;
  title?: string;
  style?: StyleProp<ViewStyle>;
  avatarStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<ViewStyle>;
  avatarPosition?: 'left' | 'right';
  alignAllToLeft?: boolean;
};

export default ({
  username,
  title,
  style,
  avatarStyle,
  textStyle,
  avatarPosition = 'right',
  alignAllToLeft = true,
}: Props) => {
  username = username.startsWith('@')
    ? username.slice(1).trim()
    : username.trim();
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();
  const styles = getStyles(theme, width, alignAllToLeft);
  return (
    <View style={[styles.container, style]}>
      {title && <Text style={[styles.textBase, styles.title]}>{title}</Text>}
      {username.toLowerCase() !== 'none' || username !== '' ? (
        <View style={styles.contentContainer}>
          {avatarPosition === 'left' ? (
            <>
              <Image
                style={[styles.avatar, avatarStyle]}
                source={{
                  uri: `https://images.hive.blog/u/${
                    username.split(' ')[0]
                  }/avatar`,
                }}
                contentFit="contain"
              />
              <Text
                style={[
                  styles.textBase,
                  styles.username,
                  textStyle,
                  styles.opaque,
                ]}>
                @{username}
              </Text>
            </>
          ) : (
            <>
              <Text
                style={[
                  styles.textBase,
                  styles.usernameRight,
                  textStyle,
                  styles.opaque,
                ]}>
                @{username}
              </Text>
              <Image
                style={[styles.avatar, avatarStyle]}
                source={{
                  uri: `https://images.hive.blog/u/${
                    username.split(' ')[0]
                  }/avatar`,
                }}
                contentFit="contain"
              />
            </>
          )}
        </View>
      ) : (
        <Text style={[styles.textBase, textStyle, styles.opaque]}>
          {username ? username : 'None'}
        </Text>
      )}
    </View>
  );
};

const getStyles = (theme: Theme, width: number, alignAllToLeft: boolean) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: alignAllToLeft ? 'flex-start' : 'flex-end',
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    title: {
      fontSize: getFontSizeSmallDevices(width, 14),
      color: getColors(theme).secondaryText,
      fontFamily: title_primary_body_2.fontFamily,
      textAlign: alignAllToLeft ? 'left' : 'right',
    },
    username: {
      marginLeft: 8,
    },
    usernameRight: {
      marginRight: 8,
    },
    textBase: {
      ...button_link_primary_medium,
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(
        width,
        {...button_link_primary_medium}.fontSize,
      ),
    },
    opaque: {
      opacity: 0.8,
    },
  });
