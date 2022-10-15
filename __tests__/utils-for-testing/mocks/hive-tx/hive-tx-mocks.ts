import HiveTx from 'hive-tx';
import {
  BroadcastTestsErrorResponse,
  BroadcastTestsSuccessResponse,
} from '__tests__/utils-for-testing/interface/broadcast-response';

// jest
//         .fn()
//         .mockImplementation((...args) => Promise.resolve(transaction))),

export default {
  tx: {
    create: (error?: Error) =>
      (HiveTx.Transaction.prototype.create = jest
        .fn()
        .mockImplementation(() => {
          if (error) return Promise.reject(error);
          return Promise.resolve({});
        })),
    sign: (error?: Error) =>
      (HiveTx.Transaction.prototype.sign = jest.fn().mockImplementation(() => {
        if (error) throw error;
        return {};
      })),
    broadcast: (
      response: BroadcastTestsSuccessResponse | BroadcastTestsErrorResponse,
      error?: Error,
    ) =>
      (HiveTx.Transaction.prototype.broadcast = jest
        .fn()
        .mockImplementation((...args) => {
          if (error) return Promise.reject(error);
          return Promise.resolve(response);
        })),
  },
};
