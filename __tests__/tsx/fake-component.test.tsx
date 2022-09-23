import {render, screen, waitFor} from '@testing-library/react-native';
import React from 'react';
import {showHASInitRequest} from 'utils/hiveAuthenticationService';
import testHAS_State from '__tests__/utils-for-testing/data/test-HAS_State';
import FakeComponent from './fake-component';
describe('fake tests;\n', () => {
  it.skip('Must ----', async () => {
    render(<FakeComponent />);
    await waitFor(() => {
      screen.debug();
      expect(showHASInitRequest(testHAS_State._default)).toBeUndefined();
    });
  });
});
