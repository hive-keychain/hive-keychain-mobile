import {ExtendedAccount, VestingDelegation} from '@hiveio/dhive';
import * as HiveUtilsModule from 'utils/hive';

import {
  BroadcastTestsErrorResponse,
  BroadcastTestsSuccessResponse,
} from '__tests__/utils-for-testing/interface/broadcast-response';

export default {
  broadcast: (
    response: BroadcastTestsSuccessResponse | BroadcastTestsErrorResponse,
  ) =>
    jest
      .spyOn(HiveUtilsModule, 'broadcast')
      .mockImplementation((...args) => Promise.resolve(response)),
  getClient: {
    database: {
      getAccounts: (extendedAccount: ExtendedAccount, error?: Error) =>
        jest
          .spyOn(HiveUtilsModule.getClient().database, 'getAccounts')
          .mockImplementation((...args) => {
            if (error) return Promise.reject(error);
            return Promise.resolve([extendedAccount]);
          }),
      getDelegatees: (response: VestingDelegation[], error?: boolean) =>
        jest
          .spyOn(HiveUtilsModule.getClient().database, 'getVestingDelegations')
          .mockImplementation((...args) => {
            if (error) return Promise.reject(error);
            return Promise.resolve(response);
          }),
      getConversionRequests: (hbdConversions: any, hiveConversions: any) =>
        jest
          .spyOn(HiveUtilsModule.getClient().database, 'call')
          .mockResolvedValueOnce(hbdConversions)
          .mockResolvedValueOnce(hiveConversions),
    },
  },
};
