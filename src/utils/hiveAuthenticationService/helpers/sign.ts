import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeychainStorageKeyEnum} from 'src/reference-data/keychainStorageKeyEnum';
import type HAS from '..';
import {HAS_SignPayload} from '../payloads.types';

export const answerSuccessfulBroadcastReq = (
  has: HAS,
  payload: HAS_SignPayload,
  result: any,
) => {
  if (payload.decryptedData.broadcast) {
    addHiveAuthRequestNonce(payload.decryptedData.nonce, payload.expire);
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
  addHiveAuthRequestNonce(payload.decryptedData.nonce, payload.expire);
  has.send(
    JSON.stringify({
      cmd: 'sign_nack',
      uuid: payload.uuid,
      error: error || 'Request was canceled by the user.',
    }),
  );
};

interface NonceEntry {
  nonce: number;
  expiration: number;
}

let nonces: NonceEntry[] = [];

const loadNonces = async () => {
  try {
    const storedNonces = await AsyncStorage.getItem(
      KeychainStorageKeyEnum.HIVEAUTH_NONCE_STORAGE_KEY,
    );
    if (storedNonces) {
      nonces = JSON.parse(storedNonces);
    }
  } catch (error) {
    console.log('Error loading nonces:', error);
  }
};

const saveNonces = async () => {
  try {
    await AsyncStorage.setItem(
      KeychainStorageKeyEnum.HIVEAUTH_NONCE_STORAGE_KEY,
      JSON.stringify(nonces),
    );
  } catch (error) {
    console.log('Error saving nonces:', error);
  }
};

const cleanupExpiredNonces = async () => {
  const now = Date.now();
  nonces = nonces.filter((entry) => entry.expiration > now);
  await saveNonces();
};

const addHiveAuthRequestNonce = async (nonce: number, expiration: number) => {
  await cleanupExpiredNonces();
  nonces.push({
    nonce,
    expiration,
  });
  await saveNonces();
};

export const isNonceValid = async (nonce: number): Promise<boolean> => {
  await cleanupExpiredNonces();
  return !nonces.some((entry) => entry.nonce === nonce);
};

// Load nonces when the module is initialized
loadNonces();
