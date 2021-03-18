import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import RequestItem from './components/RequestItem';
import RequestMessage from './components/RequestMessage';
import OperationButton from 'components/form/ActiveOperationButton';
import {translate} from 'utils/localize';
import {urlTransformer} from 'utils/browser';
import {decodeMemo} from '../../bridge';

export default ({request, accounts, closeGracefully}) => {
  const {domain, method, username, message} = request;
  const [loading, setLoading] = useState(false);
  return (
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
          const decoded = await decodeMemo(key, message);
          closeGracefully();
          setLoading(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({button: {marginTop: 40}});
