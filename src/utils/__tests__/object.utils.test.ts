import {ObjectUtils} from '../object.utils';

describe('ObjectUtils', () => {
  describe('isPureObject', () => {
    it('should return true for plain objects', () => {
      expect(ObjectUtils.isPureObject({})).toBe(true);
      expect(ObjectUtils.isPureObject({key: 'value'})).toBe(true);
    });

    it('should return false for arrays', () => {
      expect(ObjectUtils.isPureObject([])).toBe(false);
      expect(ObjectUtils.isPureObject([1, 2, 3])).toBe(false);
    });

    it('should return false for null', () => {
      expect(ObjectUtils.isPureObject(null)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(ObjectUtils.isPureObject(undefined)).toBe(false);
    });

    it('should return false for primitives', () => {
      expect(ObjectUtils.isPureObject('string')).toBe(false);
      expect(ObjectUtils.isPureObject(123)).toBe(false);
      expect(ObjectUtils.isPureObject(true)).toBe(false);
    });

    it('should return true for Date objects (they are objects, not arrays)', () => {
      // Date objects are objects and not arrays, so they pass the check
      expect(ObjectUtils.isPureObject(new Date())).toBe(true);
    });

    it('should return true for RegExp objects (they are objects, not arrays)', () => {
      // RegExp objects are objects and not arrays, so they pass the check
      expect(ObjectUtils.isPureObject(/test/)).toBe(true);
    });

    it('should return false for function objects', () => {
      expect(ObjectUtils.isPureObject(() => {})).toBe(false);
      expect(ObjectUtils.isPureObject(function () {})).toBe(false);
    });

    it('should return true for object literals with various properties', () => {
      expect(ObjectUtils.isPureObject({a: 1, b: 'test', c: true})).toBe(true);
      expect(ObjectUtils.isPureObject({nested: {deep: {value: 1}}})).toBe(true);
    });
  });

  describe('diffObjects', () => {
    it('should find differences between objects', () => {
      const obj1 = {a: 1, b: 2};
      const obj2 = {a: 1, b: 3};
      const result = ObjectUtils.diffObjects(obj1, obj2);
      expect(result).toEqual({b: {from: 2, to: 3}});
    });

    it('should detect added properties', () => {
      const obj1 = {a: 1};
      const obj2 = {a: 1, b: 2};
      const result = ObjectUtils.diffObjects(obj1, obj2);
      expect(result).toEqual({b: {from: undefined, to: 2}});
    });

    it('should detect removed properties', () => {
      const obj1 = {a: 1, b: 2};
      const obj2 = {a: 1};
      const result = ObjectUtils.diffObjects(obj1, obj2);
      expect(result).toEqual({b: {from: 2, to: undefined}});
    });

    it('should handle nested objects', () => {
      const obj1 = {a: {b: 1}};
      const obj2 = {a: {b: 2}};
      const result = ObjectUtils.diffObjects(obj1, obj2);
      expect(result).toEqual({a: {b: {from: 1, to: 2}}});
    });

    it('should return empty object for identical objects', () => {
      const obj1 = {a: 1, b: 2};
      const obj2 = {a: 1, b: 2};
      const result = ObjectUtils.diffObjects(obj1, obj2);
      expect(result).toEqual({});
    });

    it('should handle empty objects', () => {
      expect(ObjectUtils.diffObjects({}, {})).toEqual({});
    });

    it('should handle one empty object', () => {
      const obj1 = {a: 1, b: 2};
      const obj2 = {};
      const result = ObjectUtils.diffObjects(obj1, obj2);
      expect(result).toEqual({
        a: {from: 1, to: undefined},
        b: {from: 2, to: undefined},
      });
    });

    it('should handle deeply nested objects', () => {
      const obj1 = {a: {b: {c: 1}}};
      const obj2 = {a: {b: {c: 2}}};
      const result = ObjectUtils.diffObjects(obj1, obj2);
      expect(result).toEqual({a: {b: {c: {from: 1, to: 2}}}});
    });

    it('should handle nested objects with added properties', () => {
      const obj1 = {a: {b: 1}};
      const obj2 = {a: {b: 1, c: 2}};
      const result = ObjectUtils.diffObjects(obj1, obj2);
      expect(result).toEqual({a: {c: {from: undefined, to: 2}}});
    });

    it('should handle nested objects with removed properties', () => {
      const obj1 = {a: {b: 1, c: 2}};
      const obj2 = {a: {b: 1}};
      const result = ObjectUtils.diffObjects(obj1, obj2);
      expect(result).toEqual({a: {c: {from: 2, to: undefined}}});
    });

    it('should handle arrays in objects', () => {
      const obj1 = {a: [1, 2, 3]};
      const obj2 = {a: [1, 2, 4]};
      // Arrays are treated as objects, so diffObjects recursively compares them
      // The function checks if both are objects (arrays are objects), so it recurses
      const result = ObjectUtils.diffObjects(obj1, obj2);
      // Since arrays are objects, it will recursively diff them
      expect(result.a).toBeDefined();
      expect(result.a).toHaveProperty('2');
      expect(result.a['2']).toEqual({from: 3, to: 4});
    });

    it('should handle null values', () => {
      const obj1 = {a: null};
      const obj2 = {a: 1};
      const result = ObjectUtils.diffObjects(obj1, obj2);
      expect(result).toEqual({a: {from: null, to: 1}});
    });

    it('should handle undefined values', () => {
      const obj1 = {a: undefined};
      const obj2 = {a: 1};
      const result = ObjectUtils.diffObjects(obj1, obj2);
      expect(result).toEqual({a: {from: undefined, to: 1}});
    });

    it('should handle multiple changes', () => {
      const obj1 = {a: 1, b: 2, c: 3};
      const obj2 = {a: 10, b: 20, c: 3, d: 40};
      const result = ObjectUtils.diffObjects(obj1, obj2);
      expect(result).toEqual({
        a: {from: 1, to: 10},
        b: {from: 2, to: 20},
        d: {from: undefined, to: 40},
      });
    });

    it('should handle objects with same nested structure but different values', () => {
      const obj1 = {user: {name: 'John', age: 30}};
      const obj2 = {user: {name: 'Jane', age: 25}};
      const result = ObjectUtils.diffObjects(obj1, obj2);
      expect(result).toEqual({
        user: {
          name: {from: 'John', to: 'Jane'},
          age: {from: 30, to: 25},
        },
      });
    });

    it('should handle nested objects that become null', () => {
      const obj1 = {a: {b: 1}};
      const obj2 = {a: null};
      const result = ObjectUtils.diffObjects(obj1, obj2);
      expect(result).toEqual({a: {from: {b: 1}, to: null}});
    });
  });
});

