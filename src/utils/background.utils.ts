import ClaimModule from 'src/background/claim.module';

const init = async () => {
  //just for initialize & test //TODO remove block
  //   await AsyncStorage.multiRemove([
  //     KeychainStorageKeyEnum.CLAIM_ACCOUNTS,
  //     KeychainStorageKeyEnum.CLAIM_REWARDS,
  //     KeychainStorageKeyEnum.CLAIM_SAVINGS,
  //   ]);
  //end
  console.log('Initializing background tasks');
  ClaimModule.start();
};

const BackGroundUtils = {
  init,
};

export default BackGroundUtils;
