import DropdownModal, {DropdownModalItem} from 'components/form/DropdownModal';
import EllipticButton from 'components/form/EllipticButton';
import Operation from 'components/operations/Operation';
import Separator from 'components/ui/Separator';
import {useHasExpiration} from 'hooks/useHasExpiration';
import {ModalNavigation} from 'navigators/Root.types';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {FontPoppinsName, body_primary_body_3} from 'src/styles/typography';
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

const SESSION_LIST = [
  SessionTime.HOUR,
  SessionTime.DAY,
  SessionTime.WEEK,
  SessionTime.MONTH,
];

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

  const {theme} = useThemeContext();
  const styles = getStyles(theme);

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
      onClose={data.onForceCloseModal}
      additionalHeaderTitleStyle={[styles.text, styles.title]}>
      <View style={styles.paddingHorizontal}>
        <Separator height={30} />
        <Text style={[styles.text, styles.uuid]}>
          {translate('wallet.has.uuid', data)}
        </Text>
        <Separator />
        <Text style={styles.text}>
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
            <Text style={[styles.text, styles.error]}>
              {translate('wallet.has.connect.no_username', data)}
            </Text>
          </>
        )}
        <Separator height={30} />

        {!success ? (
          <>
            <Text style={[styles.text, styles.italic]}>
              {translate('wallet.has.session.prompt')}
            </Text>
            <DropdownModal
              selected={sessionTime}
              onSelected={(sessionItem) =>
                setSessionTime(sessionItem.value as SessionTime)
              }
              list={SESSION_LIST.map((item) => {
                return {
                  label: item,
                  value: item,
                } as DropdownModalItem;
              })}
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
          style={getButtonStyle(theme).warningStyleButton}
          additionalTextStyle={[styles.text, styles.textButton]}
        />
      </View>
    </Operation>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {backgroundColor: '#68A0B4'},
    error: {color: PRIMARY_RED_COLOR},
    uuid: {fontFamily: FontPoppinsName.SEMI_BOLD},
    text: {
      ...body_primary_body_3,
      color: getColors(theme).secondaryText,
      fontSize: 14,
    },
    italic: {
      fontFamily: FontPoppinsName.ITALIC,
    },
    textButton: {
      color: 'white',
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
export default connector(HASAuthRequest);
