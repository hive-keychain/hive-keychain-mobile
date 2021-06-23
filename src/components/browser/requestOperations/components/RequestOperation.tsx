import OperationButton from 'components/form/EllipticButton';
import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {beautifyErrorMessage} from 'utils/keychain';
import {translate} from 'utils/localize';
import RequestMessage from './RequestMessage';
import RequestResultMessage from './RequestResultMessage';

type Props = {
  closeGracefully: () => void;
  sendResponse: (msg: object) => void;
  sendError: (msg: object) => void;
  message: string;
  children: JSX.Element[];
  method: any; // TODO : change
  request: any; // TODO : change
  successMessage: string;
  errorMessage: (msg: object, data: object) => void;
  performOperation: () => void;
  additionalData?: object;
  beautifyError: (string: string) => void;
};
export default ({
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
}: Props) => {
  const {request_id, ...data} = request;
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);

  const renderRequestSummary = () => (
    <ScrollView>
      <RequestMessage message={message} />
      {children}
      <OperationButton
        style={styles.button}
        title={translate('request.confirm')}
        isLoading={loading}
        onPress={async () => {
          setLoading(true);
          let msg;
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
            sendResponse(obj);
          } catch (e) {
            console.log(e);
            if (!beautifyError) {
              if (typeof errorMessage === 'function') {
                msg = errorMessage(e, data);
              } else {
                msg = errorMessage;
              }
            } else {
              msg = beautifyErrorMessage(e);
            }
            console.log(msg);
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
});
