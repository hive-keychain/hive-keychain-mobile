import * as SignModule from 'utils/hiveAuthenticationService/messages/sign';

export default {
  processSigningRequest: jest
    .spyOn(SignModule, 'processSigningRequest')
    .mockResolvedValue(undefined),
};
