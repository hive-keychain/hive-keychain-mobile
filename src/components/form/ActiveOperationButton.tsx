import {KeyTypes} from 'actions/interfaces';
import Icon from 'assets/addAccount/icon_info.svg';
import React from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {translate} from 'utils/localize';
import EllipticButton from './EllipticButton';

type Props = {
  method?: KeyTypes;
  title: string;
  style: StyleProp<ViewStyle>;
  onPress: () => void;
  isLoading: boolean;
} & PropsFromRedux;
const ActiveOperationButton = ({method, ...props}: Props) => {
  return (
    <>
      {!props.user.keys[method || KeyTypes.active] && (
        <View style={styles.container}>
          <Icon fill="#A3112A" height={20} />
          <Text style={styles.text}>{translate('wallet.add_active')}</Text>
        </View>
      )}
      <EllipticButton
        {...props}
        disabled={!props.user.keys[method || 'active']}
      />
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#A3112A',
    textAlign: 'center',
    fontSize: 13,
  },
  container: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
});

const connector = connect((state: RootState) => {
  return {user: state.activeAccount};
});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(ActiveOperationButton);
