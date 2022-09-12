import * as AuthUtilsModule from 'utils/hiveAuthenticationService/helpers/auth';

export default {
  sendAuth: jest
    .spyOn(AuthUtilsModule, 'sendAuth')
    .mockResolvedValue(undefined),
};
