import {
  downloadTokenBackgroundColors,
  getTokenBackgroundColor,
} from '../colors.utils';
import {Theme} from 'src/context/theme.context';
import keychain from 'api/keychain.api';

jest.mock('api/keychain.api');

describe('colors.utils', () => {
  describe('downloadTokenBackgroundColors', () => {
    it('should download token background colors from API', async () => {
      const mockColors = {
        HIVE: '#000000',
        HBD: '#FFFFFF',
      };
      (keychain.get as jest.Mock).mockResolvedValueOnce({
        data: mockColors,
      });

      const result = await downloadTokenBackgroundColors();
      expect(result).toEqual(mockColors);
      expect(keychain.get).toHaveBeenCalledWith('hive/tokensBackgroundColors');
    });
  });

  describe('getTokenBackgroundColor', () => {
    const colors = {
      HIVE: '#000000',
      HBD: '#FFFFFF',
    };

    it('should return color with opacity for light theme', () => {
      const result = getTokenBackgroundColor(colors, 'HIVE', Theme.LIGHT);
      expect(result).toContain('#000000');
    });

    it('should return color with opacity for dark theme', () => {
      const result = getTokenBackgroundColor(colors, 'HBD', Theme.DARK);
      expect(result).toContain('#FFFFFF');
    });

    it('should handle missing token symbol', () => {
      const result = getTokenBackgroundColor(colors, 'UNKNOWN', Theme.LIGHT);
      // When symbol is missing, colors['UNKNOWN'] is undefined, so result is undefined + opacity
      expect(result).toContain('undefined');
    });

    it('should return color with opacity appended', () => {
      const result = getTokenBackgroundColor(colors, 'HIVE', Theme.LIGHT);
      // Should contain the color and opacity value
      expect(result).toContain('#000000');
      expect(result.length).toBeGreaterThan('#000000'.length);
    });

    it('should handle different themes', () => {
      const lightResult = getTokenBackgroundColor(colors, 'HIVE', Theme.LIGHT);
      const darkResult = getTokenBackgroundColor(colors, 'HIVE', Theme.DARK);
      // Different themes should have different opacity values
      expect(lightResult).not.toBe(darkResult);
    });

    it('should handle empty colors object', () => {
      const emptyColors = {};
      const result = getTokenBackgroundColor(emptyColors, 'HIVE', Theme.LIGHT);
      expect(result).toContain('undefined');
    });

    it('should handle empty string symbol', () => {
      const result = getTokenBackgroundColor(colors, '', Theme.LIGHT);
      expect(result).toContain('undefined');
    });
  });

  describe('downloadTokenBackgroundColors', () => {
    it('should handle API errors gracefully', async () => {
      (keychain.get as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
      await expect(downloadTokenBackgroundColors()).rejects.toThrow();
    });

    it('should handle empty response', async () => {
      (keychain.get as jest.Mock).mockResolvedValueOnce({data: {}});
      const result = await downloadTokenBackgroundColors();
      expect(result).toEqual({});
    });

    it('should handle response with multiple colors', async () => {
      const mockColors = {
        HIVE: '#000000',
        HBD: '#FFFFFF',
        LARYNX: '#FF0000',
        BEE: '#00FF00',
      };
      (keychain.get as jest.Mock).mockResolvedValueOnce({data: mockColors});
      const result = await downloadTokenBackgroundColors();
      expect(result).toEqual(mockColors);
      expect(Object.keys(result)).toHaveLength(4);
    });
  });
});

