import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {translate} from 'utils/localize';

interface LoadMoreProps {
  onTryLoadMore: () => void;
}

const LoadMoreButton = (props: LoadMoreProps) => {
  return (
    <View style={styles.loadMoreContainer}>
      <Text style={styles.loadMoreText}>
        {translate('operations.history.load_more')}
      </Text>
      <TouchableOpacity onPress={props.onTryLoadMore}>
        <View style={[styles.circularContainer, {width: 20, height: 20}]}>
          <Text>+</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  loadMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  loadMoreText: {
    fontStyle: 'italic',
  },
  circularContainer: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    margin: 8,
    opacity: 8,
    height: 30,
    width: 30,
  },
});

export default LoadMoreButton;
