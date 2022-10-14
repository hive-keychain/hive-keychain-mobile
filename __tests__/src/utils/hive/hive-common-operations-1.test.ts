import {
  CollateralizedConvertOperation,
  ConvertOperation,
  DelegateVestingSharesOperation,
  RecurrentTransferOperation,
  TransferFromSavingsOperation,
  TransferOperation,
  TransferToSavingsOperation,
  TransferToVestingOperation,
  WithdrawVestingOperation,
} from '@hiveio/dhive';
import {
  collateralizedConvert,
  convert,
  delegate,
  depositToSavings,
  powerDown,
  powerUp,
  recurrentTransfer,
  transfer,
  withdrawFromSavings,
} from 'utils/hive';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import afterEachTest from '__tests__/utils-for-testing/config-test/after-each-test';
import testBroadcastResponse from '__tests__/utils-for-testing/data/response/test-broadcast-response';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import method from '__tests__/utils-for-testing/helpers/method';
import hiveUtilsMocks from '__tests__/utils-for-testing/mocks/as-module/hive-utils-mocks';
import asModuleSpy from '__tests__/utils-for-testing/mocks/spies/as-module-spy';
afterEachTest.clearAllMocks;
afterAllTest.clearAllMocks;
describe('hive/common operation cases part 1:\n', () => {
  const {sucess: successResponse} = testBroadcastResponse;
  const {active: activeKey} = testAccount._default.keys;
  afterEach(() => {
    method.clearSpies([asModuleSpy.hiveUtils.broadcast]);
  });
  beforeEach(() => {
    hiveUtilsMocks.broadcast(successResponse);
  });
  it('Must call broadcast on successful transfer', async () => {
    const operation = method.getTestOperation('transfer') as TransferOperation;
    const {[1]: transferOpData} = operation;
    expect(await transfer(activeKey, transferOpData)).toBe(successResponse);
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(activeKey, [
      ['transfer', transferOpData],
    ]);
  });

  it('Must call broadcast on successful recurrent transfer', async () => {
    const operation = method.getTestOperation(
      'recurrent_transfer',
    ) as RecurrentTransferOperation;
    const {[1]: recurrentTransferOpData} = operation;
    expect(await recurrentTransfer(activeKey, recurrentTransferOpData)).toBe(
      successResponse,
    );
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(activeKey, [
      ['recurrent_transfer', recurrentTransferOpData],
    ]);
  });

  it('Must call broadcast on successful powerUp', async () => {
    const operation = method.getTestOperation(
      'transfer_to_vesting',
    ) as TransferToVestingOperation;
    const {[1]: powerUpOpData} = operation;
    expect(await powerUp(activeKey, powerUpOpData)).toBe(successResponse);
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(activeKey, [
      ['transfer_to_vesting', powerUpOpData],
    ]);
  });

  it('Must call broadcast on successful powerDown', async () => {
    const operation = method.getTestOperation(
      'withdraw_vesting',
    ) as WithdrawVestingOperation;
    const {[1]: powerDownOpData} = operation;
    expect(await powerDown(activeKey, powerDownOpData)).toBe(successResponse);
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(activeKey, [
      ['withdraw_vesting', powerDownOpData],
    ]);
  });

  it('Must call broadcast on successful delegation', async () => {
    const operation = method.getTestOperation(
      'delegate_vesting_shares',
    ) as DelegateVestingSharesOperation;
    const {[1]: delegationOpData} = operation;
    expect(await delegate(activeKey, delegationOpData)).toBe(successResponse);
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(activeKey, [
      ['delegate_vesting_shares', delegationOpData],
    ]);
  });

  it('Must call broadcast on successful convert', async () => {
    const operation = method.getTestOperation('convert') as ConvertOperation;
    const {[1]: convertOpData} = operation;
    expect(await convert(activeKey, convertOpData)).toBe(successResponse);
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(activeKey, [
      ['convert', convertOpData],
    ]);
  });

  it('Must call broadcast on successful collateralized convert', async () => {
    const operation = method.getTestOperation(
      'collateralized_convert',
    ) as CollateralizedConvertOperation;
    const {[1]: collateralizedConvertOpData} = operation;
    expect(
      await collateralizedConvert(activeKey, collateralizedConvertOpData),
    ).toBe(successResponse);
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(activeKey, [
      ['collateralized_convert', collateralizedConvertOpData],
    ]);
  });

  it('Must call broadcast on successful deposit to savings', async () => {
    const operation = method.getTestOperation(
      'transfer_to_savings',
    ) as TransferToSavingsOperation;
    const {[1]: transferToSavingsOpData} = operation;
    expect(await depositToSavings(activeKey, transferToSavingsOpData)).toBe(
      successResponse,
    );
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(activeKey, [
      ['transfer_to_savings', transferToSavingsOpData],
    ]);
  });

  it('Must call broadcast on successful withdraw from savings', async () => {
    const operation = method.getTestOperation(
      'transfer_from_savings',
    ) as TransferFromSavingsOperation;
    const {[1]: transferFromSavingsOpData} = operation;
    expect(
      await withdrawFromSavings(activeKey, transferFromSavingsOpData),
    ).toBe(successResponse);
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(activeKey, [
      ['transfer_from_savings', transferFromSavingsOpData],
    ]);
  });
});
