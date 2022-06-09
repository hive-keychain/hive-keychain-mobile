import {
  AccountWitnessProxyOperation,
  AccountWitnessVoteOperation,
  PrivateKey,
} from '@hiveio/dhive';
import {ActiveAccount, Witness} from 'actions/interfaces';
import {getClient} from './hive';

const voteWitness = async (
  witness: Witness,
  activeAccount: ActiveAccount,
): Promise<boolean> => {
  return !!(await getClient().broadcast.sendOperations(
    [
      [
        'account_witness_vote',
        {
          account: activeAccount.name!,
          approve: true,
          witness: witness.name,
        },
      ] as AccountWitnessVoteOperation,
    ],
    PrivateKey.fromString(activeAccount.keys.active as string),
  ));
};

const unvoteWitness = async (
  witness: Witness,
  activeAccount: ActiveAccount,
) => {
  return !!(await getClient().broadcast.sendOperations(
    [
      [
        'account_witness_vote',
        {
          account: activeAccount.name!,
          approve: false,
          witness: witness.name,
        },
      ] as AccountWitnessVoteOperation,
    ],
    PrivateKey.fromString(activeAccount.keys.active as string),
  ));
};

const setAsProxy = async (proxyName: string, activeAccount: ActiveAccount) => {
  return !!(await getClient().broadcast.sendOperations(
    [
      [
        'account_witness_proxy',
        {account: activeAccount.name, proxy: proxyName},
      ] as AccountWitnessProxyOperation,
    ],
    PrivateKey.fromString(activeAccount.keys.active as string),
  ));
};

const removeProxy = async (activeAccount: ActiveAccount) => {
  return setAsProxy('', activeAccount);
};

const WitnessUtils = {unvoteWitness, voteWitness, setAsProxy, removeProxy};

export default WitnessUtils;
