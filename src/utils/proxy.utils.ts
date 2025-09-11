import {ExtendedAccount} from '@hiveio/dhive';
import {getClient} from './hive';

const findUserProxy = async (user: ExtendedAccount): Promise<string | null> => {
  const previousChecked: string[] = [user.name!];
  if (user.proxy.length === 0) return null;
  else {
    let proxy = user.proxy;
    do {
      if (previousChecked.includes(proxy)) return null;
      previousChecked.push(proxy);
      proxy = (await getClient().database.getAccounts([proxy]))[0].proxy;
    } while (proxy.length !== 0);
    return previousChecked[previousChecked.length - 1];
  }
};

const ProxyUtils = {findUserProxy};

export default ProxyUtils;
