import Heart from 'assets/new_UI/heart.svg';
import CloseButton from 'components/ui/CloseButton';
import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {headlines_primary_headline_2} from 'src/styles/typography';
import {Width} from 'utils/common.types';
import {capitalizeSentence} from 'utils/format';
import {translate} from 'utils/localize';

export default ({username, theme}: {username: string; theme: Theme}) => {
  const {width} = useWindowDimensions();
  const styles = getDimensionedStyles({width}, theme);
  return (
    <View style={styles.container}>
      {/* <UserProfilePicture username={username} style={styles.image} />
      <Text style={styles.username}>@{username}</Text> */}
      <View style={{flexDirection: 'row'}}>
        <CloseButton theme={theme} />
        <Text style={styles.textHeader}>Menu</Text>
      </View>
      <Text style={{textAlign: 'center'}}>
        <Text style={[styles.textHeader, styles.textOpaque, {fontSize: 16}]}>
          {capitalizeSentence(translate('drawerFooter.madeBy_part_1'))}
        </Text>
        <Heart width={18} height={18} />
        <Text style={[styles.textHeader, styles.textOpaque, {fontSize: 16}]}>
          {capitalizeSentence(translate('drawerFooter.madeBy_part_2'))}
        </Text>
      </Text>
      <View>
        <Text>Switch //TODO</Text>
      </View>
    </View>
  );
};

const getDimensionedStyles = ({width}: Width, theme: Theme) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      alignItems: 'center',
    },
    username: {color: 'white', fontSize: 20},
    image: {
      width: width / 5,
      height: width / 5,
      borderRadius: width / 10,
      marginBottom: '3%',
    },
    textHeader: {
      color: getColors(theme).secondaryText,
      ...headlines_primary_headline_2,
    },
    textOpaque: {
      opacity: 0.6,
    },
  });
