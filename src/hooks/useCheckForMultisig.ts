import {Account, ActiveAccount, KeyTypes} from 'actions/interfaces';
import {useEffect, useState} from 'react';
import {getAccount} from 'utils/hiveUtils';
import {MultisigUtils} from 'utils/multisig.utils';

export const useCheckForMultisig = (
  keyType: KeyTypes,
  userAccount?: ActiveAccount,
  username?: string,
  accounts?: Account[],
) => {
  const [isMultisig, setIsMultisig] = useState(false);
  const [twoFABots, setTwoFABots] = useState<{[botName: string]: string}>({});
  const [user, setUser] = useState<Partial<ActiveAccount>>(userAccount);

  useEffect(() => {
    loadUser();
  }, [userAccount, username, accounts]);

  const loadUser = async () => {
    if (!userAccount && username && accounts) {
      const selectedAccount = await getAccount(username);
      setUser({
        ...accounts.find((account) => account.name === username),
        account: selectedAccount,
      });
    } else setUser(userAccount);
  };

  useEffect(() => {
    if (user) checkForMultsig();
  }, [user]);

  const checkForMultsig = async () => {
    setTwoFABots({});
    const data = await MultisigUtils.getMultisigInfo(keyType, user!);
    setIsMultisig(data[0] as boolean);
    setTwoFABots(data[1]);
  };
  return [isMultisig, twoFABots, setTwoFABots] as const;
};
