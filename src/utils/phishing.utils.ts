import KeychainApi from 'api/keychain.api';

const getPhishingAccounts = async () => {
  return (await KeychainApi.get('hive/phishingAccounts')).data;
};

const getBlacklistedDomains = async () => {
  return (await KeychainApi.get('hive/blacklistedDomains')).data;
};

const PhishingUtils = {
  getPhishingAccounts,
  getBlacklistedDomains,
};

export default PhishingUtils;
