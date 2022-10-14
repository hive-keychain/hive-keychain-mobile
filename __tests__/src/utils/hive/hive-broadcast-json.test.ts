import {broadcastJson} from 'utils/hive';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import afterEachTest from '__tests__/utils-for-testing/config-test/after-each-test';
import testBroadcastResponse from '__tests__/utils-for-testing/data/response/test-broadcast-response';
import testAccount from '__tests__/utils-for-testing/data/test-account';
import testOperation from '__tests__/utils-for-testing/data/test-operation';
import method from '__tests__/utils-for-testing/helpers/method';
import hiveUtilsMocks from '__tests__/utils-for-testing/mocks/as-module/hive-utils-mocks';
import asModuleSpy from '__tests__/utils-for-testing/mocks/spies/as-module-spy';
afterEachTest.clearAllMocks;
afterAllTest.clearAllMocks;
describe('hive/broadcastJson cases:\n', () => {
  const {sucess: successResponse} = testBroadcastResponse;
  const {active: activeKey, posting: postingKey} = testAccount._default.keys;
  const {name: username} = testAccount._default;
  afterEach(() => {
    method.clearSpies([asModuleSpy.hiveUtils.broadcast]);
  });
  beforeEach(() => {
    hiveUtilsMocks.broadcast(successResponse);
  });
  it('Must call broadcast using json object', async () => {
    const op = testOperation.filter((op) => op[0] === 'custom_json');
    expect(await broadcastJson(activeKey, username, '0001', true, op)).toEqual(
      successResponse,
    );
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(activeKey, [
      [
        'custom_json',
        {
          required_auths: [username],
          required_posting_auths: [],
          json: JSON.stringify(op),
          id: '0001',
        },
      ],
    ]);
  });

  it('Must call broadcast using stringifyed json', async () => {
    const op = JSON.stringify(
      testOperation.filter((op) => op[0] === 'custom_json'),
    );
    expect(await broadcastJson(activeKey, username, '0001', true, op)).toEqual(
      successResponse,
    );
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(activeKey, [
      [
        'custom_json',
        {
          required_auths: [username],
          required_posting_auths: [],
          json: op,
          id: '0001',
        },
      ],
    ]);
  });

  it('Must call broadcast using posting auth', async () => {
    const op = JSON.stringify(
      testOperation.filter((op) => op[0] === 'custom_json'),
    );
    expect(
      await broadcastJson(postingKey, username, '0001', false, op),
    ).toEqual(successResponse);
    expect(asModuleSpy.hiveUtils.broadcast).toBeCalledWith(postingKey, [
      [
        'custom_json',
        {
          required_auths: [],
          required_posting_auths: [username],
          json: op,
          id: '0001',
        },
      ],
    ]);
  });
});
