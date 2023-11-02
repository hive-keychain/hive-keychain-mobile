import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';

interface Props {
  theme: Theme;
}
//TODO add edition following extension.
const EditMyWitness = ({theme}: Props & PropsFromRedux) => {
  const styles = getStyles(theme);
  return (
    <View>
      <Text>EditMyWitness</Text>
    </View>
  );
};

const getStyles = (theme: Theme) => StyleSheet.create({});

const connector = connect(undefined, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(EditMyWitness);
