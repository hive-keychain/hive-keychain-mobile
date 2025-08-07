import assert from 'assert';
import {RootState, store} from 'store';
import {HAS_AuthPayload, HAS_SignPayload} from './payloads.types';

const checkPayload = (payload: HAS_SignPayload | HAS_AuthPayload) => {
  if (payload.uuid) {
    // validate APP request forwarded by HAS
    assert(
      payload.uuid && typeof payload.uuid == 'string',
      `invalid payload (uuid)`,
    );
    assert(
      payload.expire && typeof payload.expire == 'number',
      `invalid payload (expire)`,
    );
    assert(
      payload.account && typeof payload.account == 'string',
      `invalid payload (account)`,
    );
    assert(
      Date.now() < payload.expire,
      `request expired - now:${Date.now()} > expire:${payload.expire}}`,
    );
  }
};

const findSessionByUUID = (uuid: string) => {
  return (store.getState() as RootState).hive_authentication_service.sessions.find(
    (e) => e.uuid === uuid,
  );
};

const findSessionByToken = (token: string) => {
  return (store.getState() as RootState).hive_authentication_service.sessions.find(
    (e) => {
      if (e.token) return e.token.token === token;
      else return false;
    },
  );
};

export {checkPayload, findSessionByToken, findSessionByUUID};
