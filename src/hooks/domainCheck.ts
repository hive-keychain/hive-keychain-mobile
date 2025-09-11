import {KeychainRequest} from 'hive-keychain-commons';
import {useEffect, useState} from 'react';
import {urlTransformer} from 'utils/browser.utils';
import {translate} from 'utils/localize';
import PhishingUtils from 'utils/phishing.utils';

export const useDomainCheck = (data: KeychainRequest & any) => {
  const [header, setHeader] = useState<string | undefined>(undefined);
  useEffect(() => {
    PhishingUtils.getBlacklistedDomains().then((domains) => {
      let warning;
      const {hostname, hash, pathname} = urlTransformer(data.domain);
      let domain;
      if (domains.includes(hostname)) domain = hostname;
      if (domains.includes(hostname + pathname)) domain = hostname + pathname;
      if (domains.includes(hostname + hash)) domain = hostname + hash;
      if (domains.includes(hostname + '/' + hash))
        domain = hostname + '/' + hash;
      if (domain) {
        warning = translate('wallet.operations.phishing_domain', {
          domain,
        });
      }
      setHeader(warning ? warning : undefined);
    });
  }, []);
  return header;
};
