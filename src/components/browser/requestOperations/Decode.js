import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import RequestItem from './components/RequestItem';
import RequestMessage from './components/RequestMessage';
import OperationButton from 'components/form/ActiveOperationButton';
import {translate} from 'utils/localize';
import {urlTransformer} from 'utils/browser';
import {decodeMemo} from 'components/bridge';

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}) => {
  const {request_id, ...data} = request;
  const {domain, method, username, message} = data;
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);
  const renderRequestSummary = () => (
    <View>
      <RequestMessage
        message={translate('request.message.decode', {
          domain: urlTransformer(domain).hostname,
          method,
          username,
        })}
      />
      <RequestItem
        title={translate('request.item.username')}
        content={`@${username}`}
      />
      <RequestItem title={translate('request.item.method')} content={method} />
      <OperationButton
        style={styles.button}
        title={translate('request.confirm')}
        isLoading={loading}
        method={method.toLowerCase()}
        onPress={async () => {
          setLoading(true);
          const account = accounts.find((e) => e.name === request.username);
          const key = account.keys[method.toLowerCase()];
          let msg;
          try {
            const result = await decodeMemo(key, message);
            if (result === message) {
              throw 'error';
            }
            msg = translate('request.success.decode');

            sendResponse({
              data,
              request_id,
              result,
              message: msg,
            });
          } catch (e) {
            msg = translate('request.error.decode');
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
      <View>
        <RequestMessage message={resultMessage} />
        <OperationButton
          style={styles.button}
          title="OK"
          method={method.toLowerCase()}
          onPress={async () => {
            closeGracefully();
          }}
        />
      </View>
    );
  } else {
    return renderRequestSummary();
  }
};

const styles = StyleSheet.create({button: {marginTop: 40}});
