import {Account, ActiveAccount} from 'actions/interfaces';
import {KeychainKeyTypes, KeychainKeyTypesLC} from 'hive-keychain-commons';
import {useEffect, useState} from 'react';
import {KeyType} from 'src/interfaces/keys.interface';
import {getAccount} from 'utils/hiveUtils';
import {KeyUtils} from 'utils/key.utils';
import {MultisigUtils} from 'utils/multisig.utils';

export const useCheckForMultsig = (
  keyType: KeyType,
  userAccount?: ActiveAccount,
  username?: string,
  accounts?: Account[],
) => {
  const [isMultisig, setIsMultisig] = useState(false);
  const [twoFABots, setTwoFABots] = useState<{[botName: string]: string}>({});
  const [user, setUser] = useState<Partial<ActiveAccount>>(userAccount);
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    if (!userAccount && username && accounts) {
      const selectedAccount = await getAccount(username);
      setUser({
        ...accounts.find((account) => account.name === username),
        account: selectedAccount,
      });
    }
  };

  useEffect(() => {
    if (user) checkForMultsig();
  }, [user]);

  const checkForMultsig = async () => {
    let useMultisig = false;
    switch (keyType.toUpperCase()) {
      case KeyType.ACTIVE: {
        if (user.keys.active) {
          useMultisig = KeyUtils.isUsingMultisig(
            user.keys.active,
            user.account,
            user.keys.activePubkey?.startsWith('@')
              ? user.keys.activePubkey.replace('@', '')
              : user.account.name,
            keyType.toLowerCase() as KeychainKeyTypesLC,
          );
          setIsMultisig(useMultisig);
          if (useMultisig) {
            const accounts = await MultisigUtils.get2FAAccounts(
              user.account,
              KeychainKeyTypes.active,
            );

            accounts.forEach((acc) =>
              setTwoFABots((old) => {
                return {...old, [acc]: ''};
              }),
            );
          }
        }
        break;
      }
      case KeyType.POSTING: {
        if (user.keys.posting) {
          useMultisig = KeyUtils.isUsingMultisig(
            user.keys.posting,
            user.account,
            user.keys.postingPubkey?.startsWith('@')
              ? user.keys.postingPubkey.replace('@', '')
              : user.account.name,
            keyType.toLowerCase() as KeychainKeyTypesLC,
          );
          setIsMultisig(useMultisig);

          if (useMultisig) {
            const accounts = await MultisigUtils.get2FAAccounts(
              user.account,
              KeychainKeyTypes.posting,
            );
            accounts.forEach((acc) =>
              setTwoFABots((old) => {
                return {...old, [acc]: ''};
              }),
            );
          }
        }
        break;
      }
    }
  };
  return [isMultisig, twoFABots, setTwoFABots] as const;
};
