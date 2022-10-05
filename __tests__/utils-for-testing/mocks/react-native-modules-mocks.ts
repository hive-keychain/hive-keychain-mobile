import uuid from 'react-native-uuid';
import testUuidData from '../data/test-uuid-data';

export default {
  uuid: {
    withoutParams: {
      v4: uuid.v4 = jest.fn().mockReturnValue(testUuidData._default),
    },
  },
};
