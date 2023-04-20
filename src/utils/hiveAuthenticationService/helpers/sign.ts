import HAS from '..';
import {HAS_SignPayload} from '../payloads.types';

export const answerSuccessfulBroadcastReq = (
  has: HAS,
  payload: HAS_SignPayload,
  result: any,
) => {
  if (payload.decryptedData.broadcast) {
    has.send(
      JSON.stringify({
        cmd: 'sign_ack',
        uuid: payload.uuid,
        broadcast: payload.decryptedData.broadcast,
        data: result.result.tx_id,
      }),
    );
  } else {
    throw new Error('Transaction signing not implemented');
  }
};

export const answerFailedBroadcastReq = (
  has: HAS,
  payload: HAS_SignPayload,
  error?: string,
) => {
  has.send(
    JSON.stringify({
      cmd: 'sign_nack',
      uuid: payload.uuid,
      error: error || 'Request was canceled by the user.',
    }),
  );
};
