import {decryptToJson} from 'utils/encrypt';
import testDecryptToJson from '__tests__/utils-for-testing/data/test-decryptToJson';
import consoleSpy from '__tests__/utils-for-testing/mocks/spies/console-spy';

const cases = [
  {
    description: 'good data',
    msg: testDecryptToJson.msg,
    pwd: testDecryptToJson.pwd,
    assertion: (element: any) =>
      expect(decryptToJson(element.msg, element.pwd)).toEqual(
        testDecryptToJson.originalData,
      ),
  },
  {
    description: 'bad password',
    msg: testDecryptToJson.msg,
    pwd: testDecryptToJson.pwd + '__=',
    error: new Error('Malformed UTF-8 data'),
    assertion: (element: any) => {
      try {
        decryptToJson(element.msg, element.pwd);
      } catch (error) {
        expect(consoleSpy.log).toBeCalledWith(element.error!);
      }
    },
  },
  {
    description: 'bad msg',
    msg: testDecryptToJson.msg + '__corrupted',
    pwd: testDecryptToJson.pwd,
    error: new Error('Malformed UTF-8 data'),
    assertion: (element: any) => {
      try {
        decryptToJson(element.msg, element.pwd);
      } catch (error) {
        expect(consoleSpy.log).toBeCalledWith(element.error!);
      }
    },
  },
];

export default {cases};
