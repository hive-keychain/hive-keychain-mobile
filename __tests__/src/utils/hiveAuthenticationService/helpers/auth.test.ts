import { SessionTime } from "components/hive_authentication_service/Auth";
import HAS from "utils/hiveAuthenticationService";
import { HAS_Session } from "utils/hiveAuthenticationService/has.types";
import { answerAuthReq } from "utils/hiveAuthenticationService/helpers/auth";
import { HAS_AuthPayload } from "utils/hiveAuthenticationService/payloads.types";
import { waitFor } from '@testing-library/react-native';
import testHas from "__tests__/utils-for-testing/data/test-has";
import hasSpy from "__tests__/utils-for-testing/mocks/spies/has-spy";
import testHASAuthPayload from "__tests__/utils-for-testing/data/test-HAS-auth-payload";
import testHAS_Session from "__tests__/utils-for-testing/data/test-HAS_Session";
import callbackSpy from "__tests__/utils-for-testing/mocks/spies/callback-spy";
import mockHASClass from "__tests__/utils-for-testing/mocks/mock-HAS-class";
import HASClassSpy from "__tests__/utils-for-testing/mocks/spies/HAS-class-spy";
describe('auth tests:\n', () => {  
    describe('answerAuthReq cases:\n', () => { 
        const { payload } = testHASAuthPayload;
        const { has_session } = testHAS_Session;
        it('Must call send and callback', async() => {
            mockHASClass.findSessionByToken(has_session.justUUID);
            await answerAuthReq(testHas._default,payload.justUUID, false, SessionTime.HOUR, callbackSpy.empty);
            await waitFor(() => {
                expect(hasSpy.send).toBeCalledWith(JSON.stringify({cmd: 'auth_nack', uuid: has_session.justUUID.uuid })); 
                expect(callbackSpy.empty).toBeCalledTimes(1);
            });
        });
        it('Must call findSessionByUUID', async() => {
            mockHASClass.findSessionByToken(undefined);
            mockHASClass.findSessionByUUID(has_session.justUUID);
            await answerAuthReq(testHas._default,payload.justUUID, false, SessionTime.HOUR, callbackSpy.empty);
            await waitFor(() => {
                expect(HASClassSpy.findSessionByUUID()).toBeCalledWith(has_session.justUUID.uuid);
                expect(hasSpy.send).toBeCalledWith(JSON.stringify({cmd: 'auth_nack', uuid: has_session.justUUID.uuid })); 
                expect(callbackSpy.empty).toBeCalledTimes(1);
            });
        });
     })
});