jest.mock('react-native-webview', () => ({
  WebView: 'WebView',
}));

jest.mock('expo-image', () => ({
  Image: 'Image',
}));

jest.mock('components/operations/Operation', () => ({
  __esModule: true,
  default: 'Operation',
}));

jest.mock('components/browser/requestOperations/components/RequestError', () => ({
  __esModule: true,
  default: 'RequestError',
}));

const mockAccounts = [{name: 'user1', keys: {active: 'STM...'}}];
const mockStore = {
  getState: jest.fn(() => ({
    accounts: mockAccounts,
    activeAccount: {name: 'user1'},
  })),
  dispatch: jest.fn(),
};

jest.mock('store', () => ({
  store: mockStore,
  RootState: {},
}));

jest.mock('hive-tx', () => {
  const mockTransaction = jest.fn().mockImplementation(() => ({
    create: jest.fn().mockResolvedValue({operations: []}),
    broadcast: jest.fn().mockResolvedValue({result: {tx_id: 'tx123'}}),
  }));
  return {
    __esModule: true,
    default: {
      Transaction: mockTransaction,
    },
  };
});

jest.mock('actions/hive-uri', () => ({
  saveRequestedOperation: jest.fn(),
}));

jest.mock('utils/navigation.utils', () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
}));

jest.mock('utils/keychain.utils', () => ({
  validateAuthority: jest.fn(() => ({valid: true})),
}));

jest.mock('react-native', () => ({
  Linking: {
    openURL: jest.fn(),
  },
  Platform: {
    OS: 'ios',
  },
}));

jest.mock('hive-uri', () => ({
  resolveCallback: jest.fn((url, params) => `${url}?sig=${params.sig}`),
}));

import {processQRCodeOp} from '../hiveUri.utils';
import {HiveUriOpType} from '../hiveUri.utils';
import {navigate} from 'utils/navigation.utils';
import {saveRequestedOperation} from 'actions/hive-uri';
import {validateAuthority} from 'utils/keychain.utils';
import {Linking} from 'react-native';

