import {render, screen} from '@testing-library/react-native';
import Hbd from 'assets/wallet/icon_hbd.svg';
import Hive from 'assets/wallet/icon_hive.svg';
import Hp from 'assets/wallet/icon_hp.svg';
import Balance from 'components/operations/Balance';
import React from 'react';
import testRoleImages from '__tests__/utils-for-testing/accesibility/roles/test-role-images';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import method from '__tests__/utils-for-testing/helpers/method';
afterAllTest.clearAllMocks;
describe('hiveReact tests:\n', () => {
  describe('getCurrencyProperties cases with balances:\n', () => {
    it('Must render HP component as default and show HP balance', () => {
      render(
        <Balance currency="other_currency" account={testAccount.extended} />,
      );
      expect(screen.getByText('other_currency')).toBeDefined();
      expect(
        screen.getByText(
          method.formatTestBalance(
            parseFloat(testAccount.extended.vesting_shares as string),
          ),
        ),
      ).toBeDefined();
      expect(
        screen.getByRole(testRoleImages.generalImg).props['data-file-name'],
      ).toEqual(Hp.name);
    });

    it('Must render HIVE component as default and show HIVE balance', () => {
      render(<Balance currency="HIVE" account={testAccount.extended} />);
      expect(screen.getByText('HIVE')).toBeDefined();
      expect(
        screen.getByText(
          method.formatTestBalance(
            parseFloat(testAccount.extended.balance as string),
          ),
        ),
      ).toBeDefined();
      expect(
        screen.getByRole(testRoleImages.generalImg).props['data-file-name'],
      ).toEqual(Hive.name);
    });

    it('Must render HBD component as default and show HBD balance', () => {
      render(<Balance currency="HBD" account={testAccount.extended} />);
      expect(screen.getByText('HBD')).toBeDefined();
      expect(
        screen.getByText(
          method.formatTestBalance(
            parseFloat(testAccount.extended.hbd_balance as string),
          ),
        ),
      ).toBeDefined();
      expect(
        screen.getByRole(testRoleImages.generalImg).props['data-file-name'],
      ).toEqual(Hbd.name);
    });
  });

  describe('getCurrencyProperties cases with no account:\n', () => {
    it('Must render HP component as default and not show HP balance', () => {
      render(<Balance currency="other_currency" />);
      expect(screen.getByText('other_currency')).toBeDefined();
      expect(
        screen.queryByText(
          method.formatTestBalance(
            parseFloat(testAccount.extended.vesting_shares as string),
          ),
        ),
      ).toBeNull();
      expect(
        screen.getByRole(testRoleImages.generalImg).props['data-file-name'],
      ).toEqual(Hp.name);
    });

    it('Must render HIVE component as default and not show HIVE balance', () => {
      render(<Balance currency="HIVE" />);
      expect(screen.getByText('HIVE')).toBeDefined();
      expect(
        screen.queryByText(
          method.formatTestBalance(
            parseFloat(testAccount.extended.balance as string),
          ),
        ),
      ).toBeNull();
      expect(
        screen.getByRole(testRoleImages.generalImg).props['data-file-name'],
      ).toEqual(Hive.name);
    });

    it('Must render HBD component as default and not show HBD balance', () => {
      render(<Balance currency="HBD" />);
      expect(screen.getByText('HBD')).toBeDefined();
      expect(
        screen.queryByText(
          method.formatTestBalance(
            parseFloat(testAccount.extended.hbd_balance as string),
          ),
        ),
      ).toBeNull();
      expect(
        screen.getByRole(testRoleImages.generalImg).props['data-file-name'],
      ).toEqual(Hbd.name);
    });
  });
});
