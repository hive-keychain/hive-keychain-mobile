jest.mock('store', () => ({
  store: {
    getState: jest.fn(() => ({
      accounts: [],
      activeAccount: {name: 'user1'},
    })),
    dispatch: jest.fn(),
  },
}));

jest.mock('hive-uri', () => ({
  DecodeResult: {},
}));

import {
  saveRequestedOperation,
  forgetRequestedOperation,
} from '../hive-uri';
import {HiveUriOpType} from 'utils/hiveUri.utils';

describe('hive-uri actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveRequestedOperation', () => {
    it('should save requested operation', () => {
      const operation = {
        params: {to: 'user2', amount: '1 HIVE'},
      };
      const action = saveRequestedOperation(HiveUriOpType.op, operation as any);
      expect(action.type).toBe('SAVE_OPERATION');
      expect(action.payload.opType).toBe(HiveUriOpType.op);
      expect(action.payload.operation).toEqual(operation);
    });
  });

  describe('forgetRequestedOperation', () => {
    it('should forget requested operation', () => {
      const action = forgetRequestedOperation();
      expect(action.type).toBe('FORGET_OPERATION');
    });
  });
});
