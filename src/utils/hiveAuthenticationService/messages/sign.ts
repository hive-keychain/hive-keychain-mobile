import {CommentOperation, VoteOperation} from '@hiveio/dhive';
import assert from 'assert';
import Crypto from 'crypto-js';
import {store} from 'store';
import {
  KeychainKeyTypes,
  KeychainRequestTypes,
  RequestBroadcast,
  RequestError,
  RequestPost,
  RequestSuccess,
  RequestVote,
} from 'utils/keychain.types';
import {ModalComponent} from 'utils/modal.enum';
import {goBack, navigate} from 'utils/navigation';
import HAS from '..';
import {
  answerFailedBroadcastReq,
  answerSuccessfulBroadcastReq,
} from '../helpers/sign';
import {
  HAS_BroadcastModalPayload,
  HAS_SignDecrypted,
  HAS_SignPayload,
} from '../payloads.types';

export const processSigningRequest = async (
  has: HAS,
  payload: HAS_SignPayload,
) => {
  try {
    HAS.checkPayload(payload);
    const session = HAS.findSessionByToken(payload.token);
    assert(session, 'This account has not been connected through HAS.');
    const auth =
      session.token.token === payload.token &&
      session.token.expiration > Date.now()
        ? session.token
        : undefined;

    assert(auth, 'Token invalid or expired');
    // Decrypt the ops to sign with the encryption key associated to the token.
    const opsData: HAS_SignDecrypted = JSON.parse(
      Crypto.AES.decrypt(payload.data, session.auth_key).toString(
        Crypto.enc.Utf8,
      ),
    );
    const {ops, key_type} = opsData;
    payload.decryptedData = opsData;
    let request;
    if (ops.length === 1) {
      let op = ops[0];
      switch (op[0]) {
        case 'vote':
          const voteOperation = (op as VoteOperation)[1];
          request = {
            domain: auth.app,
            type: KeychainRequestTypes.vote,
            username: payload.account,
            permlink: voteOperation.permlink,
            author: voteOperation.author,
            weight: voteOperation.weight,
          } as RequestVote;
          console.log(request);
          break;
        case 'comment':
          const commentOperation = (op as CommentOperation)[1];
          request = {
            domain: auth.app,
            type: KeychainRequestTypes.post,
            username: payload.account,
            permlink: commentOperation.permlink,
            title: commentOperation.title,
            body: commentOperation.body,
            parent_perm: commentOperation.parent_permlink,
            parent_username: commentOperation.parent_author,
            json_metadata: commentOperation.json_metadata,
          } as RequestPost;
          break;
        default:
          request = {
            domain: auth.app,
            type: KeychainRequestTypes.broadcast,
            username: payload.account,
            operations: ops,
            method: KeychainKeyTypes[key_type],
          } as RequestBroadcast;
          break;
      }
    } else {
      request = {
        domain: auth.app,
        type: KeychainRequestTypes.broadcast,
        username: payload.account,
        operations: ops,
        method: KeychainKeyTypes[key_type],
      } as RequestBroadcast;
    }
    const data: HAS_BroadcastModalPayload = {
      request: {...request, has: true},
      accounts: await store.getState().accounts,
      onForceCloseModal: () => {
        console.log('onforceclose');
        goBack();
        answerFailedBroadcastReq(has, payload);
      },
      sendError: (obj: RequestError) => {
        answerFailedBroadcastReq(has, payload, obj.error);
      },
      sendResponse: (obj: RequestSuccess) => {
        answerSuccessfulBroadcastReq(has, payload, obj);
      },
    };

    navigate('ModalScreen', {
      name: ModalComponent.HAS_BROADCAST,
      data,
    });
  } catch (e) {
    console.log(e);
    // has.send(
    //   JSON.stringify({
    //     cmd: 'sign_err',
    //     uuid: payload.uuid,
    //     error: e.message,
    //   }),
    // );
  }
};
