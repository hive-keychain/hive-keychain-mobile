import React from 'react';
import {View, StyleSheet} from 'react-native';
import RequestItem from './components/RequestItem';
import RequestMessage from './components/RequestMessage';
import {translate} from 'utils/localize';

export default ({request}) => {
  const {domain, method, username} = request;
  return (
    <View>
      <RequestMessage
        message={translate('request.message.decode', {
          domain,
          method,
          username,
        })}
      />
      <RequestItem
        title={translate('request.item.username')}
        content={`@${username}`}
      />
      <RequestItem title={translate('request.item.method')} content={method} />
    </View>
  );
};

const styles = StyleSheet.create({});
