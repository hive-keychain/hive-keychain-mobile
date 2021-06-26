import {KeyTypes} from 'actions/interfaces';
import {decodeMemo} from 'components/bridge';
import React from 'react';
import {urlTransformer} from 'utils/browser';
import {RequestDecode, RequestId} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import RequestItem from './components/RequestItem';
import RequestOperation from './components/RequestOperation';
import {RequestComponentCommonProps} from './requestOperations.types';

type Props = {
  request: RequestDecode & RequestId;
} & RequestComponentCommonProps;

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}: Props) => {
  const {request_id, ...data} = request;
  const {domain, method, username, message} = data;

  return (
    <RequestOperation
      message={translate('request.message.decode', {
        domain: urlTransformer(domain).hostname,
        method,
        username,
      })}
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.decode')}
      errorMessage={translate('request.error.decode')}
      method={method.toLowerCase() as KeyTypes}
      request={request}
      closeGracefully={closeGracefully}
      performOperation={async () => {
        const account = accounts.find((e) => e.name === request.username);
        const key = account.keys[method.toLowerCase() as KeyTypes];
        const result = await decodeMemo(key, message);
        if (result === message) {
          throw 'error';
        }
        return result;
      }}>
      <RequestItem
        title={translate('request.item.username')}
        content={`@${username}`}
      />
      <RequestItem title={translate('request.item.method')} content={method} />
    </RequestOperation>
  );
};
