import {ExtendedAccount} from '@hiveio/dhive';
import {
  getAccountKeys,
  getConversionRequests,
  getDelegatees,
  getDelegators,
  getVotingDollarsPerAccount,
  getVP,
  sanitizeAmount,
  sanitizeUsername,
} from 'utils/hiveUtils';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import testConvertionRequest from '__tests__/utils-for-testing/data/test-convertion-request';
import testDelegations from '__tests__/utils-for-testing/data/test-delegations';
import testDynamicGlobalProperties from '__tests__/utils-for-testing/data/test-dynamic-global-properties';
import testPriceGlobalProperties from '__tests__/utils-for-testing/data/test-price-global-properties';
import testRewardFundGlobalProperties from '__tests__/utils-for-testing/data/test-reward-fund-global-properties';
import objects from '__tests__/utils-for-testing/helpers/objects';
import apiKeychainMocks from '__tests__/utils-for-testing/mocks/as-module/api-keychain-mocks';
import hiveUtilsMocks from '__tests__/utils-for-testing/mocks/as-module/hive-utils-mocks';
afterAllTest.clearAllMocks;
describe('hiveUtils tests:\n', () => {
  describe('getVP cases"\n', () => {
    it('Must return null', () => {
      expect(getVP({} as ExtendedAccount)).toBeNull();
    });

    it('Must return estimated pct if greater estimated_mana', () => {
      const cloneExtendedAcc = objects.clone(
        testAccount.extended,
      ) as ExtendedAccount;
      cloneExtendedAcc.vesting_shares = '1000 VESTS';
      cloneExtendedAcc.delegated_vesting_shares = '100 VESTS';
      expect(getVP(cloneExtendedAcc)).toBe(100);
    });

    it('Must return estimated pct if smaller estimated_mana', () => {
      const cloneExtendedAcc = objects.clone(
        testAccount.extended,
      ) as ExtendedAccount;
      cloneExtendedAcc.vesting_shares = '1000 VESTS';
      cloneExtendedAcc.delegated_vesting_shares = '100 VESTS';
      cloneExtendedAcc.vesting_withdraw_rate = '100000';
      expect(getVP(cloneExtendedAcc)).toBeGreaterThan(100);
    });
  });

  describe('getVotingDollarsPerAccount cases:\n', () => {
    it('Must return null if no global properties', () => {
      expect(
        getVotingDollarsPerAccount(
          100,
          {globals: undefined},
          testAccount.extended,
          true,
        ),
      ).toBeNull();
    });

    it('Must return null if no account', () => {
      expect(
        getVotingDollarsPerAccount(
          100,
          {globals: testDynamicGlobalProperties},
          {} as ExtendedAccount,
          true,
        ),
      ).toBeNull();
    });

    it('Will return undefined', async () => {
      expect(
        getVotingDollarsPerAccount(
          100,
          {
            globals: testDynamicGlobalProperties,
            rewardFund: testRewardFundGlobalProperties,
            price: testPriceGlobalProperties,
          },
          testAccount.extended,
          true,
        ),
      ).toBeUndefined();
    });

    it('Will return undefined if reward balance has a typo', () => {
      expect(
        getVotingDollarsPerAccount(
          100,
          {
            globals: testDynamicGlobalProperties,
            rewardFund: {
              ...testRewardFundGlobalProperties,
              reward_balance: 'A100 VESTS',
            },
            price: testPriceGlobalProperties,
          },
          testAccount.extended,
          true,
        ),
      ).toBeUndefined();
    });
  });

  describe('getDelegators cases:\n', () => {
    it('Must return a list of delegators, sorted and filtered', async () => {
      apiKeychainMocks.getDelegators({data: testDelegations.delegators});
      const delegators = await getDelegators(testAccount._default.name);
      expect(delegators.length).toBe(testDelegations.delegators.length - 2);
      const greater = Math.max(...delegators.map((del) => del.vesting_shares));
      expect(
        delegators.findIndex((del) => del.vesting_shares === greater),
      ).toBe(0);
    });
  });

  describe('getDelegatees cases:\n', () => {
    it('Must return a list of delegatees, sorted and filtered', async () => {
      hiveUtilsMocks.getClient.database.getDelegatees(
        testDelegations.delegatees,
      );
      const delegatees = await getDelegatees(testAccount._default.name);
      expect(delegatees.length).toBe(testDelegations.delegatees.length - 1);
      const greater = Math.max(
        ...delegatees.map((del) =>
          parseFloat((del.vesting_shares as string).replace(' VESTS', '')),
        ),
      );
      expect(
        delegatees.findIndex(
          (del) =>
            (del.vesting_shares as string) ===
            greater.toFixed(6).toString() + ' VESTS',
        ),
      ).toBe(0);
    });
  });

  describe('getConversionRequests cases:\n', () => {
    const {hdbResponse, hiveResponse} = testConvertionRequest;
    it('Must return convertion requests sorted by date', async () => {
      hiveUtilsMocks.getClient.database.getConversionRequests(
        hdbResponse,
        hiveResponse,
      );
      const convertionRequests = await getConversionRequests(
        testAccount._default.name,
      );
      expect(convertionRequests[0].collaterized).toBeDefined();
    });
  });

  describe('getAccountKeys cases:\n', () => {
    it('Must return user keys', async () => {
      hiveUtilsMocks.getClient.database.getAccounts(testAccount.extended);
      const userkeys = await getAccountKeys(testAccount._default.name);
      expect(userkeys.active).toBeDefined();
      expect(userkeys.memo).toBeDefined();
      expect(userkeys.posting).toBeDefined();
    });
  });

  describe('sanitizeUsername cases:\n', () => {
    it('Must return sanitized user name', () => {
      expect(sanitizeUsername('    USERNAME     ')).toBe('username');
    });
  });

  describe('sanitizeAmount cases:\n', () => {
    it('Must sanitize each amount', () => {
      const amounts = [
        {amount: 10000, currency: 'HIVE', expected: '10000.000 HIVE'},
        {amount: 999.99, currency: 'HIVE', expected: '999.990 HIVE'},
        {amount: '10000', expected: '10000'},
      ];
      for (let i = 0; i < amounts.length; i++) {
        const {amount, currency, expected} = amounts[i];
        expect(sanitizeAmount(amount, currency)).toBe(expected);
      }
    });
  });
});
