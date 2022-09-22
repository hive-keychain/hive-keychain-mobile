import {HAS_State} from 'reducers/hiveAuthenticationService';
import testHAS_Instance from '__tests__/utils-for-testing/data/test-HAS_Instance';
import testHAS_Session from '__tests__/utils-for-testing/data/test-HAS_Session';

export default {
  _default: {
    instances: [testHAS_Instance._default],
    sessions: [testHAS_Session.has_session._default],
  } as HAS_State,
};
