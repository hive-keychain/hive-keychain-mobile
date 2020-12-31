import React from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {Button} from 'react-native-elements';
import Loader from 'components/ui/Loader';

export default (props) => {
  const {style, isLoading} = props;
  const styles = getDimensionedStyles(useWindowDimensions());
  return (
    <>
      <Loader animating={isLoading} />
      {!isLoading && (
        <Button
          {...props}
          containerViewStyle={styles.container}
          buttonStyle={{...styles.button, ...style}}
          rounded
          underlayColor={'rgba(0,0,0,0)'}
          activeOpacity={0}
        />
      )}
    </>
  );
};

const getDimensionedStyles = ({width, height}) =>
  StyleSheet.create({
    button: {
      marginHorizontal: width * 0.1,
      color: 'black',
      backgroundColor: 'black',
      height: 50,
      borderRadius: 25,
    },
  });
