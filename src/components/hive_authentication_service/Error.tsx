import Hive from 'assets/wallet/icon_hive.svg';
import EllipticButton from 'components/form/EllipticButton';
import Operation from 'components/operations/Operation';
import {ModalNavigation} from 'navigators/Root.types';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {translate} from 'utils/localize';

type Props = PropsFromRedux & {
  text: string;
  navigation: ModalNavigation;
};

const HASError = ({text, navigation}: Props) => {
  const onConfirm = () => {
    navigation.goBack();
  };
  setTimeout(() => {
    navigation.goBack();
  }, 10000);
  return (
    <Operation logo={<Hive />} title={translate('common.error_title')}>
      <View style={styles.view}>
        <Text>{text}</Text>
        <EllipticButton
          title={translate('common.ok')}
          onPress={onConfirm}
          style={styles.button}
        />
      </View>
    </Operation>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    marginVertical: 30,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  button: {backgroundColor: '#68A0B4'},
  error: {color: '#A3112A'},
  uuid: {fontWeight: 'bold'},
});

const connector = connect((state: RootState) => {
  return {
    accounts: state.accounts,
  };
});

type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(HASError);
