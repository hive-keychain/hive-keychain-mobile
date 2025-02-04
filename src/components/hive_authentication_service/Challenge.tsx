import EllipticButton from 'components/form/EllipticButton';
import Operation from 'components/operations/Operation';
import Separator from 'components/ui/Separator';
import {KeychainKeyTypesLC} from 'hive-keychain-commons';
import {ModalNavigation} from 'navigators/Root.types';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {connect, ConnectedProps} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {body_primary_body_3, FontPoppinsName} from 'src/styles/typography';
import {RootState} from 'store';
import HAS from 'utils/hiveAuthenticationService';
import {HAS_Session} from 'utils/hiveAuthenticationService/has.types';
import {HAS_ChallengePayload} from 'utils/hiveAuthenticationService/payloads.types';
import {translate} from 'utils/localize';
const LOGO_LIGHT = require('assets/has/logo-light.png');

type Props = PropsFromRedux & {
  data: HAS_ChallengePayload & {
    onForceCloseModal: () => void;
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
  const {theme} = useThemeContext();
  const styles = getStyles(theme);
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
    <Operation
      logo={<FastImage source={LOGO_LIGHT} style={{width: 30, height: 30}} />}
      title={translate('request.title.decode')}
      additionalHeaderTitleStyle={[styles.text, styles.title]}
      onClose={data.onForceCloseModal}>
      <View style={styles.paddingHorizontal}>
        <Separator height={30} />
        <Text style={[styles.text, styles.uuid]}>
          {translate('wallet.has.uuid', data)}
        </Text>
        <Separator />
        <Text style={styles.text}>{showText()}</Text>
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
      </View>
    </Operation>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {backgroundColor: '#68A0B4'},
    error: {color: '#A3112A'},
    uuid: {fontWeight: 'bold'},
    text: {
      ...body_primary_body_3,
      color: getColors(theme).secondaryText,
      fontSize: 14,
    },
    paddingHorizontal: {
      paddingHorizontal: 15,
    },
    title: {
      fontFamily: FontPoppinsName.SEMI_BOLD,
      fontSize: 16,
    },
  });

const connector = connect((state: RootState) => {
  return {
    accounts: state.accounts,
  };
});

type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(HASChallengeRequest);
