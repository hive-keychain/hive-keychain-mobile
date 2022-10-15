import {AuthorityType} from '@hiveio/dhive';

export default {
  _default: {
    emptyAuth: {
      weight_threshold: 100,
      account_auths: [],
      key_auths: [],
    } as AuthorityType,
  },
};
