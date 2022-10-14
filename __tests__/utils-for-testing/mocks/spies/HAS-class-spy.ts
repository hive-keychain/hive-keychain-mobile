import HAS from 'utils/hiveAuthenticationService';
export default {
  findSessionByToken: () => jest.spyOn(HAS, 'findSessionByToken'),
  findSessionByUUID: () => jest.spyOn(HAS, 'findSessionByUUID'),
};
