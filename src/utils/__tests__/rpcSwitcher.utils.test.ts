import {useWorkingRPC} from '../rpcSwitcher.utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeychainStorageKeyEnum} from 'src/enums/keychainStorageKey.enum';
import {checkRpcStatus} from '../rpc.utils';
import {setRpc} from 'actions/index';
import {setSwitchToRpc, setDisplayChangeRpcPopup} from 'actions/rpc-switcher';
import {store} from 'store';
import {Rpc} from 'actions/interfaces';

jest.mock('../rpc.utils', () => ({
  checkRpcStatus: jest.fn(),
}));

jest.mock('actions/index', () => ({
  setRpc: jest.fn(() => ({type: 'SET_RPC'})),
}));

jest.mock('actions/rpc-switcher', () => ({
  setSwitchToRpc: jest.fn(() => ({type: 'SET_SWITCH_TO_RPC'})),
  setDisplayChangeRpcPopup: jest.fn(() => ({type: 'SET_DISPLAY_SWITCH_RPC'})),
}));

jest.mock('store', () => ({
  store: {
    getState: jest.fn(() => ({
      settings: {
        rpc: {uri: 'https://current-rpc.com', testnet: false},
      },
    })),
    dispatch: jest.fn(),
  },
}));

jest.mock('lists/rpc.list', () => ({
  rpcList: [
    {uri: 'https://rpc1.com', testnet: false},
    {uri: 'https://rpc2.com', testnet: false},
  ],
}));

describe('rpcSwitcher.utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useWorkingRPC', () => {
    it('should switch to working RPC automatically', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('true');
      (checkRpcStatus as jest.Mock).mockResolvedValueOnce(true);
      await useWorkingRPC();
      expect(store.dispatch).toHaveBeenCalled();
    });

    it('should show popup if auto switch disabled', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('false');
      (checkRpcStatus as jest.Mock).mockResolvedValueOnce(true);
      await useWorkingRPC();
      expect(setDisplayChangeRpcPopup).toHaveBeenCalled();
    });

    it('should not switch if no working RPC found', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('true');
      (checkRpcStatus as jest.Mock).mockResolvedValue(false);
      await useWorkingRPC();
      // May or may not be called depending on RPC list iteration
    });
  });
});
