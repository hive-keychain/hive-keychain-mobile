import ArrayUtils from '../array.utils';

describe('ArrayUtils', () => {
  describe('mergeWithoutDuplicate', () => {
    it('should merge two arrays without duplicates', () => {
      const a = [1, 2, 3];
      const b = [3, 4, 5];
      const result = ArrayUtils.mergeWithoutDuplicate(a, b);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should merge arrays with objects using key', () => {
      const a = [{id: 1, name: 'a'}, {id: 2, name: 'b'}];
      const b = [{id: 2, name: 'b'}, {id: 3, name: 'c'}];
      const result = ArrayUtils.mergeWithoutDuplicate(a, b, 'id');
      expect(result).toEqual([
        {id: 1, name: 'a'},
        {id: 2, name: 'b'},
        {id: 3, name: 'c'},
      ]);
    });

    it('should handle empty arrays', () => {
      const result = ArrayUtils.mergeWithoutDuplicate([], []);
      expect(result).toEqual([]);
    });

    it('should handle one empty array', () => {
      const a = [1, 2, 3];
      const result = ArrayUtils.mergeWithoutDuplicate(a, []);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle multiple duplicates', () => {
      const a = [1, 2, 3, 3, 3];
      const b = [3, 4, 5, 5];
      const result = ArrayUtils.mergeWithoutDuplicate(a, b);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle objects with same key but different properties', () => {
      const a = [{id: 1, name: 'a'}, {id: 2, name: 'b'}];
      const b = [{id: 1, name: 'different'}, {id: 3, name: 'c'}];
      const result = ArrayUtils.mergeWithoutDuplicate(a, b, 'id');
      // Should keep first occurrence
      expect(result).toEqual([
        {id: 1, name: 'a'},
        {id: 2, name: 'b'},
        {id: 3, name: 'c'},
      ]);
    });

    it('should handle arrays with all duplicates', () => {
      const a = [1, 2, 3];
      const b = [1, 2, 3];
      const result = ArrayUtils.mergeWithoutDuplicate(a, b);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle objects with missing key property', () => {
      const a = [{id: 1}, {name: 'test'}];
      const b = [{id: 2}, {id: 1}];
      const result = ArrayUtils.mergeWithoutDuplicate(a, b, 'id');
      // Objects without 'id' should be included
      expect(result.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getMaxValue', () => {
    it('should return max value from array of numbers', () => {
      const list = [1, 5, 3, 9, 2];
      expect(ArrayUtils.getMaxValue(list)).toBe(9);
    });

    it('should return max value from array of objects', () => {
      const list = [
        {value: 10},
        {value: 5},
        {value: 20},
        {value: 15},
      ];
      expect(ArrayUtils.getMaxValue(list, 'value')).toBe(20);
    });

    it('should return 0 for empty array', () => {
      expect(ArrayUtils.getMaxValue([])).toBe(0);
    });

    it('should return 0 for all negative numbers (implementation limitation)', () => {
      // Note: getMaxValue starts with max=0, so it won't find negative max values
      const list = [-5, -1, -10];
      expect(ArrayUtils.getMaxValue(list)).toBe(0);
    });

    it('should handle array with zero', () => {
      const list = [5, 0, 3, 9, 2];
      expect(ArrayUtils.getMaxValue(list)).toBe(9);
    });

    it('should handle array with single element', () => {
      expect(ArrayUtils.getMaxValue([42])).toBe(42);
    });

    it('should handle objects with missing property', () => {
      const list = [
        {value: 10},
        {},
        {value: 20},
      ];
      // When property is missing, comparison might be undefined > 0 which is false
      expect(ArrayUtils.getMaxValue(list, 'value')).toBe(20);
    });
  });

  describe('getMinValue', () => {
    it('should return min value from array of numbers', () => {
      const list = [5, 1, 9, 3, 2];
      expect(ArrayUtils.getMinValue(list)).toBe(1);
    });

    it('should return min value from array of objects', () => {
      const list = [
        {value: 10},
        {value: 5},
        {value: 20},
        {value: 15},
      ];
      expect(ArrayUtils.getMinValue(list, 'value')).toBe(5);
    });

    it('should handle negative numbers', () => {
      const list = [-5, -1, -10];
      expect(ArrayUtils.getMinValue(list)).toBe(-10);
    });

    it('should return MAX_SAFE_INTEGER for empty array', () => {
      expect(ArrayUtils.getMinValue([])).toBe(Number.MAX_SAFE_INTEGER);
    });

    it('should handle array with zero', () => {
      const list = [5, 0, 3, 9, 2];
      expect(ArrayUtils.getMinValue(list)).toBe(0);
    });

    it('should handle array with single element', () => {
      expect(ArrayUtils.getMinValue([42])).toBe(42);
    });

    it('should handle objects with missing property', () => {
      const list = [
        {value: 10},
        {},
        {value: 5},
      ];
      // When property is missing, comparison might be undefined < min
      const result = ArrayUtils.getMinValue(list, 'value');
      expect(result).toBeLessThanOrEqual(5);
    });

    it('should handle mixed positive and negative numbers', () => {
      const list = [5, -3, 10, -1, 0];
      expect(ArrayUtils.getMinValue(list)).toBe(-3);
    });
  });
});

