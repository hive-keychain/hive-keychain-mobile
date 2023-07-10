import {encodeMemo} from 'components/bridge';
import HAS from '..';
import {HAS_SignPayload} from '../payloads.types';
import {getLeastDangerousKey} from './keys';

export const answerSuccessfulBroadcastReq = async (
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
        pok: await encodeMemo(
          getLeastDangerousKey(payload.account).value,
          has.getServerKey(),
          `#${payload.uuid}`,
        ),
      }),
    );
  } else {
    throw new Error('Transaction signing not implemented');
  }
};

export const answerFailedBroadcastReq = async (
  has: HAS,
  payload: HAS_SignPayload,
  error?: string,
) => {
  has.send(
    JSON.stringify({
      cmd: 'sign_nack',
      uuid: payload.uuid,
      pok: await encodeMemo(
        getLeastDangerousKey(payload.account).value,
        has.getServerKey(),
        `#${payload.uuid}`,
      ),
      error: error || 'Request was canceled by the user.',
    }),
  );
};
