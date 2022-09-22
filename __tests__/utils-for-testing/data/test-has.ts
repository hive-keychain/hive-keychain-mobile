import HAS from 'utils/hiveAuthenticationService';
import testHost from '__tests__/utils-for-testing/data/test-Host';

export default {
  _default: new HAS(testHost._default),
};
