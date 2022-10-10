import {render} from '@testing-library/react-native';
import Balance from 'components/operations/Balance';
import React from 'react';
import {Text, View} from 'react-native';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testAccount from '__tests__/utils-for-testing/data/test-account';
afterAllTest.clearAllMocks;
//test fake greeting component
type Props = {
  msg: string;
};
const Greetings = ({msg}: Props) => {
  return (
    <View>
      <Text>{msg}</Text>
    </View>
  );
};
//end fake

describe('hiveReact tests:\n', () => {
  describe('getCurrencyProperties cases:\n', () => {
    it('Must render HP component as default', () => {
      // StyleSheet.create = jest.fn().mockReturnValue({
      //   display: 'flex',
      //   flexDirection: 'column',
      //   borderRadius: 10,
      //   width: '100%',
      //   backgroundColor: '#DCE4EA',
      //   paddingHorizontal: 100 * 0.05,
      //   paddingVertical: 100 * 0.03,
      // });
      const {debug, getByText} = render(
        <Balance currency="other" account={testAccount.extended} />,
      );
      debug();
    });
  });
});
