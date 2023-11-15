import {loadAccount} from 'actions/index';
import React, {useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {RootState} from 'store';

export interface RCDelegationOperationProps {
  //TODO fill bellow
}

const RCDelegation = ({
  loadAccount,
  properties,
  user,
}: RCDelegationOperationProps & PropsFromRedux) => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);
  //TODO fill bellow...
  return (
    <View>
      <Text>RCDelegation</Text>
    </View>
  );
};

const getStyles = (theme: Theme) => StyleSheet.create({});

const connector = connect(
  (state: RootState) => {
    return {
      properties: state.properties,
      user: state.activeAccount,
    };
  },
  {loadAccount},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(RCDelegation);
