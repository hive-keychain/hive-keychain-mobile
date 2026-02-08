import {TransferUtils} from '../transfer.utils';
import {TransferUtils as TransferUtilsCommons, TransferWarning} from 'hive-keychain-commons';
import {getData} from '../hiveLibs.utils';
import {PendingRecurrentTransfer} from 'src/interfaces/transaction.interface';

jest.mock('hive-keychain-commons');
jest.mock('../hiveLibs.utils');

describe('TransferUtils', () => {
  describe('getTransferWarningLabel', () => {
    it('should return phishing warning', () => {
      (TransferUtilsCommons.getTransferWarning as jest.Mock).mockReturnValue(
        TransferWarning.PHISHING,
      );
      const result = TransferUtils.getTransferWarningLabel(
        'user',
        'HIVE',
        'memo',
        [],
      );
      expect(result).toContain('wallet.operations.transfer.warning.phishing');
    });

    it('should return exchange memo warning', () => {
      (TransferUtilsCommons.getTransferWarning as jest.Mock).mockReturnValue(
        TransferWarning.EXCHANGE_MEMO,
      );
      const result = TransferUtils.getTransferWarningLabel(
        'user',
        'HIVE',
        'memo',
        [],
      );
      expect(result).toContain('wallet.operations.transfer.warning.exchange_memo');
    });

    it('should return undefined for no warning', () => {
      (TransferUtilsCommons.getTransferWarning as jest.Mock).mockReturnValue(
        undefined,
      );
      const result = TransferUtils.getTransferWarningLabel(
        'user',
        'HIVE',
        'memo',
        [],
      );
      expect(result).toBeUndefined();
    });
  });

  describe('getRecurrentTransfers', () => {
    it('should fetch recurrent transfers', async () => {
      const mockTransfers = {
        recurrent_transfers: [
          {
            id: 1,
            from: 'user1',
            to: 'user2',
            amount: '10 HIVE',
          } as PendingRecurrentTransfer,
        ],
      };
      (getData as jest.Mock).mockResolvedValueOnce(mockTransfers);
      const result = await TransferUtils.getRecurrentTransfers('user1');
      expect(result).toEqual(mockTransfers);
      expect(getData).toHaveBeenCalledWith(
        'database_api.find_recurrent_transfers',
        {from: 'user1'},
      );
    });
  });

  describe('getRecurrentTransferPairId', () => {
    it('should return next pair ID for existing transfers', () => {
      const transfers: PendingRecurrentTransfer[] = [
        {to: 'user2', pair_id: 1} as PendingRecurrentTransfer,
        {to: 'user2', pair_id: 3} as PendingRecurrentTransfer,
      ];
      const result = TransferUtils.getRecurrentTransferPairId(transfers, 'user2');
      expect(result).toBe(4); // max(1, 3) + 1
    });

    it('should return 0 for no existing transfers', () => {
      const transfers: PendingRecurrentTransfer[] = [];
      const result = TransferUtils.getRecurrentTransferPairId(transfers, 'user2');
      expect(result).toBe(0);
    });

    it('should return 0 for transfers to different user', () => {
      const transfers: PendingRecurrentTransfer[] = [
        {to: 'user1', pair_id: 1} as PendingRecurrentTransfer,
      ];
      const result = TransferUtils.getRecurrentTransferPairId(transfers, 'user2');
      expect(result).toBe(0);
    });
  });
});
