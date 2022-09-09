import * as ChallengeModule from 'src/utils/hiveAuthenticationService/helpers/challenge';

export default {
  getChallengeData: (data: {challenge: string; pubkey: string}) =>
    jest.spyOn(ChallengeModule, 'getChallengeData').mockResolvedValue(data),
  dAppChallenge: (data: string) =>
    jest.spyOn(ChallengeModule, 'dAppChallenge').mockResolvedValue(data),
};
