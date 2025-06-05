import {Account, KeyTypes, PubKeyTypes} from 'actions/interfaces';
import RequestUsername from 'components/browser/requestOperations/components/RequestUsername';
import React, {useState} from 'react';
import {store} from 'store';
import {getRequiredWifType, getValidAuthorityAccounts} from 'utils/keychain';
import {KeychainRequest, KeychainRequestTypes} from 'utils/keychain.types';

export default (request: KeychainRequest, accounts: Account[]) => {
  const {username} = request;
  const method = getRequiredWifType(request);
  const activeAccountName = store.getState().activeAccount.name;
  accounts = getValidAuthorityAccounts(
    accounts,
    method.toLowerCase() as KeyTypes,
  );

  const [account, setAccount] = useState(() => {
    if (!username) {
      // If username is undefined, find the next account that's not the active account
      const nextAccount = accounts.find(
        (acc) => acc.name !== activeAccountName,
      );
      return nextAccount?.name || activeAccountName;
    }
    return username;
  });

  const getAccountKey = () => {
    return accounts.find((a) => a.name === username)?.keys[
      method.toLowerCase() as KeyTypes
    ];
  };

  const getAccountMemoKey = () => {
    return accounts.find((a) => a.name === username)?.keys.memo;
  };

  const getAccountPublicKey = () => {
    return accounts.find((a) => a.name === username)?.keys[
      `${method.toLowerCase()}Pubkey` as PubKeyTypes
    ];
  };
  const getUsername = () => username || account;
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
            : true
        }
      />
    ),
  };
};
