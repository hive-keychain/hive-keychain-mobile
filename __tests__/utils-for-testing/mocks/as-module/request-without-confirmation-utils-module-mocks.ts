import * as RequestWithoutConfirmationUtilsModule from 'utils/requestWithoutConfirmation';

export default {
  requestWithoutConfirmation: jest
    .spyOn(RequestWithoutConfirmationUtilsModule, 'requestWithoutConfirmation')
    .mockImplementation((...args) => {}),
};
