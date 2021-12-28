import Hive from 'assets/wallet/icon_hive.svg';
import EllipticButton from 'components/form/EllipticButton';
import Operation from 'components/operations/Operation';
import Separator from 'components/ui/Separator';
import {ModalNavigation} from 'navigators/Root.types';
import React, {useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import HAS from 'utils/hiveAuthenticationService';
import {HAS_AuthPayload} from 'utils/hiveAuthenticationService/payloads.types';
import {translate} from 'utils/localize';

type Props = PropsFromRedux & {
  data: HAS_AuthPayload & {
    has: HAS;
    onForceCloseModal: () => void;
    callback: (
      has: HAS,
      payload: HAS_AuthPayload,
      approve: boolean,
      callback: () => void,
    ) => void;
  };
  navigation: ModalNavigation;
};

const HASAuthRequest = ({data, accounts, navigation}: Props) => {
  const [success, setSuccess] = useState(false);
  const onConfirm = () => {
    data.callback(data.has, data, true, () => {
      setSuccess(true);
    });
  };
  return (
    <Operation
      logo={<Hive />}
      title={translate('wallet.has.auth.title')}
      onClose={data.onForceCloseModal}>
      <>
        <Separator height={30} />
        <Text style={styles.uuid}>{translate('wallet.has.uuid', data)}</Text>
        <Separator />
        <Text>
          {success
            ? translate('wallet.has.auth.success', {
                account: data.account,
                name: data.decryptedData?.app.name,
              })
            : translate('wallet.has.auth.text', {
                account: data.account,
                name: data.decryptedData.app.name,
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
          title={
            success
              ? translate('common.ok')
              : translate('wallet.has.auth.button')
          }
          disabled={!accounts.find((e) => e.name === data.account)}
          onPress={
            success
              ? () => {
                  navigation.goBack();
                }
              : onConfirm
          }
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
