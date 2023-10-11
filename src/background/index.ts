import ClaimModule from 'src/background/claim.module';

const init = async () => {
  console.log('Initializing background tasks');
  ClaimModule.start();
};

const BackGroundUtils = {
  init,
};

export default BackGroundUtils;
