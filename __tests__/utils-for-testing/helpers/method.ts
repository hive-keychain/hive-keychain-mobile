import {OperationName, VirtualOperationName} from '@hiveio/dhive';
import testOperation from '../data/test-operation';

const clearSpies = (spies: jest.SpyInstance[]) => {
  spies.forEach((spy) => spy.mockClear());
};

const getTestOperation = (
  operationName: OperationName | VirtualOperationName,
) => {
  return testOperation.filter((op) => op[0] === operationName)[0][1];
};

export default {clearSpies, getTestOperation};
