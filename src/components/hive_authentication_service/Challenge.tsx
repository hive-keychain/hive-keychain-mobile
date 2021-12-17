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
import {HAS_Session} from 'utils/hiveAuthenticationService/has.types';
import {HAS_ChallengePayload} from 'utils/hiveAuthenticationService/payloads.types';
import {KeychainKeyTypesLC} from 'utils/keychain.types';
import {translate} from 'utils/localize';

type Props = PropsFromRedux & {
  data: HAS_ChallengePayload & {
    has: HAS;
    callback: (
      has: HAS,
      payload: HAS_ChallengePayload,
      approve: boolean,
      session: HAS_Session,
      callback: (success: boolean) => void,
    ) => void;
    domain: string;
    session: HAS_Session;
  };
  navigation: ModalNavigation;
};

enum ChallengeState {
  ASK,
  SUCCESS,
  ERROR,
}
const HASChallengeRequest = ({data, accounts, navigation}: Props) => {
  const [state, setState] = useState(ChallengeState.ASK);
  const onConfirm = () => {
    data.callback(data.has, data, true, data.session, (success: boolean) => {
      setState(success ? ChallengeState.SUCCESS : ChallengeState.ERROR);
      setTimeout(() => {
        navigation.goBack();
      }, 3000);
    });
  };
  const showText = () => {
    switch (state) {
      case ChallengeState.ASK:
        return translate('wallet.has.challenge.ask', {
          account: data.account,
          key: data.decrypted_data.key_type,
          name: data.domain,
        });
      case ChallengeState.SUCCESS:
        return translate('wallet.has.challenge.success', {
          account: data.account,
          key: data.decrypted_data.key_type,
          name: data.domain,
        });
    }
  };

  return (
    <Operation logo={<Hive />} title={translate('request.title.decode')}>
      <>
        <Separator height={30} />
        <Text style={styles.uuid}>{translate('wallet.has.uuid', data)}</Text>
        <Separator />
        <Text>{showText()}</Text>
        {accounts.find((e) => e.name === data.account) ? null : (
          <>
            <Separator />
            <Text style={styles.error}>
              {translate('wallet.has.challenge.no_key', {
                account: data.account,
                key: data.decrypted_data.key_type,
                name: data.domain,
              })}
            </Text>
          </>
        )}
        <Separator height={50} />
        <EllipticButton
          title={
            state !== ChallengeState.ASK
              ? translate('common.ok')
              : translate('wallet.has.challenge.button')
          }
          disabled={
            !accounts.find((e) => e.name === data.account).keys[
              data.decrypted_data.key_type as KeychainKeyTypesLC
            ]
          }
          onPress={
            state !== ChallengeState.ASK
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
export default connector(HASChallengeRequest);
