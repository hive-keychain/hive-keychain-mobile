import {encryptJson} from 'utils/encrypt';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import afterEachTest from '__tests__/utils-for-testing/config-test/after-each-test';
import decryptToJsonArray from '__tests__/utils-for-testing/data/array-cases/decrypt-to-json-array';
import testEncrypt from '__tests__/utils-for-testing/data/test-encrypt';
afterAllTest.clearAllMocks;
describe('encrypt tests:\n', () => {
  afterEachTest.clearAllMocks;
  describe('encryptJson cases:\n', () => {
    const {json, pwd, encrypted} = testEncrypt._default;
    it('Must encrypt Json', () => {
      const result = encryptJson(json, pwd);
      console.log(result);
      expect(result.length).toBe(encrypted.length);
      expect(result).toContain(encrypted.containing);
    });
  });
  describe('decryptToJson cases:\n', () => {
    const {cases: toDecrypt} = decryptToJsonArray;
    it('Must pass each case', () => {
      for (let i = 0; i < toDecrypt.length; i++) {
        const element = toDecrypt[i];
        element.assertion(element);
      }
    });
  });
});
