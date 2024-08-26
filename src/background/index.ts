import ClaimModule from 'src/background/claim.module';
import AutoStakeTokensModule from './auto-stake-tokens.module';

const init = async (list: any[]) => {
  console.log('Initializing background tasks');
  ClaimModule.start();
  AutoStakeTokensModule.start(list);
};

const BackGroundUtils = {
  init,
};

export default BackGroundUtils;
