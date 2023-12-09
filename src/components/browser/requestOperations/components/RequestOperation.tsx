import {KeyTypes} from 'actions/interfaces';
import {addPreference} from 'actions/preferences';
import {RadioButton} from 'components/form/CustomRadioGroup';
import OperationButton from 'components/form/EllipticButton';
import React, {useContext, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import SimpleToast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {title_primary_body_2} from 'src/styles/typography';
import {urlTransformer} from 'utils/browser';
import {beautifyErrorMessage} from 'utils/keychain';
import {
  HiveErrorMessage,
  KeychainRequest,
  KeychainRequestTypes,
  RequestError,
  RequestId,
  RequestSuccess,
} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import RequestMessage from './RequestMessage';

type Props = {
  has?: boolean;
  closeGracefully: () => void;
  sendResponse: (msg: RequestSuccess, keep?: boolean) => void;
  sendError: (msg: RequestError) => void;
  message?: string;
  children: JSX.Element[];
  method?: KeyTypes;
  request: KeychainRequest & RequestId;
  successMessage: string;
  errorMessage?:
    | string
    | ((
        msg: HiveErrorMessage,
        data: {currency?: string; username?: string; to?: string},
      ) => string);
  performOperation: () => void;
  additionalData?: object;
  beautifyError?: boolean;
  selectedUsername?: string;
} & TypesFromRedux;

const RequestOperation = ({
  closeGracefully,
  sendResponse,
  sendError,
  message,
  children,
  method,
  request,
  successMessage,
  errorMessage,
  performOperation,
  additionalData = {},
  beautifyError,
  addPreference,
  selectedUsername,
  has,
}: Props) => {
  const {theme} = useContext(ThemeContext);
  const {request_id, ...data} = request;
  const [loading, setLoading] = useState(false);
  const [keep, setKeep] = useState(false);
  let {domain, type, username} = data;
  domain = has ? domain : urlTransformer(domain).hostname;
  const styles = getStyles(theme);

  const renderRequestSummary = () => (
    <ScrollView style={styles.container}>
      <RequestMessage message={message} additionalTextStyle={styles.text} />
      {children}
      {method !== KeyTypes.active &&
      type !== KeychainRequestTypes.addAccount ? (
        <View style={styles.keep}>
          <RadioButton
            selected={keep}
            label={translate(`request.keep${has ? '_has' : ''}`, {
              domain,
              username: username || selectedUsername,
              type,
            })}
            style={styles.radio}
            onSelect={() => {
              setKeep(!keep);
            }}
            additionalRadioLabelStyle={[styles.text, styles.smallerText]}
            additionalRadioStyleActive={styles.bgColor}
            additionalRadioStyleInactive={{borderColor: getColors(theme).icon}}
          />
        </View>
      ) : (
        <></>
      )}
      <OperationButton
        style={[getButtonStyle(theme).warningStyleButton, styles.button]}
        additionalTextStyle={[styles.text, styles.whiteText]}
        title={translate('request.confirm')}
        isLoading={loading}
        onPress={async () => {
          setLoading(true);
          let msg: string;
          try {
            const result = await performOperation();
            msg = successMessage;
            const obj = {
              data,
              request_id,
              result,
              message: msg,
              ...additionalData,
            };
            if (selectedUsername) obj.data.username = selectedUsername;
            if (keep && !has) {
              addPreference(username, domain, type);
            }
            sendResponse(obj, keep);
          } catch (e) {
            if (!beautifyError) {
              if (typeof errorMessage === 'function') {
                msg = errorMessage(e as any, data);
              } else {
                msg = errorMessage;
              }
            } else {
              msg = beautifyErrorMessage(e as any);
            }
            sendError({data, request_id, error: {}, message: msg});
          } finally {
            goBack();
            SimpleToast.show(msg, SimpleToast.LONG);
          }
          setLoading(false);
        }}
      />
    </ScrollView>
  );

  return renderRequestSummary();
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {marginTop: 40, marginBottom: 20},
    keep: {marginTop: 40, flexDirection: 'row'},
    radio: {marginLeft: 0},
    text: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
    },
    container: {
      paddingHorizontal: 15,
    },
    smallerText: {
      fontSize: 12,
    },
    bgColor: {
      backgroundColor: getColors(theme).icon,
    },
    whiteText: {color: '#FFF'},
  });
const connector = connect(null, {addPreference});
type TypesFromRedux = ConnectedProps<typeof connector>;
export default connector(RequestOperation);

// Without confirmation :

// signTx

export const processOperationWithoutConfirmation = async (
  performOperation: () => void,
  request: KeychainRequest & RequestId,
  sendResponse: (msg: RequestSuccess, keep?: boolean) => void,
  sendError: (msg: RequestError) => void,
  beautifyError: boolean,
  successMessage?: string,
  errorMessage?: string,
  additionalData?: any,
) => {
  const {request_id, ...data} = request;
  try {
    const result = await performOperation();
    let msg = successMessage;
    const obj = {
      data,
      request_id,
      result,
      message: msg,
      ...additionalData,
    };
    sendResponse(obj);
  } catch (e) {
    let msg;
    if (!beautifyError) {
      // if (typeof errorMessage === 'function') {
      //   msg = errorMessage(e, data);
      // } else {
      msg = errorMessage;
      //}
    } else {
      msg = beautifyErrorMessage(e as any);
    }
    sendError({data, request_id, error: {}, message: msg});
  }
};
