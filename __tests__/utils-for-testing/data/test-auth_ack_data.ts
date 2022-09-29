import { HAS_AuthChallengeData } from "utils/hiveAuthenticationService/payloads.types";

export default {
    _default: {
        token: 'token',
  expire: 10,
  challenge: {pubkey: '@theghost1980', challenge: 'challenge'},
    } as HAS_AuthChallengeData,
};