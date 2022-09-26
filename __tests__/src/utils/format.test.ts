import {
  beautifyTransferError,
  capitalize,
  chunkArray,
  formatBalance,
  fromHP,
  getSymbol,
  nFormatter,
  signedNumber,
  toHP,
  withCommas,
} from 'utils/format';
import afterAllTest from '__tests__/utils-for-testing/config-test/after-all-test';
import formatArrays from '__tests__/utils-for-testing/data/array-cases/format-arrays';
import testDynamicGlobalProperties from '__tests__/utils-for-testing/data/test-dynamic-global-properties';
afterAllTest.clearAllMocks;
describe('format tests:\n', () => {
  const {withCommas: amounts, toHP: vests} = formatArrays.cases;
  const {fromHP: hpArray, chunkArray: toChunk} = formatArrays.cases;
  const {signedNumber: toStringSigned} = formatArrays.cases;
  const {formatBalance: toFormatBalance} = formatArrays.cases;
  const {capitalize: toCapitalize} = formatArrays.cases;
  const {beautifyTransferError: toBeautify} = formatArrays.cases;
  const {getSymbol: ToGetSymbol} = formatArrays.cases;
  const {nFormatter: toNFormat} = formatArrays.cases;
  describe('withCommas cases:\n', () => {
    it('Must pass all cases', () => {
      for (let i = 0; i < amounts.length; i++) {
        const element = amounts[i];
        expect(withCommas(element.nb, element.decimals)).toBe(element.expected);
      }
    });
  });
  describe('toHP cases:\n', () => {
    it('Must pass each case:\n', () => {
      for (let i = 0; i < vests.length; i++) {
        const element = vests[i];
        expect(toHP(element.vests, element.globalProps)).toBe(element.expected);
      }
    });
  });
  describe('fromHP cases:\n', () => {
    it('Must pass all cases', () => {
      for (let i = 0; i < hpArray.length; i++) {
        const element = hpArray[i];
        expect(fromHP(element.hp, testDynamicGlobalProperties)).toBe(
          element.expected,
        );
      }
    });
  });
  describe('chunkArray cases', () => {
    it('Must pass each case', () => {
      for (let i = 0; i < toChunk.length; i++) {
        const element = toChunk[i];
        expect(chunkArray(element.myArray, element.chunk_size)).toEqual(
          element.expected,
        );
      }
    });
  });
  describe('signedNumber cases:\n', () => {
    it('Must pass each case', () => {
      for (let i = 0; i < toStringSigned.length; i++) {
        const element = toStringSigned[i];
        expect(signedNumber(element.nb)).toBe(element.expected);
      }
    });
  });
  describe('formatBalance cases:\n', () => {
    it('Must pass all cases', () => {
      for (let i = 0; i < toFormatBalance.length; i++) {
        const element = toFormatBalance[i];
        expect(formatBalance(element.balance)).toBe(element.expected);
      }
    });
  });
  describe('capitalize cases:\n', () => {
    it('Must capitalize each case', () => {
      for (let i = 0; i < toCapitalize.length; i++) {
        const element = toCapitalize[i];
        expect(capitalize(element.string)).toBe(element.expect);
      }
    });
  });
  describe('beautifyTransferError cases:\n', () => {
    it('Must pass each case', () => {
      for (let i = 0; i < toBeautify.length; i++) {
        const element = toBeautify[i];
        expect(beautifyTransferError(element.err, element.params)).toBe(
          element.expect(
            element.params.currency,
            element.params.username,
            element.params.to,
          ),
        );
      }
    });
  });
  describe('getSymbol cases', () => {
    it('Must pass each case', () => {
      for (let i = 0; i < ToGetSymbol.length; i++) {
        const element = ToGetSymbol[i];
        expect(getSymbol(element.nai)).toBe(element.expect);
      }
    });
  });
  describe('nFormatter cases:\n', () => {
    it('Must pass all cases', () => {
      for (let i = 0; i < toNFormat.length; i++) {
        const element = toNFormat[i];
        expect(nFormatter(element.num, element.digits)).toBe(element.expect);
      }
    });
  });
});
