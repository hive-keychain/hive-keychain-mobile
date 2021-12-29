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
  RequestId,
  RequestSuccess,
} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestMessage from './RequestMessage';
import RequestResultMessage from './RequestResultMessage';

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
  const {request_id, ...data} = request;
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);
  const [keep, setKeep] = useState(false);
  let {domain, type, username} = data;
  domain = has ? domain : urlTransformer(domain).hostname;

  const renderRequestSummary = () => (
    <ScrollView>
      <RequestMessage message={message} />
      {children}
      {method !== KeyTypes.active &&
      type !== KeychainRequestTypes.addAccount ? (
        <View style={styles.keep}>
          <RadioButton
            selected={keep}
            data={translate(`request.keep${has ? '_has' : ''}`, {
              domain,
              username: username || selectedUsername,
              type,
            })}
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
    //console.log(e);
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
    //console.log(msg);
    sendError({data, request_id, error: {}, message: msg});
  }
};
