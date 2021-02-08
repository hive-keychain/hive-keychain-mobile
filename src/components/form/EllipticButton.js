import React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {Button} from 'react-native-elements';
import Loader from 'components/ui/Loader';

export default ({style, isLoading, ...props}) => {
  const styles = getDimensionedStyles(useWindowDimensions());
  return (
    <>
      {!isLoading ? (
        <Button
          {...props}
          containerViewStyle={styles.container}
          buttonStyle={{...styles.button, ...style}}
          rounded
          underlayColor={'rgba(0,0,0,0)'}
          activeOpacity={0}
        />
      ) : (
        <View style={[style, styles.loader]}>
          <Loader animating={isLoading} />
        </View>
      )}
    </>
  );
};

const getDimensionedStyles = ({width, height}) => {
  return StyleSheet.create({
    button: {
      marginHorizontal: width * 0.1,
      color: 'black',
      backgroundColor: 'black',
      height: 50,
      borderRadius: 25,
    },
    loader: {
      backgroundColor: 'transparent',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
  });
};
