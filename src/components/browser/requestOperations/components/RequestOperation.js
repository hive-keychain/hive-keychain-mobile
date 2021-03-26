import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import RequestMessage from './RequestMessage';
import RequestResultMessage from './RequestResultMessage';
import OperationButton from 'components/form/ActiveOperationButton';
import {translate} from 'utils/localize';
import {beautifyErrorMessage} from 'utils/keychain';

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
}) => {
  const {request_id, ...data} = request;
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);

  const renderRequestSummary = () => (
    <View>
      <RequestMessage message={message} />
      {children}
      <OperationButton
        style={styles.button}
        title={translate('request.confirm')}
        isLoading={loading}
        method={method.toLowerCase()}
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
              msg = errorMessage;
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
    </View>
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
