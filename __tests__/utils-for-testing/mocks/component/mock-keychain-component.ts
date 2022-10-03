import * as UtilsKeychainComponent from 'utils/keychain';

interface ValidityErrorUndefined {
  valid: boolean;
  error?: undefined;
}

interface ValidityErrorString {
  valid: boolean;
  error: string;
}

export default {
  validateAuthority: (
    validity: ValidityErrorUndefined | ValidityErrorString,
  ) => {
    jest
      .spyOn(UtilsKeychainComponent, 'validateAuthority')
      .mockReturnValue(validity);
  },
};
