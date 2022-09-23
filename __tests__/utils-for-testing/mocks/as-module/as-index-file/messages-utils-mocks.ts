import * as MessagesUtilsModule from 'utils/hiveAuthenticationService/messages';

export default {
  onMessageReceived: jest
    .spyOn(MessagesUtilsModule, 'onMessageReceived')
    .mockResolvedValue(undefined),
};
