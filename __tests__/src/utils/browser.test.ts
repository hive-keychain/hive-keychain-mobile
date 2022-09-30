import {urlTransformer} from 'utils/browser';
import browserUrlArray from '__tests__/utils-for-testing/data/array-cases/browser-url-array';
describe('browser tests:\n', () => {
  describe('urlTransformer cases:\n', () => {
    const {cases: url} = browserUrlArray;
    it('Must pass each case', () => {
      for (let i = 0; i < url.length; i++) {
        const element = url[i];
        expect(urlTransformer(element.urlString)).toEqual(element.expected);
      }
    });
  });
});
