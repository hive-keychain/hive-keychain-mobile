const mockDatabase = {
  getWitnesses: jest.fn(),
  getWitnessByAccount: jest.fn(),
};

const mockCall = jest.fn();

const mockClient = {
  database: mockDatabase,
  call: mockCall,
};

jest.mock('utils/hiveLibs.utils', () => ({
  getClient: jest.fn(() => mockClient),
  broadcast: jest.fn(),
}));

jest.mock('api/keychain.api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

import {getWitnessInfo, updateWitnessParameters} from '../witness.utils';
import {broadcast} from 'utils/hiveLibs.utils';
import api from 'api/keychain.api';
import {ActiveAccount} from 'actions/interfaces';

describe('witness.utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getWitnessInfo', () => {
    it('should get witness info', async () => {
      const mockWitness = {
        owner: 'witness1',
        url: 'https://example.com',
        last_hbd_exchange_update: '2023-01-01T00:00:00',
        hbd_exchange_rate: {
          base: '1.000 HBD',
          quote: '1.000 HIVE',
        },
        total_missed: 0,
        last_confirmed_block_num: 1000000,
        signing_key: 'STM...',
        running_version: '1.0.0',
        props: {
          account_creation_fee: {
            amount: 3000000,
            nai: '@@000000021',
            precision: 3,
          },
          maximum_block_size: 65536,
          hbd_interest_rate: 1000,
        },
      };
      mockCall.mockResolvedValue({
        witnesses: [mockWitness],
      });
      (api.get as jest.Mock).mockResolvedValueOnce({
        data: {
          votes_count: 100,
          votes: '1000000',
          lastMonthValue: 1000000,
        },
      });
      const result = await getWitnessInfo(
        'witness1',
        {globals: {
          total_vesting_fund_hive: '1000000.000 HIVE',
          total_vesting_shares: '500000000.000000 VESTS',
        }} as any,
        {hive: {usd: 1}} as any,
      );
      expect(result).toBeDefined();
    });
  });

  describe('updateWitnessParameters', () => {
    it('should update witness parameters', async () => {
      const mockAccount: Partial<ActiveAccount> = {
        name: 'user1',
        keys: {active: 'STM...'},
      };
      (broadcast as jest.Mock).mockResolvedValueOnce({});
      await updateWitnessParameters('user1', {} as any, 'STM...' as any);
      expect(broadcast).toHaveBeenCalled();
    });
  });
});
