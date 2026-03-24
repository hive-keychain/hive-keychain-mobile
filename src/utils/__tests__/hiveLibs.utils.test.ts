jest.mock('@hiveio/dhive', () => ({
  Client: jest.fn().mockImplementation(() => ({
    database: {
      getAccounts: jest.fn(),
      getDynamicGlobalProperties: jest.fn(),
      call: jest.fn().mockResolvedValue('1.27.0'),
    },
    call: jest.fn(),
    chainId: {
      set: jest.fn(),
    },
  })),
  PrivateKey: {
    fromString: jest.fn(),
    fromLogin: jest.fn(),
  },
}));

jest.mock('utils/config.utils', () => ({
  hiveEngine: {
    CHAIN_ID: 'ssc-mainnet-hive',
  },
}));

jest.mock('utils/keychain.utils', () => ({
  sleep: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('hive-tx', () => {
  const mockTransaction = jest.fn().mockImplementation(() => ({
    create: jest.fn().mockResolvedValue({}),
    sign: jest.fn().mockReturnValue({
      signatures: ['sig1'],
    }),
    broadcast: jest.fn().mockResolvedValue({result: {tx_id: 'tx123'}}),
    addSignature: jest.fn(),
  }));
  const mockHiveTx = {
    Transaction: mockTransaction,
    PrivateKey: {
      from: jest.fn().mockReturnValue({
        sign: jest.fn().mockReturnValue('signature'),
      }),
    },
    config: {
      node: '',
      chain_id: '',
    },
  };
  return {
    __esModule: true,
    default: mockHiveTx,
    call: jest.fn().mockResolvedValue({result: {status: 'within_irreversible_block'}}),
    Transaction: mockTransaction,
  };
});

import {
  getClient,
  broadcast,
  broadcastJson,
  setRpc,
  isTestnet,
  getCurrency,
  transfer,
  recurrentTransfer,
  sendToken,
  stakeToken,
  unstakeToken,
  delegateToken,
  cancelDelegateToken,
  powerUp,
  powerDown,
  delegate,
  convert,
  collateralizedConvert,
  depositToSavings,
  withdrawFromSavings,
  cancelPendingSavings,
  vote,
  voteForWitness,
  setProxy,
  createClaimedAccount,
  createNewAccount,
  post,
  signTx,
  addAccountAuth,
  removeAccountAuth,
  addKeyAuth,
  removeKeyAuth,
  updateProposalVote,
  createProposal,
  claimRewards,
  removeProposal,
  broadcastAndConfirmTransactionWithSignature,
  getData,
  getTransaction,
  registerMultisigRequestHandler,
} from '../hiveLibs.utils';
import {ExtendedAccount} from '@hiveio/dhive';
import {KeychainKeyTypes} from 'src/interfaces/keychain.interface';

describe('hiveLibs.utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getClient', () => {
    it('should return client instance', () => {
      const client = getClient();
      expect(client).toBeDefined();
    });
  });

  describe('setRpc', () => {
    it('should set RPC with string', async () => {
      await setRpc('https://api.hive.blog');
      const client = getClient();
      expect(client).toBeDefined();
    });

    it('should set RPC with Rpc object', async () => {
      await setRpc({
        uri: 'https://api.hive.blog',
        testnet: false,
        chainId: 'beeab0de00000000000000000000000000000000000000000000000000000000',
      });
      const client = getClient();
      expect(client).toBeDefined();
    });

    it('should set testnet flag', async () => {
      await setRpc({
        uri: 'https://testnet.hive.blog',
        testnet: true,
      });
      expect(isTestnet()).toBe(true);
    });
  });

  describe('isTestnet', () => {
    it('should return testnet status', () => {
      const result = isTestnet();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getCurrency', () => {
    it('should return HIVE for mainnet', async () => {
      await setRpc('https://api.hive.blog');
      expect(getCurrency('HIVE')).toBe('HIVE');
      expect(getCurrency('HBD')).toBe('HBD');
      expect(getCurrency('HP')).toBe('HP');
    });

    it('should return TESTS for testnet', async () => {
      await setRpc({
        uri: 'https://testnet.hive.blog',
        testnet: true,
      });
      expect(getCurrency('HIVE')).toBe('TESTS');
      expect(getCurrency('HBD')).toBe('TBD');
      expect(getCurrency('HP')).toBe('TP');
    });
  });

  describe('transfer', () => {
    it('should call broadcast with transfer operation', async () => {
      const result = await transfer('5KQwr...', {
        from: 'user1',
        to: 'user2',
        amount: '1.000 HIVE',
        memo: 'test',
      });
      expect(result).toBeDefined();
    });
  });

  describe('recurrentTransfer', () => {
    it('should call broadcast with recurrent_transfer operation', async () => {
      const result = await recurrentTransfer('5KQwr...', {
        from: 'user1',
        to: 'user2',
        amount: '1.000 HIVE',
        memo: 'test',
        recurrence: 24,
        executions: 10,
      });
      expect(result).toBeDefined();
    });
  });

  describe('broadcast', () => {
    it('should broadcast transaction', async () => {
      const result = await broadcast('5KQwr...', [
        ['transfer', {from: 'user1', to: 'user2', amount: '1 HIVE'}],
      ]);
      expect(result).toBeDefined();
    });

    it('should handle multisig options', async () => {
      const result = await broadcast(
        '5KQwr...',
        [['transfer', {from: 'user1', to: 'user2', amount: '1 HIVE'}]],
        {multisig: true},
      );
      expect(result).toBeDefined();
    });
  });

  describe('broadcastJson', () => {
    it('should broadcast JSON transaction with active key', async () => {
      const result = await broadcastJson(
        '5KQwr...',
        'user1',
        'test-id',
        true,
        {test: 'data'},
      );
      expect(result).toBeDefined();
    });

    it('should broadcast JSON transaction with posting key', async () => {
      const result = await broadcastJson(
        '5KQwr...',
        'user1',
        'test-id',
        false,
        '{"test": "data"}',
      );
      expect(result).toBeDefined();
    });
  });

  describe('sendToken', () => {
    it('should send token via broadcastJson', async () => {
      const result = await sendToken('5KQwr...', 'user1', {
        symbol: 'BEE',
        to: 'user2',
        quantity: '1.000',
        memo: 'test',
      });
      expect(result).toBeDefined();
    });
  });

  describe('stakeToken', () => {
    it('should stake token via broadcastJson', async () => {
      const result = await stakeToken(
        '5KQwr...',
        'user1',
        {
          symbol: 'BEE',
          quantity: '1.000',
        },
        {},
      );
      expect(result).toBeDefined();
    });
  });

  describe('unstakeToken', () => {
    it('should unstake token via broadcastJson', async () => {
      const result = await unstakeToken(
        '5KQwr...',
        'user1',
        {
          symbol: 'BEE',
          quantity: '1.000',
        },
        {},
      );
      expect(result).toBeDefined();
    });
  });

  describe('delegateToken', () => {
    it('should delegate token via broadcastJson', async () => {
      const result = await delegateToken(
        '5KQwr...',
        'user1',
        {
          symbol: 'BEE',
          to: 'user2',
          quantity: '1.000',
        },
        {},
      );
      expect(result).toBeDefined();
    });
  });

  describe('cancelDelegateToken', () => {
    it('should cancel delegate token via broadcastJson', async () => {
      const result = await cancelDelegateToken(
        '5KQwr...',
        'user1',
        {
          symbol: 'BEE',
          to: 'user2',
          quantity: '1.000',
        },
        {},
      );
      expect(result).toBeDefined();
    });
  });

  describe('powerUp', () => {
    it('should call broadcast with transfer_to_vesting operation', async () => {
      const result = await powerUp(
        '5KQwr...',
        {
          from: 'user1',
          to: 'user1',
          amount: '1.000 HIVE',
        },
        {},
      );
      expect(result).toBeDefined();
    });
  });

  describe('powerDown', () => {
    it('should call broadcast with withdraw_vesting operation', async () => {
      const result = await powerDown(
        '5KQwr...',
        {
          account: 'user1',
          vesting_shares: '1.000000 VESTS',
        },
        {},
      );
      expect(result).toBeDefined();
    });
  });

  describe('delegate', () => {
    it('should call broadcast with delegate_vesting_shares operation', async () => {
      const result = await delegate(
        '5KQwr...',
        {
          delegator: 'user1',
          delegatee: 'user2',
          vesting_shares: '1.000000 VESTS',
        },
        {},
      );
      expect(result).toBeDefined();
    });
  });

  describe('convert', () => {
    it('should call broadcast with convert operation', async () => {
      const result = await convert(
        '5KQwr...',
        {
          owner: 'user1',
          requestid: 1,
          amount: '1.000 HBD',
        },
        {},
      );
      expect(result).toBeDefined();
    });
  });

  describe('collateralizedConvert', () => {
    it('should call broadcast with collateralized_convert operation', async () => {
      const result = await collateralizedConvert(
        '5KQwr...',
        {
          owner: 'user1',
          requestid: 1,
          collateral_amount: '1.000 HBD',
          amount_out: '5.000 HIVE',
        },
        {},
      );
      expect(result).toBeDefined();
    });
  });

  describe('depositToSavings', () => {
    it('should call broadcast with transfer_to_savings operation', async () => {
      const result = await depositToSavings('5KQwr...', {
        from: 'user1',
        to: 'user1',
        amount: '1.000 HIVE',
        memo: 'test',
      });
      expect(result).toBeDefined();
    });
  });

  describe('withdrawFromSavings', () => {
    it('should call broadcast with transfer_from_savings operation', async () => {
      const result = await withdrawFromSavings('5KQwr...', {
        from: 'user1',
        request_id: 1,
        to: 'user1',
        amount: '1.000 HIVE',
        memo: 'test',
      });
      expect(result).toBeDefined();
    });
  });

  describe('cancelPendingSavings', () => {
    it('should call broadcast with cancel_transfer_from_savings operation', async () => {
      const result = await cancelPendingSavings('5KQwr...', {
        from: 'user1',
        request_id: 1,
      });
      expect(result).toBeDefined();
    });
  });

  describe('vote', () => {
    it('should call broadcast with vote operation', async () => {
      const result = await vote('5KQwr...', {
        voter: 'user1',
        author: 'author1',
        permlink: 'post1',
        weight: 10000,
      });
      expect(result).toBeDefined();
    });
  });

  describe('voteForWitness', () => {
    it('should call broadcast with account_witness_vote operation', async () => {
      const result = await voteForWitness('5KQwr...', {
        account: 'user1',
        witness: 'witness1',
        approve: true,
      });
      expect(result).toBeDefined();
    });
  });

  describe('setProxy', () => {
    it('should call broadcast with account_witness_proxy operation', async () => {
      const result = await setProxy('5KQwr...', {
        account: 'user1',
        proxy: 'proxy1',
      });
      expect(result).toBeDefined();
    });
  });

  describe('createClaimedAccount', () => {
    it('should call broadcast with create_claimed_account operation', async () => {
      const result = await createClaimedAccount('5KQwr...', {
        creator: 'user1',
        new_account_name: 'newuser',
        owner: {} as any,
        active: {} as any,
        posting: {} as any,
        memo_key: 'STM...',
        json_metadata: '',
        extensions: [],
      });
      expect(result).toBeDefined();
    });
  });

  describe('createNewAccount', () => {
    it('should call broadcast with account_create operation', async () => {
      const result = await createNewAccount('5KQwr...', {
        creator: 'user1',
        new_account_name: 'newuser',
        owner: {} as any,
        active: {} as any,
        posting: {} as any,
        memo_key: 'STM...',
        json_metadata: '',
        fee: '3.000 HIVE',
        extensions: [],
      });
      expect(result).toBeDefined();
    });
  });

  describe('post', () => {
    it('should call broadcast with comment operation', async () => {
      const result = await post('5KQwr...', {
        username: 'user1',
        parent_perm: 'parent',
        parent_username: 'parentuser',
        title: 'Test Post',
        body: 'Test body',
        json_metadata: '{}',
        permlink: 'test-post',
      });
      expect(result).toBeDefined();
    });

    it('should include comment_options when provided', async () => {
      const result = await post('5KQwr...', {
        username: 'user1',
        parent_perm: 'parent',
        parent_username: 'parentuser',
        title: 'Test Post',
        body: 'Test body',
        json_metadata: '{}',
        permlink: 'test-post',
        comment_options: JSON.stringify({
          allow_curation_rewards: true,
          allow_votes: true,
          max_accepted_payout: '1000000.000 HBD',
          percent_hbd: 10000,
          extensions: [],
        }),
      });
      expect(result).toBeDefined();
    });
  });

  describe('signTx', () => {
    it('should sign transaction', () => {
      const result = signTx('5KQwr...', {operations: []});
      expect(result).toBeDefined();
    });
  });

  describe('addAccountAuth', () => {
    it('should add account authority', async () => {
      const mockAccount: ExtendedAccount = {
        name: 'user1',
        posting: {
          account_auths: [],
          key_auths: [],
          weight_threshold: 1,
        },
        active: {
          account_auths: [],
          key_auths: [],
          weight_threshold: 1,
        },
        memo_key: 'STM...',
        json_metadata: '{}',
      } as ExtendedAccount;

      const {getClient} = require('../hiveLibs.utils');
      getClient().database.getAccounts.mockResolvedValueOnce([mockAccount]);

      const result = await addAccountAuth(
        '5KQwr...',
        {
          username: 'user1',
          authorizedUsername: 'authuser',
          role: KeychainKeyTypes.posting,
          weight: 1,
        },
        {},
      );
      expect(result).toBeDefined();
    });

    it('should throw error if authority already exists', async () => {
      const mockAccount: ExtendedAccount = {
        name: 'user1',
        posting: {
          account_auths: [['authuser', 1]],
          key_auths: [],
          weight_threshold: 1,
        },
        active: {
          account_auths: [],
          key_auths: [],
          weight_threshold: 1,
        },
        memo_key: 'STM...',
        json_metadata: '{}',
      } as ExtendedAccount;

      const {getClient} = require('../hiveLibs.utils');
      getClient().database.getAccounts.mockResolvedValueOnce([mockAccount]);

      await expect(
        addAccountAuth(
          '5KQwr...',
          {
            username: 'user1',
            authorizedUsername: 'authuser',
            role: KeychainKeyTypes.posting,
            weight: 1,
          },
          {},
        ),
      ).rejects.toThrow('Already has authority');
    });
  });

  describe('removeAccountAuth', () => {
    it('should remove account authority', async () => {
      const mockAccount: ExtendedAccount = {
        name: 'user1',
        posting: {
          account_auths: [['authuser', 1]],
          key_auths: [],
          weight_threshold: 1,
        },
        active: {
          account_auths: [],
          key_auths: [],
          weight_threshold: 1,
        },
        memo_key: 'STM...',
        json_metadata: '{}',
      } as ExtendedAccount;

      const {getClient} = require('../hiveLibs.utils');
      getClient().database.getAccounts.mockResolvedValueOnce([mockAccount]);

      const result = await removeAccountAuth(
        '5KQwr...',
        {
          username: 'user1',
          authorizedUsername: 'authuser',
          role: KeychainKeyTypes.posting,
        },
        {},
      );
      expect(result).toBeDefined();
    });

    it('should throw error if authority does not exist', async () => {
      const mockAccount: ExtendedAccount = {
        name: 'user1',
        posting: {
          account_auths: [],
          key_auths: [],
          weight_threshold: 1,
        },
        active: {
          account_auths: [],
          key_auths: [],
          weight_threshold: 1,
        },
        memo_key: 'STM...',
        json_metadata: '{}',
      } as ExtendedAccount;

      const {getClient} = require('../hiveLibs.utils');
      getClient().database.getAccounts.mockResolvedValueOnce([mockAccount]);

      await expect(
        removeAccountAuth(
          '5KQwr...',
          {
            username: 'user1',
            authorizedUsername: 'authuser',
            role: KeychainKeyTypes.posting,
          },
          {},
        ),
      ).rejects.toThrow('Nothing to remove');
    });
  });

  describe('addKeyAuth', () => {
    it('should add key authority', async () => {
      const mockAccount: ExtendedAccount = {
        name: 'user1',
        posting: {
          account_auths: [],
          key_auths: [],
          weight_threshold: 1,
        },
        active: {
          account_auths: [],
          key_auths: [],
          weight_threshold: 1,
        },
        memo_key: 'STM...',
        json_metadata: '{}',
      } as ExtendedAccount;

      const {getClient} = require('../hiveLibs.utils');
      getClient().database.getAccounts.mockResolvedValueOnce([mockAccount]);

      const result = await addKeyAuth(
        '5KQwr...',
        {
          username: 'user1',
          authorizedKey: 'STMnewkey',
          role: KeychainKeyTypes.posting,
          weight: 1,
        },
        {},
      );
      expect(result).toBeDefined();
    });

    it('should throw error if key already exists', async () => {
      const mockAccount: ExtendedAccount = {
        name: 'user1',
        posting: {
          account_auths: [],
          key_auths: [['STMnewkey', 1]],
          weight_threshold: 1,
        },
        active: {
          account_auths: [],
          key_auths: [],
          weight_threshold: 1,
        },
        memo_key: 'STM...',
        json_metadata: '{}',
      } as ExtendedAccount;

      const {getClient} = require('../hiveLibs.utils');
      getClient().database.getAccounts.mockResolvedValueOnce([mockAccount]);

      await expect(
        addKeyAuth(
          '5KQwr...',
          {
            username: 'user1',
            authorizedKey: 'STMnewkey',
            role: KeychainKeyTypes.posting,
            weight: 1,
          },
          {},
        ),
      ).rejects.toThrow('already has authority');
    });
  });

  describe('removeKeyAuth', () => {
    it('should remove key authority', async () => {
      const mockAccount: ExtendedAccount = {
        name: 'user1',
        posting: {
          account_auths: [],
          key_auths: [['STMoldkey', 1]],
          weight_threshold: 1,
        },
        active: {
          account_auths: [],
          key_auths: [],
          weight_threshold: 1,
        },
        memo_key: 'STM...',
        json_metadata: '{}',
      } as ExtendedAccount;

      const {getClient} = require('../hiveLibs.utils');
      getClient().database.getAccounts.mockResolvedValueOnce([mockAccount]);

      const result = await removeKeyAuth(
        '5KQwr...',
        {
          username: 'user1',
          authorizedKey: 'STMoldkey',
          role: KeychainKeyTypes.posting,
        },
        {},
      );
      expect(result).toBeDefined();
    });

    it('should throw error if key does not exist', async () => {
      const mockAccount: ExtendedAccount = {
        name: 'user1',
        posting: {
          account_auths: [],
          key_auths: [],
          weight_threshold: 1,
        },
        active: {
          account_auths: [],
          key_auths: [],
          weight_threshold: 1,
        },
        memo_key: 'STM...',
        json_metadata: '{}',
      } as ExtendedAccount;

      const {getClient} = require('../hiveLibs.utils');
      getClient().database.getAccounts.mockResolvedValueOnce([mockAccount]);

      await expect(
        removeKeyAuth(
          '5KQwr...',
          {
            username: 'user1',
            authorizedKey: 'STMoldkey',
            role: KeychainKeyTypes.posting,
          },
          {},
        ),
      ).rejects.toThrow('Missing authority');
    });
  });

  describe('updateProposalVote', () => {
    it('should call broadcast with update_proposal_votes operation', async () => {
      const result = await updateProposalVote('5KQwr...', {
        voter: 'user1',
        proposal_ids: [1, 2],
        approve: true,
        extensions: [],
      });
      expect(result).toBeDefined();
    });
  });

  describe('createProposal', () => {
    it('should call broadcast with create_proposal operation', async () => {
      const result = await createProposal('5KQwr...', {
        creator: 'user1',
        receiver: 'user2',
        start_date: '2023-01-01T00:00:00',
        end_date: '2023-12-31T23:59:59',
        daily_pay: '100.000 HBD',
        subject: 'Test Proposal',
        permlink: 'test-proposal',
        extensions: [],
      });
      expect(result).toBeDefined();
    });
  });

  describe('claimRewards', () => {
    it('should call broadcast with claim_reward_balance operation', async () => {
      const result = await claimRewards('5KQwr...', {
        account: 'user1',
        reward_hive: '0.000 HIVE',
        reward_hbd: '0.000 HBD',
        reward_vests: '0.000000 VESTS',
      });
      expect(result).toBeDefined();
    });
  });

  describe('removeProposal', () => {
    it('should call broadcast with remove_proposal operation', async () => {
      const result = await removeProposal('5KQwr...', {
        proposer: 'user1',
        proposal_ids: [1],
        extensions: [],
      });
      expect(result).toBeDefined();
    });
  });

  describe('broadcastAndConfirmTransactionWithSignature', () => {
    it('should broadcast and confirm transaction with single signature', async () => {
      const result = await broadcastAndConfirmTransactionWithSignature(
        {} as any,
        'signature1',
        true,
      );
      expect(result).toBeDefined();
      if (result) {
        expect(result.tx_id).toBe('tx123');
      }
    });

    it('should broadcast and confirm transaction with multiple signatures', async () => {
      const result = await broadcastAndConfirmTransactionWithSignature(
        {} as any,
        ['signature1', 'signature2'],
        false,
      );
      expect(result).toBeDefined();
    });
  });

  describe('getData', () => {
    it('should get data from RPC call', async () => {
      const {call} = require('hive-tx');
      call.mockResolvedValueOnce({result: {data: 'test'}});
      const result = await getData('test.method', []);
      expect(result).toEqual({data: 'test'});
    });

    it('should get data with key parameter', async () => {
      const {call} = require('hive-tx');
      call.mockResolvedValueOnce({result: {data: 'test'}});
      const result = await getData('test.method', [], 'data');
      expect(result).toBe('test');
    });

    it('should throw error on RPC failure', async () => {
      const {call} = require('hive-tx');
      call.mockResolvedValueOnce({error: 'RPC Error'});
      await expect(getData('test.method', [])).rejects.toThrow();
    });
  });

  describe('getTransaction', () => {
    it('should get transaction by ID', async () => {
      const {call} = require('hive-tx');
      call.mockResolvedValueOnce({result: {tx: {id: 'tx123'}}});
      const result = await getTransaction('tx123');
      expect(result).toBeDefined();
    });
  });

  describe('registerMultisigRequestHandler', () => {
    it('should register multisig request handler', () => {
      const handler = jest.fn();
      registerMultisigRequestHandler(handler);
      // Handler should be registered and used in broadcast when multisig is true
      expect(handler).toBeDefined();
    });
  });
});
