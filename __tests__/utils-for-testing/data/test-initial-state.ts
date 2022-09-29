import { RootState } from "../store/fake-store";

export const initialEmptyStateStore = {} as RootState;

export const emptyStateStore = {
    accounts: [],
    activeAccount: {
        account: {},
        keys: {},
        rc: {},
    },
    auth: { mk: null },
    browser: {
        activeTab: null,
        favorites:  [],
        history:  [],
        shouldFocus: false,
        showManagement: false,
        tabs:  [],
    },
    conversions:  [],
        currencyPrices:  {
          bitcoin:  {},
          hive:  {},
          hive_dollar:  {},
        },
        delegations:  {
          incoming:  [],
          outgoing:  [],
        },
        hiveUri:  {},
        hive_authentication_service:  {
          instances:  [],
          sessions:  [],
        },
        lastAccount:  {
          has: false,
        },
        phishingAccounts:  [],
        preferences:  [],
        properties:  {},
        settings:  {
          rpc: "DEFAULT",
        },
        tokenHistory:  [],
        tokens:  [],
        tokensMarket:  [],
        transactions:  {
          list:  [],
          loading: false,
        },
        userTokens:  {
          list:  [],
          loading: false,
        },

} as RootState;