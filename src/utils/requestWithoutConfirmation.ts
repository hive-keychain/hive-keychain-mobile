import {Account} from 'actions/interfaces';
import {broadcastWithoutConfirmation} from 'components/browser/requestOperations/Broadcast';
import {broacastCustomJSONWithoutConfirmation} from 'components/browser/requestOperations/Custom';
import {decodeWithoutConfirmation} from 'components/browser/requestOperations/Decode';
import {encodeWithoutConfirmation} from 'components/browser/requestOperations/Encode';
import {postWithoutConfirmation} from 'components/browser/requestOperations/Post';
import {signBufferWithoutConfirmation} from 'components/browser/requestOperations/SignBuffer';
import {signTxWithoutConfirmation} from 'components/browser/requestOperations/SignTx';
import {voteWithoutConfirmation} from 'components/browser/requestOperations/Vote';
import {
  KeychainRequest,
  KeychainRequestTypes,
  RequestBroadcast,
  RequestCustomJSON,
  RequestDecode,
  RequestEncode,
  RequestError,
  RequestId,
  RequestPost,
  RequestSignBuffer,
  RequestSignTx,
  RequestSuccess,
  RequestVote,
} from './keychain.types';

export const requestWithoutConfirmation = (
  accounts: Account[],
  request: KeychainRequest,
  sendResponse: (msg: RequestSuccess) => void,
  sendError: (msg: RequestError) => void,
  has?: boolean,
) => {
  console.log({request}); //TODO to remove
  switch (request.type) {
    case KeychainRequestTypes.decode:
      request as RequestDecode & RequestId;
      decodeWithoutConfirmation(
        accounts,
        request,
        sendResponse,
        sendError,
        has,
      );
      break;
    case KeychainRequestTypes.signBuffer:
      request as RequestSignBuffer & RequestId;
      signBufferWithoutConfirmation(
        accounts,
        request,
        sendResponse,
        sendError,
        has,
      );
      break;
    case KeychainRequestTypes.broadcast:
      request as RequestBroadcast & RequestId;
      broadcastWithoutConfirmation(
        accounts,
        request,
        sendResponse,
        sendError,
        has,
      );
      break;
    case KeychainRequestTypes.vote:
      request as RequestVote & RequestId;
      voteWithoutConfirmation(accounts, request, sendResponse, sendError, has);
      break;
    case KeychainRequestTypes.post:
      request as RequestPost & RequestId;
      postWithoutConfirmation(accounts, request, sendResponse, sendError, has);
      break;
    case KeychainRequestTypes.custom:
      request as RequestCustomJSON & RequestId;
      broacastCustomJSONWithoutConfirmation(
        accounts,
        request,
        sendResponse,
        sendError,
        has,
      );
      break;
    case KeychainRequestTypes.encode:
      request as RequestEncode & RequestId;
      encodeWithoutConfirmation(
        accounts,
        request,
        sendResponse,
        sendError,
        has,
      );
      break;
    case KeychainRequestTypes.signTx:
      request as RequestSignTx & RequestId;
      signTxWithoutConfirmation(
        accounts,
        request,
        sendResponse,
        sendError,
        has,
      );
      break;
  }
};
