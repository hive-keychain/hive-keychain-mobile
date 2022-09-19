import { HAS_ActionsTypes } from "actions/types";
import HAS from "utils/hiveAuthenticationService";
import { HAS_PayloadType } from "utils/hiveAuthenticationService/payloads.types";
import consoleSpy from "__tests__/utils-for-testing/mocks/spies/console-spy";
import hasSpy from "__tests__/utils-for-testing/mocks/spies/has-spy";
import storeSpy from "__tests__/utils-for-testing/mocks/spies/store-spy";
import testAccount from "../../test-account";

const cases = [
    {
        webSocketEvent: { data: {cmd: HAS_PayloadType.CONNECTED}} as WebSocketMessageEvent,
        assertion: (result: any) => {
            expect(result).toBeUndefined();
        },
    },
    {
        webSocketEvent: { data: {cmd: HAS_PayloadType.ERROR}} as WebSocketMessageEvent,
        assertion: (result: any, event: WebSocketMessageEvent) => {
            expect(result).toBeUndefined();
            expect(consoleSpy.log).toBeCalledWith('HAS error', event.data);
        },
    },
    {
        webSocketEvent: { data: {cmd: HAS_PayloadType.REGISTER, account: testAccount._default.name}} as WebSocketMessageEvent,
        assertion: (result: any, event: WebSocketMessageEvent, has: HAS) => {
            expect(result).toBeUndefined();
            expect(consoleSpy.log).toBeCalledWith('HAS register_ack', event.data);
            expect(has.awaitingRegistration.length).toBe(1);
        },
    },
    {
        webSocketEvent: { data: {cmd: HAS_PayloadType.KEY_ACK, key: testAccount._default.keys.activePubkey}} as WebSocketMessageEvent,
        assertion: (result: any, event: WebSocketMessageEvent, has: HAS) => {
            expect(result).toBeUndefined();
            //TODO find a way to mock the store actions or pass the data it needs.
            expect(storeSpy.dispatch).toBeCalledWith({
                payload: {host: has.host, server_key: event.data.key }, 
                type: HAS_ActionsTypes.ADD_SERVER_KEY
            });
            expect(hasSpy.registerAccounts).toBeCalledWith('');
            expect(has.awaitingRegistration.length).toBe(1);
        },
    },
];

export default { cases };