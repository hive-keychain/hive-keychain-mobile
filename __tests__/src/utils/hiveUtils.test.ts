import {ExtendedAccount} from '@hiveio/dhive';
import {
  getDelegatees,
  getDelegators,
  getVotingDollarsPerAccount,
  getVP,
} from 'utils/hiveUtils';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testAccount from '__tests__/utils-for-testing/data/test-account';
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

    it('Must return voting dollars', async () => {
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
      ).toBe('13.44');
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
      console.log(greater);
      expect(
        delegatees.findIndex(
          (del) =>
            (del.vesting_shares as string) ===
            greater.toFixed(6).toString() + ' VESTS',
        ),
      ).toBe(0);
    });
  });
});
