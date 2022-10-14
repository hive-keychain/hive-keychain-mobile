import testAccount from '../../test-account';
//TODO remove when finished cases on hive tests
const {active} = testAccount._default.keys;

const cases = [
  // {
  //   description: '',
  //   assertion: async (successResponse: BroadcastTestsSuccessResponse) => {
  //     const op = method.getTestOperation('transfer') as TransferOperation;
  //     const {[1]: obj} = op;
  //     expect(await HiveUtilsModule['transfer'](active, obj)).toBe(
  //       successResponse,
  //     );
  //     expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(active, [
  //       ['transfer', obj],
  //     ]);
  //   },
  // },
  // {
  //   assertion: async (successResponse: BroadcastTestsSuccessResponse) => {
  //     const op = method.getTestOperation(
  //       'recurrent_transfer',
  //     ) as RecurrentTransferOperation;
  //     const {[1]: obj} = op;
  //     expect(await HiveUtilsModule['recurrentTransfer'](active, obj)).toBe(
  //       successResponse,
  //     );
  //     expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(active, [
  //       ['recurrent_transfer', obj],
  //     ]);
  //   },
  // },
  '',
];
export default {cases};
