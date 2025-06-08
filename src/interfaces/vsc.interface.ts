import {KeychainRequestTypes} from 'hive-keychain-commons';

export interface VscOperation {
  0: KeychainRequestTypes.vscTransfer;
  1: {
    [key: string]: any;
  };
}
