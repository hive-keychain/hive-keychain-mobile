import ClaimModule from 'src/background/claim.module';
import {MultisigModule} from './multisig.module';

const init = async () => {
  console.log('Initializing background tasks');
  ClaimModule.start();
  MultisigModule.start();
};

const BackGroundUtils = {
  init,
};

export default BackGroundUtils;
