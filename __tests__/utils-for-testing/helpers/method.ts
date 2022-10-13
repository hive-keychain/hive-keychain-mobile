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

/**Passing the Obj will stringify + encode as required */
const toBuffer = (data: Object, encoding: BufferEncoding) => {
  return Buffer.from(JSON.stringify(data)).toString(encoding);
};

const formatTestBalance = (parsedValue: number) => {
  return formatBalance(parsedValue);
};

export default {clearSpies, getTestOperation, formatTestBalance, toBuffer};
