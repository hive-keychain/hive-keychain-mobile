import Hive from 'assets/wallet/icon_hive.svg';
import EllipticButton from 'components/form/EllipticButton';
import Operation from 'components/operations/Operation';
import Separator from 'components/ui/Separator';
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {HAS_AuthPayload} from 'utils/HAS';
import {translate} from 'utils/localize';

type Props = PropsFromRedux & {
  data: HAS_AuthPayload & {
    callback: (payload: HAS_AuthPayload, approve: boolean) => void;
  };
};

const HASAuthRequest = ({data, accounts}: Props) => {
  console.log(data);
  const onConfirm = () => {
    data.callback(data, true);
  };
  return (
    <Operation logo={<Hive />} title={translate('wallet.has.auth.title')}>
      <>
        <Separator height={30} />
        <Text style={styles.uuid}>{translate('wallet.has.uuid', data)}</Text>
        <Separator />
        <Text>
          {translate('wallet.has.auth.text', {
            account: data.account,
            name: data.metadata.name,
          })}
        </Text>
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
          title={translate('wallet.has.auth.button')}
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
export default connector(HASAuthRequest);
