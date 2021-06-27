import UserProfilePicture from 'components/ui/UserProfilePicture';
import React from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import {Width} from 'utils/common.types';

export default ({username}: {username: string}) => {
  const {width} = useWindowDimensions();
  const styles = getDimensionedStyles({width});
  return (
    <View style={styles.container}>
      <UserProfilePicture username={username} style={styles.image} />
      <Text style={styles.username}>@{username}</Text>
    </View>
  );
};

const getDimensionedStyles = ({width}: Width) =>
  StyleSheet.create({
    container: {
      marginVertical: '10%',
      paddingBottom: '10%',
      borderBottomColor: 'white',
      borderBottomWidth: 1,
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
  });
