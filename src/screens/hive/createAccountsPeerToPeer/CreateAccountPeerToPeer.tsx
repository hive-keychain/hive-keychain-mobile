import Background from 'components/ui/Background';
import React from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';

const CreateAccountPeerToPeer = ({user}: PropsFromRedux) => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({width, height}, theme);

  return (
    <Background theme={theme} containerStyle={styles.container}>
      <View>
        <Text>//TODO now!!!</Text>
      </View>
    </Background>
  );
};

const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

const connector = connect((state: RootState) => {
  return {
    user: state.activeAccount,
  };
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(CreateAccountPeerToPeer);
