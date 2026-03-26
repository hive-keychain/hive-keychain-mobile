import {AddAccountFromWalletParamList} from 'navigators/mainDrawerStacks/AddAccount.types';
import {HiveUriOpType} from 'utils/hiveUriRequests.utils';

type CreateAccountPayload = AddAccountFromWalletParamList['CreateAccountFromWalletScreenPageOne']['newPeerToPeerData'];

const safeJsonParse = <T>(value: string): T | null => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const parseBase64Json = <T>(payload: string) => {
  try {
    return safeJsonParse<T>(Buffer.from(payload, 'base64').toString());
  } catch {
    return null;
  }
};

export const extractHiveUriOpType = (url: string): HiveUriOpType | null => {
  const match = url.match(/^hive:\/\/sign\/([^/]+)/);
  if (!match) {
    return null;
  }
  if (!Object.values(HiveUriOpType).includes(match[1] as HiveUriOpType)) {
    return null;
  }
  return match[1] as HiveUriOpType;
};

export const parseCreateAccountLinkPayload = (
  url: string,
): CreateAccountPayload | null => {
  const data = parseBase64Json<{
    n: string;
    o: string;
    a: string;
    p: string;
    m: string;
  }>(url.replace('keychain://create_account=', ''));
  if (!data) {
    return null;
  }
  const {n, o, a, p, m} = data;
  return {
    name: n,
    publicKeys: {
      owner: o,
      active: a,
      posting: p,
      memo: m,
    },
  };
};

export const parseAddAccountPayload = (data: string) =>
  safeJsonParse<any>(data.replace('keychain://add_account=', ''));
