import * as AuthModule from 'src/utils/hiveAuthenticationService/helpers/auth';
import * as ChallengeModule from 'src/utils/hiveAuthenticationService/helpers/challenge';
import * as NavigationModule from 'utils/navigation';

export default {
  sendAuth: jest.spyOn(AuthModule, 'sendAuth'),
  challenge: {
    dAppChallenge: jest.spyOn(ChallengeModule, 'dAppChallenge'),
    getChallengeData: jest.spyOn(ChallengeModule, 'getChallengeData'),
  },
  navigation: {
    navigate: jest.spyOn(NavigationModule, 'navigate'),
    goBack: jest.spyOn(NavigationModule, 'goBack'),
  },
};
