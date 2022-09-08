import HAS from "utils/hiveAuthenticationService";
import { HAS_Session } from "utils/hiveAuthenticationService/has.types";

export default {
    findSessionByUUID: (value: HAS_Session) => HAS.findSessionByUUID = jest.fn().mockReturnValue(value),  
    findSessionByToken: (value: HAS_Session | undefined) => HAS.findSessionByToken = jest.fn().mockReturnValue(value),
};