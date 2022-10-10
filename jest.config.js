module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$',
  testPathIgnorePatterns: ['\\.snap$', '<rootDir>/node_modules/'],
  transformIgnorePatterns: ['node_modules/?!(static-container)'],
  //cacheDirectory: '.jest/cache',
  // globals: {
  //   'ts-jest': {
  //     isolatedModules: true,
  //   },
  // },
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.svg$': 'jest-svg-transformer',
  },
  clearMocks: false,
  modulePathIgnorePatterns: ['utils-for-testing', 'mocks', 'othercases'],
  setupFilesAfterEnv: [
    './jest.setup.js',
    //'./node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/node_modules/**'],
};
