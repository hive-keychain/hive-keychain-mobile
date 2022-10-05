import {
  Operation,
  OperationName,
  RecurrentTransferOperation,
  TransferOperation,
  VirtualOperationName,
} from '@hiveio/dhive';
import method from '__tests__/utils-for-testing/helpers/method';
import * as HiveUtilsModule from 'utils/hive';
import testBroadcastResponse from '../../response/test-broadcast-response';
import testAccount from '../../test-account';
import asModuleSpy from '__tests__/utils-for-testing/mocks/spies/as-module-spy';
import {BroadcastTestsSuccessResponse} from '__tests__/utils-for-testing/interface/broadcast-response';
import testOperation from '../../test-operation';

const {active} = testAccount._default.keys;

const cases = [
  {
    description: '',
    assertion: async (successResponse: BroadcastTestsSuccessResponse) => {
      const op = method.getTestOperation('transfer') as TransferOperation;
      const {[1]: obj} = op;
      expect(await HiveUtilsModule['transfer'](active, obj)).toBe(
        successResponse,
      );
      expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(active, [
        ['transfer', obj],
      ]);
    },
  },
  {
    assertion: async (successResponse: BroadcastTestsSuccessResponse) => {
      const op = method.getTestOperation(
        'recurrent_transfer',
      ) as RecurrentTransferOperation;
      const {[1]: obj} = op;
      expect(await HiveUtilsModule['recurrentTransfer'](active, obj)).toBe(
        successResponse,
      );
      expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(active, [
        ['recurrent_transfer', obj],
      ]);
    },
  },
  //TODO keep adding rest of cases
];
export default {cases};
