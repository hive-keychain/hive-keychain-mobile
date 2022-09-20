import * as ChallengeHelpersModule from 'src/utils/hiveAuthenticationService/helpers/challenge';
import * as ChallengeMessagesModule from 'utils/hiveAuthenticationService/messages/challenge';

export default {
  helpers: {
    getChallengeData: (data: {challenge: string; pubkey: string}) =>
      jest
        .spyOn(ChallengeHelpersModule, 'getChallengeData')
        .mockResolvedValue(data),
    dAppChallenge: (data: string) =>
      jest
        .spyOn(ChallengeHelpersModule, 'dAppChallenge')
        .mockResolvedValue(data),
  },
  processChallengeRequest: {
    processChallengeRequest: jest
      .spyOn(ChallengeMessagesModule, 'processChallengeRequest')
      .mockReturnValue(undefined),
  },
};
