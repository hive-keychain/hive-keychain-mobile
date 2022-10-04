import {
  BroadcastTestsErrorResponse,
  BroadcastTestsSuccessResponse,
} from '__tests__/utils-for-testing/interface/broadcast-response';

const sucess = {
  id: 1000,
  jsonrpc: 'jsonRPC',
  result: {
    tx_id: '0b122c488d680c67a5eebd078252dda9eb2ce34c',
    status: 'completed',
  },
} as BroadcastTestsSuccessResponse;

const error = {
  error: {msg: 'Error'},
} as BroadcastTestsErrorResponse;

export default {sucess, error};
