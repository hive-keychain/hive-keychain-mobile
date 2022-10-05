import dataInitialMocks from '../utils-for-testing/config-test/data-initial-mocks';
/**
 * Intended as test of initial configuration.
 */

describe('data-initial-mocks tests:\n', () => {
  it('Must check on initial values/files', () => {
    const jestSetup = require('jest.setup');
    const jestConfig = require('jest.config');
    const initialData = dataInitialMocks;
    const {jest, engines, scripts} = require('package.json');
    expect(jestSetup).not.toBeNull();
    expect(jestConfig).not.toBeNull();
    expect(initialData.configuration).toBeDefined();
    expect(initialData.configuration.firstTest).toBe(true);
    expect(initialData.configuration.allConfigurationTested).toBe(true);
    expect(jestConfig.preset).toBeDefined();
    expect(jestConfig.preset).toBe('react-native');
    expect(engines.node).toBeDefined();
    expect(scripts['show-on-error-notes']).toBeDefined();
  });
});
