import CustomPicker from 'components/form/CustomPicker';
import EllipticButton from 'components/form/EllipticButton';
import Operation from 'components/operations/Operation';
import Separator from 'components/ui/Separator';
import {useHasExpiration} from 'hooks/useHasExpiration';
import {ModalNavigation} from 'navigators/Root.types';
import React, {useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import HAS from 'utils/hiveAuthenticationService';
import {HAS_AuthPayload} from 'utils/hiveAuthenticationService/payloads.types';
import {translate} from 'utils/localize';
const LOGO_LIGHT = require('assets/has/logo-light.png');

type Props = PropsFromRedux & {
  data: HAS_AuthPayload & {
    has: HAS;
    onForceCloseModal: () => void;
    onExpire: () => void;
    callback: (
      has: HAS,
      payload: HAS_AuthPayload,
      approve: boolean,
      sessionTime: SessionTime,
      callback: () => void,
    ) => void;
  };
  navigation: ModalNavigation;
};

export enum SessionTime {
  HOUR = '1 Hour',
  DAY = '1 Day',
  WEEK = '1 Week',
  MONTH = '1 Month',
}

const HASAuthRequest = ({data, accounts, navigation}: Props) => {
  const [success, setSuccess] = useState(false);
  const [sessionTime, setSessionTime] = useState(SessionTime.DAY);
  const onConfirm = () => {
    data.callback(data.has, data, true, sessionTime, () => {
      setSuccess(true);
      setTimeout(() => {
        navigation.goBack();
      }, 3000);
    });
  };

  useHasExpiration(data.expire, data.onExpire);

  return (
    <Operation
      logo={
        <FastImage
          source={
            data.decryptedData?.app.icon
              ? {uri: data.decryptedData.app.icon}
              : LOGO_LIGHT
          }
          style={{width: 30, height: 30}}
        />
      }
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
        <Separator height={30} />

        {!success ? (
          <>
            <Text style={{fontStyle: 'italic'}}>
              {translate('wallet.has.session.prompt')}
            </Text>
            <CustomPicker
              selectedValue={sessionTime}
              onSelected={setSessionTime}
              prompt={translate('wallet.has.session.prompt')}
              list={[
                SessionTime.HOUR,
                SessionTime.DAY,
                SessionTime.WEEK,
                SessionTime.MONTH,
              ]}
            />
          </>
        ) : (
          <></>
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
