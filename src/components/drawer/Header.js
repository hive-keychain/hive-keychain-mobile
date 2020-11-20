import React from 'react';
import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import UserProfilePicture from 'components/ui/UserProfilePicture';

export default ({username}) => {
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({width, height});
  return (
    <View style={styles.container}>
      <UserProfilePicture username={username} style={styles.image} />
      <Text style={styles.username}>@{username}</Text>
    </View>
  );
};

const getDimensionedStyles = ({width, height}) =>
  StyleSheet.create({
    container: {
      marginVertical: 40,
      paddingBottom: 40,
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
      marginBottom: 10,
    },
  });
