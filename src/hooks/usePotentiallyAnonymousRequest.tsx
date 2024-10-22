import {Account, KeyTypes, PubKeyTypes} from 'actions/interfaces';
import RequestUsername from 'components/browser/requestOperations/components/RequestUsername';
import React, {useState} from 'react';
import {getRequiredWifType, getValidAuthorityAccounts} from 'utils/keychain';
import {KeychainRequest, KeychainRequestTypes} from 'utils/keychain.types';

export default (request: KeychainRequest, accounts: Account[]) => {
  const {username} = request;
  const method = getRequiredWifType(request);
  let initAcc;
  accounts = getValidAuthorityAccounts(
    accounts,
    method.toLowerCase() as KeyTypes,
  );
  initAcc =
    username && accounts.find((u) => u.name === username)?.keys?.active
      ? username
      : accounts[0].name;
  const [account, setAccount] = useState(initAcc);

  const getAccountKey = () => {
    return accounts.find((a) => a.name === account).keys[
      method.toLowerCase() as KeyTypes
    ];
  };

  const getAccountMemoKey = () => {
    return accounts.find((a) => a.name === account).keys.memo;
  };

  const getAccountPublicKey = () => {
    return accounts.find((a) => a.name === account).keys[
      `${method.toLowerCase()}Pubkey` as PubKeyTypes
    ];
  };
  const getUsername = () => account;
  return {
    getUsername,
    getAccountKey,
    getAccountPublicKey,
    getAccountMemoKey,
    RequestUsername: () => (
      <RequestUsername
        username={username}
        accounts={accounts}
        account={account}
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
