import {
  DEFAULT_WALLET_FILTER,
  normalizeWalletFilterState,
} from '../historyFilters';

describe('historyFilters', () => {
  describe('normalizeWalletFilterState', () => {
    it('adds escrow and removes legacy escrow keys from persisted shape', () => {
      const legacy = {
        ...DEFAULT_WALLET_FILTER,
        selectedTransactionTypes: {
          ...DEFAULT_WALLET_FILTER.selectedTransactionTypes,
          escrow_transfer: true,
          escrow_approve: false,
          escrow_dispute: false,
          escrow_release: false,
        },
      };
      const out = normalizeWalletFilterState(legacy);
      expect(out.selectedTransactionTypes.escrow).toBe(true);
      expect(out.selectedTransactionTypes.escrow_transfer).toBeUndefined();
      expect(out.selectedTransactionTypes.transfer).toBe(false);
    });

    it('fills missing keys from default (e.g. escrow after app upgrade)', () => {
      const partial = {
        ...DEFAULT_WALLET_FILTER,
        selectedTransactionTypes: {
          transfer: false,
          claim_reward_balance: false,
        } as Record<string, boolean>,
      };
      const out = normalizeWalletFilterState(partial);
      expect(out.selectedTransactionTypes.escrow).toBe(false);
      expect(Object.keys(out.selectedTransactionTypes)).toContain('escrow');
    });
  });
});
