import {OperationName, VirtualOperationName} from '@hiveio/dhive';
import {formatBalance} from 'utils/format';
import testOperation from '../data/test-operation';

const clearSpies = (spies: jest.SpyInstance[]) => {
  spies.forEach((spy) => spy.mockClear());
};

const getTestOperation = (
  operationName: OperationName | VirtualOperationName,
) => {
  return testOperation.filter((op) => op[0] === operationName)[0];
};

const formatTestBalance = (parsedValue: number) => {
  return formatBalance(parsedValue);
};

export default {clearSpies, getTestOperation, formatTestBalance};
