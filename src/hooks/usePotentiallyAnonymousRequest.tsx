import {Account, KeyTypes, PubKeyTypes} from 'actions/interfaces';
import RequestUsername from 'components/browser/requestOperations/components/RequestUsername';
import React, {useState} from 'react';
import {
  KeychainRequest,
  KeychainRequestTypes,
} from 'src/interfaces/keychain.interface';
import {store} from 'store';
import {
  getRequiredWifType,
  getValidAuthorityAccounts,
} from 'utils/keychain.utils';

export default (request: KeychainRequest, accounts: Account[]) => {
  const {username} = request;
  const method = getRequiredWifType(request);
  const activeAccountName = store.getState().activeAccount.name;
  accounts = getValidAuthorityAccounts(
    accounts,
    method.toLowerCase() as KeyTypes,
  );
  const wifType = getRequiredWifType(request);

  const findAccount = () => {
    if (!username) {
      // check if active account has an needed key
      const activeAccount = accounts.find(
        (acc) => acc.name === activeAccountName,
      );
      if (activeAccount?.keys[wifType]) {
        return activeAccountName;
      }
      // if active account doesn't have needed key, look for other accounts with needed keys
      return (
        accounts.find((acc) => acc.keys[wifType])?.name || activeAccountName
      );
    } else {
      // check if the requested username account hasthe needed key
      const requestedAccount = accounts.find((acc) => acc.name === username);
      if (requestedAccount?.keys[wifType]) {
        return username;
      }
      // if requested account doesn't have active key, look for any account with needed keys
      return accounts.find((acc) => acc.keys[wifType])?.name || username;
    }
  };

  const [account, setAccount] = useState(() => findAccount());

  const getAccountKey = () => {
    return accounts.find((a) => a.name === account)?.keys[
      method.toLowerCase() as KeyTypes
    ];
  };

  const getAccountMemoKey = () => {
    return accounts.find((a) => a.name === account)?.keys.memo;
  };

  const getAccountPublicKey = () => {
    return accounts.find((a) => a.name === account)?.keys[
      `${method.toLowerCase()}Pubkey` as PubKeyTypes
    ];
  };
  const getUsername = () => account;

  return {
    getUsername,
    getAccountKey,
    getAccountMemoKey,
    getAccountPublicKey,
    RequestUsername: () => (
      <RequestUsername
        account={account}
        accounts={accounts}
        setAccount={setAccount}
        enforce={
          request.type === KeychainRequestTypes.transfer
            ? request.enforce
            : !!request.username
        }
      />
    ),
  };
};