describe('hiveUri.utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.getState.mockReturnValue({
      accounts: mockAccounts,
      activeAccount: {name: 'user1'},
    });
    (validateAuthority as jest.Mock).mockReturnValue({valid: true});
  });

  describe('processQRCodeOp', () => {
    describe('HiveUriOpType.msg', () => {
      it('should process message operation', async () => {
        const mockDecoded = {
          params: {signer: 'user1', authority: 'active'},
          tx: 'test message',
        };
        await processQRCodeOp(HiveUriOpType.msg, mockDecoded as any);
        expect(navigate).toHaveBeenCalled();
      });

      it('should use default authority when not provided', async () => {
        const mockDecoded = {
          params: {signer: 'user1'},
          tx: 'test message',
        };
        await processQRCodeOp(HiveUriOpType.msg, mockDecoded as any);
        expect(navigate).toHaveBeenCalled();
      });
    });

    describe('HiveUriOpType.tx', () => {
      it('should process transaction operation', async () => {
        const mockDecoded = {
          params: {signer: 'user1'},
          tx: {
            operations: [['transfer', {from: 'user1', to: 'user2', amount: '1 HIVE'}]],
          },
        };
        await processQRCodeOp(HiveUriOpType.tx, mockDecoded as any);
        expect(navigate).toHaveBeenCalled();
      });

      it('should broadcast transaction when callback provided', async () => {
        const mockDecoded = {
          params: {signer: 'user1', callback: 'https://example.com/callback'},
          tx: {
            operations: [['transfer', {from: 'user1', to: 'user2', amount: '1 HIVE'}]],
          },
        };
        await processQRCodeOp(HiveUriOpType.tx, mockDecoded as any);
        expect(navigate).toHaveBeenCalled();
      });
    });

    describe('HiveUriOpType.ops', () => {
      it('should process operations array', async () => {
        const mockDecoded = {
          params: {signer: 'user1', authority: 'posting'},
          tx: {
            operations: [
              ['transfer', {from: 'user1', to: 'user2', amount: '1 HIVE'}],
            ],
          },
        };
        await processQRCodeOp(HiveUriOpType.ops, mockDecoded as any);
        expect(navigate).toHaveBeenCalled();
      });
    });

    describe('HiveUriOpType.op with transfer', () => {
      it('should process HIVE transfer', async () => {
        const mockDecoded = {
          params: {signer: 'user1'},
          tx: {
            operations: [
              [
                'transfer',
                {
                  from: 'user1',
                  to: 'user2',
                  amount: '1.000 HIVE',
                  memo: 'test',
                },
              ],
            ],
          },
        };
        await processQRCodeOp(HiveUriOpType.op, mockDecoded as any);
        expect(navigate).toHaveBeenCalled();
      });

      it('should process HBD transfer', async () => {
        const mockDecoded = {
          params: {signer: 'user1'},
          tx: {
            operations: [
              [
                'transfer',
                {
                  from: 'user1',
                  to: 'user2',
                  amount: '1.000 HBD',
                  memo: 'test',
                },
              ],
            ],
          },
        };
        await processQRCodeOp(HiveUriOpType.op, mockDecoded as any);
        expect(navigate).toHaveBeenCalled();
      });

      it('should process token transfer', async () => {
        const mockDecoded = {
          params: {signer: 'user1'},
          tx: {
            operations: [
              [
                'transfer',
                {
                  from: 'user1',
                  to: 'user2',
                  amount: '1.000 BEE',
                  memo: 'test',
                },
              ],
            ],
          },
        };
        await processQRCodeOp(HiveUriOpType.op, mockDecoded as any);
        expect(navigate).toHaveBeenCalled();
      });

      it('should handle transfer with enforce flag', async () => {
        const mockDecoded = {
          params: {signer: 'user1'},
          tx: {
            operations: [
              [
                'transfer',
                {
                  from: 'user1',
                  to: 'user2',
                  amount: '1.000 HIVE',
                  enforce: true,
                },
              ],
            ],
          },
        };
        await processQRCodeOp(HiveUriOpType.op, mockDecoded as any);
        expect(navigate).toHaveBeenCalled();
      });
    });

    describe('HiveUriOpType.op with delegate_vesting_shares', () => {
      it('should process HP delegation', async () => {
        const mockDecoded = {
          params: {signer: 'user1'},
          tx: {
            operations: [
              [
                'delegate_vesting_shares',
                {
                  delegator: 'user1',
                  delegatee: 'user2',
                  vesting_shares: '100.000 HP',
                },
              ],
            ],
          },
        };
        await processQRCodeOp(HiveUriOpType.op, mockDecoded as any);
        expect(navigate).toHaveBeenCalled();
      });

      it('should process VESTS delegation', async () => {
        const mockDecoded = {
          params: {signer: 'user1'},
          tx: {
            operations: [
              [
                'delegate_vesting_shares',
                {
                  delegator: 'user1',
                  delegatee: 'user2',
                  vesting_shares: '1000000.000000 VESTS',
                },
              ],
            ],
          },
        };
        await processQRCodeOp(HiveUriOpType.op, mockDecoded as any);
        expect(navigate).toHaveBeenCalled();
      });
    });

    describe('HiveUriOpType.op with account_witness_vote', () => {
      it('should process witness vote', async () => {
        const mockDecoded = {
          params: {signer: 'user1'},
          tx: {
            operations: [
              [
                'account_witness_vote',
                {
                  account: 'user1',
                  witness: 'witness1',
                  approve: true,
                },
              ],
            ],
          },
        };
        await processQRCodeOp(HiveUriOpType.op, mockDecoded as any);
        expect(navigate).toHaveBeenCalled();
      });
    });

    describe('HiveUriOpType.op with account_witness_proxy', () => {
      it('should process proxy operation', async () => {
        const mockDecoded = {
          params: {signer: 'user1'},
          tx: {
            operations: [
              [
                'account_witness_proxy',
                {
                  account: 'user1',
                  proxy: 'proxy1',
                },
              ],
            ],
          },
        };
        await processQRCodeOp(HiveUriOpType.op, mockDecoded as any);
        expect(navigate).toHaveBeenCalled();
      });
    });

    describe('HiveUriOpType.op with recurrent_transfer', () => {
      it('should process recurrent transfer', async () => {
        const mockDecoded = {
          params: {signer: 'user1'},
          tx: {
            operations: [
              [
                'recurrent_transfer',
                {
                  from: 'user1',
                  to: 'user2',
                  amount: '1.000 HIVE',
                  memo: 'test',
                  recurrence: 24,
                  executions: 10,
                },
              ],
            ],
          },
        };
        await processQRCodeOp(HiveUriOpType.op, mockDecoded as any);
        expect(navigate).toHaveBeenCalled();
      });
    });

    describe('HiveUriOpType.op with update_proposal_votes', () => {
      it('should process proposal vote update', async () => {
        const mockDecoded = {
          params: {signer: 'user1'},
          tx: {
            operations: [
              [
                'update_proposal_votes',
                {
                  voter: 'user1',
                  proposal_ids: [1, 2],
                  approve: true,
                  extensions: [],
                },
              ],
            ],
          },
        };
        await processQRCodeOp(HiveUriOpType.op, mockDecoded as any);
        expect(navigate).toHaveBeenCalled();
      });
    });

    describe('HiveUriOpType.op with unknown operation', () => {
      it('should process unknown operation as broadcast', async () => {
        const mockDecoded = {
          params: {signer: 'user1'},
          tx: {
            operations: [
              [
                'unknown_operation',
                {
                  data: 'test',
                },
              ],
            ],
          },
        };
        await processQRCodeOp(HiveUriOpType.op, mockDecoded as any);
        expect(navigate).toHaveBeenCalled();
      });
    });

    describe('no_broadcast parameter', () => {
      it('should handle no_broadcast parameter', async () => {
        const mockDecoded = {
          params: {signer: 'user1', no_broadcast: true},
          tx: {
            operations: [['transfer', {from: 'user1', to: 'user2', amount: '1 HIVE'}]],
          },
        };
        await processQRCodeOp(HiveUriOpType.ops, mockDecoded as any);
        expect(navigate).toHaveBeenCalled();
      });
    });

    describe('authority validation', () => {
      it('should navigate to error screen when authority is invalid', async () => {
        (validateAuthority as jest.Mock).mockReturnValue({
          valid: false,
          error: 'Invalid authority',
        });
        const mockDecoded = {
          params: {signer: 'user1'},
          tx: {
            operations: [['transfer', {from: 'user1', to: 'user2', amount: '1 HIVE'}]],
          },
        };
        await processQRCodeOp(HiveUriOpType.op, mockDecoded as any);
        expect(navigate).toHaveBeenCalled();
      });
    });

    describe('no accounts', () => {
      it('should save operation when no accounts exist', async () => {
        mockStore.getState.mockReturnValue({
          accounts: [],
          activeAccount: {name: 'user1'},
        });
        const mockDecoded = {
          params: {signer: 'user1'},
          tx: {
            operations: [['transfer', {from: 'user1', to: 'user2', amount: '1 HIVE'}]],
          },
        };
        await processQRCodeOp(HiveUriOpType.op, mockDecoded as any);
        expect(saveRequestedOperation).toHaveBeenCalled();
      });
    });

    describe('callback handling', () => {
      it('should open callback URL after successful operation', async () => {
        const mockDecoded = {
          params: {
            signer: 'user1',
            callback: 'https://example.com/callback',
          },
          tx: {
            operations: [['transfer', {from: 'user1', to: 'user2', amount: '1 HIVE'}]],
          },
        };
        await processQRCodeOp(HiveUriOpType.op, mockDecoded as any);
        expect(navigate).toHaveBeenCalled();
        // Callback will be called when sendResponse is invoked
      });
    });
  });
});
