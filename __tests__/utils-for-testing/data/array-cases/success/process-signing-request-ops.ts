import {HAS_SignDecrypted} from 'utils/hiveAuthenticationService/payloads.types';
import {KeychainKeyTypesLC, KeychainRequestTypes} from 'utils/keychain.types';
import processSigningRequestOpsTemplate from '__tests__/utils-for-testing/data/array-cases/templates/process-signing-request-ops-template';
import testHASSignDecrypted from '__tests__/utils-for-testing/data/test-HAS-signDecrypted';
import testHAS_Session from '__tests__/utils-for-testing/data/test-HAS_Session';
import testOperation from '__tests__/utils-for-testing/data/test-operation';
import objects from '__tests__/utils-for-testing/helpers/objects';
import asModuleSpy from '__tests__/utils-for-testing/mocks/spies/as-module-spy';
import testHAS_SignPayload from '../../test-HAS_SignPayload';

const {_default: session} = testHAS_Session.has_session;
const {_default: opsData} = testHASSignDecrypted; //empty op to be filled by use
const {templateCase: template} = processSigningRequestOpsTemplate;
const {withDataToEncrypt} = testHAS_SignPayload;

const cases = [
  {
    description: 'single op as account_create, default switch case',
    payload: withDataToEncrypt(
      {
        ops: testOperation.filter((op) => op[0] === 'account_create')[0],
        key_type: KeychainKeyTypesLC.active,
      },
      session,
    ),
    toMock: () => {
      const clonedOpsData = objects.clone(opsData) as HAS_SignDecrypted;
      clonedOpsData.ops = [
        testOperation.filter((op) => op[0] === 'account_create')[0],
      ];
      template['mocking'](clonedOpsData);
    },
    toAssert: () => {
      template['assertion']('ModalScreen', KeychainRequestTypes.broadcast);
    },
    toClear: () => template['clear']([asModuleSpy.navigation.navigate]),
  },
  {
    description: 'single op as vote',
    payload: withDataToEncrypt(
      {
        ops: testOperation.filter((op) => op[0] === 'vote')[0],
        key_type: KeychainKeyTypesLC.active,
      },
      session,
    ),
    toMock: async () => {
      const clonedOpsData = objects.clone(opsData) as HAS_SignDecrypted;
      clonedOpsData.ops = [testOperation.filter((op) => op[0] === 'vote')[0]];
      template['mocking'](clonedOpsData);
    },
    toAssert: () => {
      template['assertion']('ModalScreen', KeychainRequestTypes.vote);
    },
    toClear: () => template['clear']([asModuleSpy.navigation.navigate]),
  },
  {
    description: 'single op as comment',
    payload: withDataToEncrypt(
      {
        ops: testOperation.filter((op) => op[0] === 'comment')[0],
        key_type: KeychainKeyTypesLC.active,
      },
      session,
    ),
    toMock: async () => {
      const clonedOpsData = objects.clone(opsData) as HAS_SignDecrypted;
      clonedOpsData.ops = [
        testOperation.filter((op) => op[0] === 'comment')[0],
      ];
      template['mocking'](clonedOpsData);
    },
    toAssert: () => {
      template['assertion']('ModalScreen', KeychainRequestTypes.broadcast);
    },
    toClear: () => template['clear']([asModuleSpy.navigation.navigate]),
  },
  {
    description: 'multiple operations',
    payload: withDataToEncrypt(
      {
        ops: testOperation,
        key_type: KeychainKeyTypesLC.active,
      },
      session,
    ),
    toMock: async () => {
      const clonedOpsData = objects.clone(opsData) as HAS_SignDecrypted;
      clonedOpsData.ops = testOperation;
      template['mocking'](clonedOpsData);
    },
    toAssert: () => {
      template['assertion']('ModalScreen', KeychainRequestTypes.broadcast);
    },
    toClear: () => template['clear']([asModuleSpy.navigation.navigate]),
  },
  {
    description: 'multiple operations whitelisted',
    payload: withDataToEncrypt(
      {
        ops: testOperation,
        key_type: KeychainKeyTypesLC.posting,
      },
      session,
    ),
    toMock: async () => {
      const clonedOpsData = objects.clone(opsData) as HAS_SignDecrypted;
      clonedOpsData.ops = testOperation;
      template['mocking'](clonedOpsData, true);
    },
    toAssert: () => {
      template['assertion'](
        'ModalScreen',
        KeychainRequestTypes.broadcast,
        true,
      );
    },
    toClear: () =>
      template['clear']([
        asModuleSpy.navigation.navigate,
        asModuleSpy.simpleToast.show(),
        asModuleSpy.requestWithoutConfirmation,
      ]),
  },
];

export default {cases};
