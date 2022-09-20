import * as AuthenticateModule from 'utils/hiveAuthenticationService/messages/authenticate';

export default {
  processAuthenticationRequest: jest
    .spyOn(AuthenticateModule, 'processAuthenticationRequest')
    .mockReturnValue(undefined),
};
