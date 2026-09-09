import {render} from '@testing-library/react-native';
import React from 'react';
import CustomInput from '../CustomInput';
import OperationInput from '../OperationInput';

jest.mock('../CustomInput', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

const getLastCustomInputProps = () =>
  (CustomInput as jest.Mock).mock.calls.at(-1)?.[0];

describe('OperationInput', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('forwards default text assistance settings to the native input wrapper', () => {
    render(<OperationInput value="" onChangeText={jest.fn()} />);

    expect(getLastCustomInputProps()).toEqual(
      expect.objectContaining({
        autoComplete: 'off',
        autoCapitalize: 'none',
        autoCorrect: false,
      }),
    );
  });

  it('forwards caller-provided text assistance settings', () => {
    render(
      <OperationInput
        value=""
        onChangeText={jest.fn()}
        autoComplete="email"
        autoCapitalize="words"
        autoCorrect
      />,
    );

    expect(getLastCustomInputProps()).toEqual(
      expect.objectContaining({
        autoComplete: 'email',
        autoCapitalize: 'words',
        autoCorrect: true,
      }),
    );
  });
});
