import {AsyncUtils} from '../async.utils';

describe('AsyncUtils', () => {
  describe('waitForXSeconds', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should wait for specified seconds', async () => {
      const promise = AsyncUtils.waitForXSeconds(2);
      expect(jest.getTimerCount()).toBe(1);
      jest.advanceTimersByTime(2000);
      await promise;
      expect(jest.getTimerCount()).toBe(0);
    });

    it('should resolve after waiting', async () => {
      const promise = AsyncUtils.waitForXSeconds(1);
      jest.advanceTimersByTime(1000);
      await expect(promise).resolves.toBeUndefined();
    });

    it('should handle zero duration', async () => {
      const promise = AsyncUtils.waitForXSeconds(0);
      jest.advanceTimersByTime(0);
      await expect(promise).resolves.toBeUndefined();
    });

    it('should handle fractional seconds', async () => {
      const promise = AsyncUtils.waitForXSeconds(0.5);
      expect(jest.getTimerCount()).toBe(1);
      jest.advanceTimersByTime(500);
      await promise;
      expect(jest.getTimerCount()).toBe(0);
    });

    it('should handle large durations', async () => {
      const promise = AsyncUtils.waitForXSeconds(100);
      expect(jest.getTimerCount()).toBe(1);
      jest.advanceTimersByTime(100000);
      await promise;
      expect(jest.getTimerCount()).toBe(0);
    });

    it('should resolve with undefined value', async () => {
      const promise = AsyncUtils.waitForXSeconds(1);
      jest.advanceTimersByTime(1000);
      const result = await promise;
      expect(result).toBeUndefined();
    });
  });
});







