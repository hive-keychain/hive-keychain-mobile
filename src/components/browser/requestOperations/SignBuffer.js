import React from 'react';
import RequestItem from './components/RequestItem';
import {translate} from 'utils/localize';
import {urlTransformer} from 'utils/browser';
import {signBuffer} from 'components/bridge';
import RequestOperation from './RequestOperation';
import CustomPicker from 'components/form/CustomPicker';
import usePotentiallyAnonymousRequest from 'hooks/usePotentiallyAnonymousRequest';

export default ({
  request,
  accounts,
  closeGracefully,
  sendResponse,
  sendError,
}) => {
  const {request_id, ...data} = request;
  const {domain, method, username, message} = data;
  const [
    account,
    setAccount,
    getAccountKey,
    getAccountPublicKey,
  ] = usePotentiallyAnonymousRequest(request, accounts);

  return (
    <RequestOperation
      message={
        username
          ? translate('request.message.signBuffer', {
              domain: urlTransformer(domain).hostname,
              method,
              username,
            })
          : translate('request.message.signBufferNoUsername', {
              domain: urlTransformer(domain).hostname,
              method,
            })
      }
      sendResponse={sendResponse}
      sendError={sendError}
      successMessage={translate('request.success.signBuffer')}
      errorMessage={translate('request.error.signBuffer')}
      method={method}
      request={request}
      closeGracefully={closeGracefully}
      additionalData={{
        publicKey: getAccountPublicKey(),
      }}
      performOperation={async () => {
        const result = await signBuffer(getAccountKey(), message);
        console.log(result);

        return result;
      }}>
      {username ? (
        <RequestItem
          title={translate('request.item.username')}
          content={`@${username}`}
        />
      ) : (
        <CustomPicker
          list={accounts.map((e) => e.name)}
          selectedValue={account}
          onSelectedValue={(acc) => {
            setAccount(accounts.find((a) => a.name === acc));
          }}
        />
      )}
      <RequestItem title={translate('request.item.method')} content={method} />
      <RequestItem
        title={translate('request.item.message')}
        content={message}
      />
    </RequestOperation>
  );
};
