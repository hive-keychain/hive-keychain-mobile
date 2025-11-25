import {renderHook, waitFor} from '@testing-library/react-native';
import {useCheckForMultisig} from '../useCheckForMultisig';
import {getAccount} from 'utils/hive.utils';
import {MultisigUtils} from 'utils/multisig.utils';
import {KeyTypes, ActiveAccount, Account} from 'actions/interfaces';

jest.mock('utils/hive.utils', () => ({
  getAccount: jest.fn(),
}));

jest.mock('utils/multisig.utils', () => ({
  MultisigUtils: {
    getMultisigInfo: jest.fn(),
  },
}));

describe('useCheckForMultisig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return multisig status', async () => {
    const mockAccount: ActiveAccount = {
      name: 'user1',
      account: {} as any,
      keys: {active: 'STM...'},
    } as ActiveAccount;
    (MultisigUtils.getMultisigInfo as jest.Mock).mockResolvedValueOnce([
      true,
      {bot1: 'key1'},
    ]);
    const {result} = renderHook(() =>
      useCheckForMultisig(KeyTypes.active, mockAccount),
    );
    await waitFor(() => {
      expect(result.current[0]).toBe(true);
      expect(result.current[1]).toEqual({bot1: 'key1'});
    });
  });

  it('should load account if username provided', async () => {
    const mockAccounts: Account[] = [
      {name: 'user1', keys: {}} as Account,
    ];
    const mockExtendedAccount = {} as any;
    (getAccount as jest.Mock).mockResolvedValueOnce(mockExtendedAccount);
    (MultisigUtils.getMultisigInfo as jest.Mock).mockResolvedValueOnce([
      false,
      {},
    ]);
    const {result} = renderHook(() =>
      useCheckForMultisig(KeyTypes.active, undefined, 'user1', mockAccounts),
    );
    await waitFor(() => {
      expect(getAccount).toHaveBeenCalledWith('user1');
    });
  });
});
