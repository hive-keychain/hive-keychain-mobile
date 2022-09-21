import SimpleToast from 'react-native-simple-toast';
import * as AuthModule from 'src/utils/hiveAuthenticationService/helpers/auth';
import * as ChallengeHelpersModule from 'src/utils/hiveAuthenticationService/helpers/challenge';
import * as AuthenticateModule from 'utils/hiveAuthenticationService/messages/authenticate';
import * as ChallengeMessagesModule from 'utils/hiveAuthenticationService/messages/challenge';
import * as SignModule from 'utils/hiveAuthenticationService/messages/sign';
import * as NavigationModule from 'utils/navigation';
//TODO check twice if the module exists on another folder. i.e: challenge in /helpers & /messages
export default {
  sendAuth: jest.spyOn(AuthModule, 'sendAuth'),
  challenge: {
    helpers: {
      dAppChallenge: jest.spyOn(ChallengeHelpersModule, 'dAppChallenge'),
      getChallengeData: jest.spyOn(ChallengeHelpersModule, 'getChallengeData'),
    },
    messages: {
      processChallengeRequest: jest.spyOn(
        ChallengeMessagesModule,
        'processChallengeRequest',
      ),
    },
  },
  navigation: {
    navigate: jest.spyOn(NavigationModule, 'navigate'),
    goBack: jest.spyOn(NavigationModule, 'goBack'),
  },
  authenticate: {
    processAuthenticationRequest: jest.spyOn(
      AuthenticateModule,
      'processAuthenticationRequest',
    ),
  },
  sign: {
    processSigningRequest: jest.spyOn(SignModule, 'processSigningRequest'),
  },
  simpleToast: {
    show: jest.spyOn(SimpleToast, 'show'),
  },
};
