import * as ChallengeHelpersModule from 'src/utils/hiveAuthenticationService/helpers/challenge';
import * as ChallengeMessagesModule from 'utils/hiveAuthenticationService/messages/challenge';

interface Challenge {
  key_type: string;
  challenge: string;
  name: string;
}

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
    prepareRegistrationChallenge: (challenge: Challenge) =>
      jest
        .spyOn(ChallengeHelpersModule, 'prepareRegistrationChallenge')
        .mockResolvedValue(challenge),
  },
  processChallengeRequest: {
    processChallengeRequest: jest
      .spyOn(ChallengeMessagesModule, 'processChallengeRequest')
      .mockReturnValue(undefined),
  },
};
