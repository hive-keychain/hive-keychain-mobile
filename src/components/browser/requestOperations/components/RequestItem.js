import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

export default ({title, content}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {paddingVertical: 5},
  title: {fontSize: 16, fontWeight: 'bold'},
  content: {fontSize: 16},
});
