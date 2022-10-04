import hive, * as HiveUtilsModule from 'utils/hive';

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
};
