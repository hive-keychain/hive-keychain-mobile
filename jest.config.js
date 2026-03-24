module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|@hiveio|hive-tx|hive-uri|hive-keychain-commons|redux-persist|i18n-js|make-plural)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^actions/(.*)$': '<rootDir>/src/actions/$1',
    '^api/(.*)$': '<rootDir>/src/api/$1',
    '^assets/(.*)$': '<rootDir>/src/assets/$1',
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^locales/(.*)$': '<rootDir>/src/locales/$1',
    '^navigators/(.*)$': '<rootDir>/src/navigators/$1',
    '^reducers/(.*)$': '<rootDir>/src/reducers/$1',
    '^screens/(.*)$': '<rootDir>/src/screens/$1',
    '^store$': '<rootDir>/src/store',
    '^utils/(.*)$': '<rootDir>/src/utils/$1',
    '^lists/(.*)$': '<rootDir>/src/lists/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    '\\.svg$': '<rootDir>/__mocks__/svgMock.js',
    '^package\\.json$': '<rootDir>/package.json',
  },
  // Measure layers covered by unit tests (screens/components are not in this suite).
  collectCoverageFrom: [
    'src/utils/**/*.{ts,tsx}',
    'src/actions/**/*.{ts,tsx}',
    'src/reducers/**/*.{ts,tsx}',
    'src/api/**/*.{ts,tsx}',
    'src/store/**/*.{ts,tsx}',
    'src/hooks/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
  ],
  // Not exercised by this Jest suite (native/UI-adjacent or covered via static entrypoints).
  coveragePathIgnorePatterns: [
    '<rootDir>/src/utils/image.utils.ts',
    '<rootDir>/src/utils/hiveAuthenticationService/index.ts',
    '<rootDir>/src/utils/hiveAuthenticationService/payloads.types.ts',
    '<rootDir>/src/utils/hiveAuthenticationService/helpers/',
    '<rootDir>/src/utils/hiveAuthenticationService/messages/',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
      },
    ],
  },
};
