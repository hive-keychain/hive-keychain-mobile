import React from 'react';
import {Platform} from 'react-native';
import {PlatformsUtils} from '../platforms.utils';

describe('PlatformsUtils', () => {
  describe('showDependingOnPlatform', () => {
    const TestElement = React.createElement('div', null, 'Test');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return element when platform matches', () => {
      const result = PlatformsUtils.showDependingOnPlatform(TestElement, [
        Platform.OS,
      ]);
      expect(result).toBe(TestElement);
    });

    it('should return null when platform does not match', () => {
      const otherPlatform = Platform.OS === 'ios' ? 'android' : 'ios';
      const result = PlatformsUtils.showDependingOnPlatform(TestElement, [
        otherPlatform as any,
      ]);
      expect(result).toBeNull();
    });

    it('should return element when platform is in array', () => {
      const result = PlatformsUtils.showDependingOnPlatform(TestElement, [
        'ios',
        'android',
        Platform.OS,
      ]);
      expect(result).toBe(TestElement);
    });

    it('should return null for empty array', () => {
      const result = PlatformsUtils.showDependingOnPlatform(TestElement, []);
      expect(result).toBeNull();
    });

    it('should handle null show array', () => {
      const result = PlatformsUtils.showDependingOnPlatform(
        TestElement,
        null as any,
      );
      expect(result).toBeNull();
    });

    it('should handle undefined show array', () => {
      const result = PlatformsUtils.showDependingOnPlatform(
        TestElement,
        undefined as any,
      );
      expect(result).toBeNull();
    });

    it('should return null when platform is not in array', () => {
      const result = PlatformsUtils.showDependingOnPlatform(TestElement, [
        'web',
        'windows',
      ]);
      expect(result).toBeNull();
    });

    it('should handle multiple platforms in array', () => {
      const result = PlatformsUtils.showDependingOnPlatform(TestElement, [
        'ios',
        'android',
        'web',
      ]);
      // Should return element if current platform is ios or android
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        expect(result).toBe(TestElement);
      } else {
        expect(result).toBeNull();
      }
    });
  });
});
