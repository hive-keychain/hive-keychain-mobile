import {showModal, resetModal} from '../message';
import {SHOW_MODAL, RESET_MODAL} from '../types';
import {MessageModalType} from 'src/enums/messageModal.enum';

describe('message actions', () => {
  describe('showModal', () => {
    it('should create action to show modal', () => {
      const key = 'test-key';
      const type = MessageModalType.SUCCESS;
      const params = {message: 'Test message'};
      const action = showModal(key, type, params);

      expect(action.type).toBe(SHOW_MODAL);
      expect(action.payload).toEqual({
        key,
        type,
        params,
        skipTranslation: undefined,
        callback: undefined,
      });
    });

    it('should handle skipTranslation flag', () => {
      const action = showModal('key', MessageModalType.ERROR, {}, true);
      expect(action.payload?.skipTranslation).toBe(true);
    });

    it('should handle callback', () => {
      const callback = jest.fn();
      const action = showModal('key', MessageModalType.INFO, {}, false, callback);
      expect(action.payload?.callback).toBe(callback);
    });
  });

  describe('resetModal', () => {
    it('should create action to reset modal', () => {
      const action = resetModal();
      expect(action.type).toBe(RESET_MODAL);
      expect(action.payload).toBeUndefined();
    });
  });
});















