import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type Props = {
  title: string;
  content: string;
};
export default ({title, content}: Props) => {
  return (
    <View style={styles.container}>
      {getTitle({title})}
      <Text style={styles.content}>{content}</Text>
    </View>
  );
};

export const getTitle = ({title}: {title: string}) => {
  return <Text style={styles.title}>{title}</Text>;
};

const styles = StyleSheet.create({
  container: {paddingVertical: 5},
  title: {fontSize: 16, fontWeight: 'bold'},
  content: {fontSize: 16},
});
