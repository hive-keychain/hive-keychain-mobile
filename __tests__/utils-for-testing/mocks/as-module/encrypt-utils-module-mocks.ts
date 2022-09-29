import * as UtilsEncryptModule from 'utils/encrypt';

export default {
  encryptJson: (value: string) =>
    jest.spyOn(UtilsEncryptModule, 'encryptJson').mockReturnValue(value),
};
