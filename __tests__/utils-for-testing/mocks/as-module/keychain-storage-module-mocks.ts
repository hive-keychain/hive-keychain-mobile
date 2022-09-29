import * as KeychainStorageModule from 'utils/keychainStorage';

export default {
  saveOnKeychain: (error: boolean) => {
    if (error) {
      jest
        .spyOn(KeychainStorageModule, 'saveOnKeychain')
        .mockRejectedValue(error);
    } else {
      jest
        .spyOn(KeychainStorageModule, 'saveOnKeychain')
        .mockResolvedValue(undefined);
    }
  },
};
