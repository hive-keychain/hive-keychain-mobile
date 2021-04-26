import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

export default ({title, content}) => {
  return (
    <View style={styles.container}>
      {getTitle({title})}
      <Text style={styles.content}>{content}</Text>
    </View>
  );
};

export const getTitle = ({title}) => {
  return <Text style={styles.title}>{title}</Text>;
};

const styles = StyleSheet.create({
  container: {paddingVertical: 5},
  title: {fontSize: 16, fontWeight: 'bold'},
  content: {fontSize: 16},
});
