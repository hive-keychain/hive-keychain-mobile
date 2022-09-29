import { HAS_AuthDecrypted, HAS_AuthPayload, HAS_ChallengeDecryptedData, HAS_PayloadType } from "utils/hiveAuthenticationService/payloads.types";

export default {
    payload: {
        justUUID: {
            uuid: 'UUID-001',
        } as HAS_AuthPayload,
        full: {
            cmd: HAS_PayloadType.AUTH,
            account: 'account',
            decryptedData: { 
                app: {
                    name: 'name_app',
                    icon: 'icon_path',
                    description: 'description',
                    pubkey: '@theghost1980',
                  },
                  challenge: {
                    key_type: 'key_type',
                    challenge: 'challenge'
                  } as HAS_ChallengeDecryptedData,
            } as HAS_AuthDecrypted,
            token: 'token',
            data: 'data',
            uuid: 'uuid_01',
            expire: 10,
        } as HAS_AuthPayload,
    },
};