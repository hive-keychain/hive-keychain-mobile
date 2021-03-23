import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import RequestMessage from './components/RequestMessage';
import RequestResultMessage from './components/RequestResultMessage';
import OperationButton from 'components/form/ActiveOperationButton';
import {translate} from 'utils/localize';

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
}) => {
  const {data, request_id} = request;
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

            sendResponse({
              data,
              request_id,
              result,
              message: msg,
            });
          } catch (e) {
            console.log(e);
            msg = errorMessage;
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
