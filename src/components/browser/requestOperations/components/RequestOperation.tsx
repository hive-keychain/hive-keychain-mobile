import {KeyTypes} from 'actions/interfaces';
import {addPreference} from 'actions/preferences';
import {RadioButton} from 'components/form/CustomRadioGroup';
import OperationButton from 'components/form/EllipticButton';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {connect, ConnectedProps} from 'react-redux';
import {urlTransformer} from 'utils/browser';
import {beautifyErrorMessage} from 'utils/keychain';
import {
  HiveErrorMessage,
  KeychainRequest,
  KeychainRequestTypes,
  RequestError,
  RequestSuccess,
} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestMessage from './RequestMessage';
import RequestResultMessage from './RequestResultMessage';

type Props = {
  closeGracefully: () => void;
  sendResponse: (msg: RequestSuccess) => void;
  sendError: (msg: RequestError) => void;
  message?: string;
  children: JSX.Element[];
  method?: KeyTypes;
  request: KeychainRequest;
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
}: Props) => {
  const {request_id, ...data} = request;
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);
  const [keep, setKeep] = useState(false);
  let {domain, type, username} = data;
  domain = urlTransformer(domain).hostname;
  const renderRequestSummary = () => (
    <ScrollView>
      <RequestMessage message={message} />
      {children}
      {method !== KeyTypes.active &&
      type !== KeychainRequestTypes.addAccount ? (
        <View style={styles.keep}>
          <RadioButton
            selected={keep}
            data={translate('request.keep', {domain, username, type})}
            style={styles.radio}
            onSelect={() => {
              setKeep(!keep);
            }}
          />
        </View>
      ) : (
        <></>
      )}
      <OperationButton
        style={styles.button}
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
            if (keep) addPreference(username, domain, type);
            sendResponse(obj);
          } catch (e) {
            if (!beautifyError) {
              if (typeof errorMessage === 'function') {
                msg = errorMessage(e, data);
              } else {
                msg = errorMessage;
              }
            } else {
              msg = beautifyErrorMessage(e);
            }
            sendError({data, request_id, error: {}, message: msg});
          } finally {
            setResultMessage(msg);
          }
          setLoading(false);
        }}
      />
    </ScrollView>
  );

  if (resultMessage) {
    return (
      <RequestResultMessage
        closeGracefully={closeGracefully}
        resultMessage={resultMessage}
      />
    );
  } else {
    return renderRequestSummary();
  }
};

const styles = StyleSheet.create({
  button: {marginTop: 40},
  keep: {marginTop: 40, flexDirection: 'row'},
  radio: {marginLeft: 0},
});
const connector = connect(null, {addPreference});
type TypesFromRedux = ConnectedProps<typeof connector>;
export default connector(RequestOperation);

// Without confirmation :

// signTx

export const processOperationWithoutConfirmation = async (
  performOperation: () => void,
  request: KeychainRequest,
  sendResponse: (msg: RequestSuccess) => void,
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
    //console.log(e);
    let msg;
    if (!beautifyError) {
      // if (typeof errorMessage === 'function') {
      //   msg = errorMessage(e, data);
      // } else {
      msg = errorMessage;
      //}
    } else {
      msg = beautifyErrorMessage(e);
    }
    //console.log(msg);
    sendError({data, request_id, error: {}, message: msg});
  }
};
