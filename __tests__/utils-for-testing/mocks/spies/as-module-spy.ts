import * as AuthModule from 'src/utils/hiveAuthenticationService/helpers/auth';
import * as ChallengeModule from 'src/utils/hiveAuthenticationService/helpers/challenge';

export default {
  sendAuth: jest.spyOn(AuthModule, 'sendAuth'),
  challenge: {
    dAppChallenge: jest.spyOn(ChallengeModule, 'dAppChallenge'),
    getChallengeData: jest.spyOn(ChallengeModule, 'getChallengeData'),
  },
};
