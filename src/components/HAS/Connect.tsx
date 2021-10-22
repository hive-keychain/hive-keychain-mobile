import Hive from 'assets/wallet/icon_hive.svg';
import EllipticButton from 'components/form/EllipticButton';
import Operation from 'components/operations/Operation';
import Separator from 'components/ui/Separator';
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {getHAS, HAS_RequestPayload} from 'utils/HAS';
import {translate} from 'utils/localize';

type Props = PropsFromRedux & {data: HAS_RequestPayload};

const HASConnectionRequest = ({data, accounts}: Props) => {
  const onConfirm = () => {
    getHAS().connect(data);
  };
  return (
    <Operation logo={<Hive />} title={translate('wallet.has.connect.title')}>
      <>
        <Separator height={30} />
        <Text style={styles.uuid}>
          {translate('wallet.has.connect.uuid', data)}
        </Text>
        <Separator />
        <Text>{translate('wallet.has.connect.text', data)}</Text>
        {accounts.find((e) => e.name === data.account) ? null : (
          <>
            <Separator />
            <Text style={styles.error}>
              {translate('wallet.has.connect.no_username', data)}
            </Text>
          </>
        )}
        <Separator height={50} />
        <EllipticButton
          title={translate('wallet.has.connect.confirm')}
          disabled={!accounts.find((e) => e.name === data.account)}
          onPress={onConfirm}
          style={styles.button}
        />
      </>
    </Operation>
  );
};

const styles = StyleSheet.create({
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
export default connector(HASConnectionRequest);
