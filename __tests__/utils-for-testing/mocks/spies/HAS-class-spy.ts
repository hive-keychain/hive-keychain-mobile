import HAS from "utils/hiveAuthenticationService";
import { HAS_Session } from "utils/hiveAuthenticationService/has.types";

export default {
    findSessionByToken: () => jest.spyOn(HAS, 'findSessionByToken'),
    findSessionByUUID: () => jest.spyOn(HAS, 'findSessionByUUID'),
};