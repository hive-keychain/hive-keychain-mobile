import {ActionPayload} from 'actions/interfaces';
import {CLEAR_WALLET_FILTERS, UPDATE_WALLET_FILTER} from 'actions/types';
import {createTransform, persistReducer} from 'redux-persist';
import {WalletHistoryFilter} from 'src/interfaces/walletHistory.interface';
import {persistConfig} from './configs';

/** Old filter UI used one key per escrow op; merged into `escrow`. */
const LEGACY_ESCROW_FILTER_KEYS = [
  'escrow_transfer',
  'escrow_approve',
  'escrow_dispute',
  'escrow_release',
] as const;

export const DEFAULT_WALLET_FILTER: WalletHistoryFilter = {
  filterValue: '',
  inSelected: false,
  outSelected: false,
  selectedTransactionTypes: {
    transfer: false,
    claim_reward_balance: false,
    delegate_vesting_shares: false,
    savings: false,
    power_up_down: false,
    convert: false,
    account_create: false,
    escrow: false,
  },
};

/**
 * Ensures all current filter keys exist (including `escrow`) and folds legacy
 * escrow keys into `escrow`. Required for persisted state from older app versions.
 */
export function normalizeWalletFilterState(
  state: WalletHistoryFilter,
): WalletHistoryFilter {
  const mergedTypes = {
    ...DEFAULT_WALLET_FILTER.selectedTransactionTypes,
    ...state.selectedTransactionTypes,
  };
  const escrowFromLegacy = LEGACY_ESCROW_FILTER_KEYS.some((k) =>
    Boolean(mergedTypes[k]),
  );
  LEGACY_ESCROW_FILTER_KEYS.forEach((k) => {
    delete mergedTypes[k];
  });
  mergedTypes.escrow = Boolean(mergedTypes.escrow || escrowFromLegacy);
  return {
    ...state,
    selectedTransactionTypes: mergedTypes,
  };
}

const walletFilterPersistConfig = {
  ...persistConfig('walletFilterPersist'),
  transforms: [
    createTransform(
      (inboundState: WalletHistoryFilter['selectedTransactionTypes']) =>
        inboundState,
      (outboundState, key) => {
        if (key !== 'selectedTransactionTypes' || outboundState == null) {
          return outboundState;
        }
        const merged = {
          ...DEFAULT_WALLET_FILTER.selectedTransactionTypes,
          ...outboundState,
        };
        const escrowFromLegacy = LEGACY_ESCROW_FILTER_KEYS.some((k) =>
          Boolean(merged[k]),
        );
        LEGACY_ESCROW_FILTER_KEYS.forEach((k) => {
          delete merged[k];
        });
        merged.escrow = Boolean(merged.escrow || escrowFromLegacy);
        return merged;
      },
    ),
  ],
};

const historyFiltersReducer = (
  state: WalletHistoryFilter = DEFAULT_WALLET_FILTER,
  {type, payload}: ActionPayload<WalletHistoryFilter>,
) => {
  let next: WalletHistoryFilter;
  switch (type) {
    case UPDATE_WALLET_FILTER:
      next = {...state, ...payload};
      break;
    case CLEAR_WALLET_FILTERS:
      next = DEFAULT_WALLET_FILTER;
      break;
    default:
      next = state;
  }
  return normalizeWalletFilterState(next);
};

export default persistReducer(walletFilterPersistConfig, historyFiltersReducer);
