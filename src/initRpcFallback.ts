import {registerRpcFailureHandler} from 'utils/hiveLibs.utils';
import {useWorkingRPC} from 'utils/rpcSwitcher.utils';

registerRpcFailureHandler(useWorkingRPC);
