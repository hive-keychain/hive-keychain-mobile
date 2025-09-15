import {RouteProp, useRoute} from '@react-navigation/native';
import {addAccount} from 'actions/index';
import {Account} from 'actions/interfaces';
import QRCode from 'components/qr_code';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import {BarcodeScanningResult} from 'expo-camera';
import React, {useState} from 'react';
import {Text} from 'react-native';
import SimpleToast from 'react-native-root-toast';
import {RootState, store} from 'store';
import AccountUtils from 'utils/account.utils';
import {KeyUtils} from 'utils/key.utils';
import {validateFromObject} from 'utils/keyValidation.utils';
import {handleAddAccountQR, handleUrl} from 'utils/linking.utils';
import {translate} from 'utils/localize';
import {resetStackAndNavigate} from 'utils/navigation.utils';

type AnyWalletQRRoute = RouteProp<
  Record<string, {wallet?: boolean} | undefined>,
  string
>;

const WalletQRScanner = () => {
  const route = useRoute<AnyWalletQRRoute>();
  const [processingAccounts, setProcessingAccounts] = useState(false);
  const [qrDataAccounts, setQrDataAccounts] = useState<Account[]>([]);
  const [acctPageTotal, setAcctPageTotal] = useState(0);
  const onSuccess = async ({data}: BarcodeScanningResult) => {
    try {
      if (data.startsWith('keychain://add_accounts=')) {
        if (processingAccounts) {
          return;
        }
        const accountData = data.replace('keychain://add_accounts=', '');
        const accountDataStr = Buffer.from(accountData, 'base64').toString();
        try {
          const dataAccounts = JSON.parse(accountDataStr);
          setAcctPageTotal(dataAccounts.total);
          if (qrDataAccounts.length / 2 + 1 !== dataAccounts.index) {
            SimpleToast.show(
              translate(
                `toast.export_qr_accounts.${
                  qrDataAccounts.length / 2 + 1 < dataAccounts.index
                    ? 'scan_page_first'
                    : 'already_scanned'
                }`,
                {
                  page: qrDataAccounts.length / 2 + 1,
                },
              ),
            );
            return;
          }

          const acc = [...qrDataAccounts, ...dataAccounts.data];
          setQrDataAccounts(acc);
          if (
            dataAccounts.total > 1 &&
            qrDataAccounts.length < dataAccounts.total
          ) {
            SimpleToast.show(
              translate('toast.export_qr_accounts.scan_next', {
                index: dataAccounts.index,
                total: dataAccounts.total,
              }),
            );
          }
          if (dataAccounts.total === dataAccounts.index) {
            SimpleToast.show(
              translate('toast.export_qr_accounts.scan_completed'),
            );
            handleAddAccountsQR(acc);
            setProcessingAccounts(true);
          }
        } catch (error) {
          console.log('Error getting QR data accounts', {error});
        }
      } else if (data.startsWith('keychain://add_account=')) {
        const wallet = route.params ? route.params.wallet : false;
        handleAddAccountQR(data, wallet);
      } else handleUrl(data, true);
    } catch (e) {
      console.log(e, data);
    }
  };

  const handleAddAccountsQR = async (
    qrDataAccounts: Account[],
    wallet = true,
  ) => {
    for (const dataAcc of qrDataAccounts) {
      let keys = {};
      if (
        (dataAcc.keys.activePubkey &&
          KeyUtils.isAuthorizedAccount(dataAcc.keys.activePubkey)) ||
        (dataAcc.keys.postingPubkey &&
          KeyUtils.isAuthorizedAccount(dataAcc.keys.postingPubkey))
      ) {
        const localAccounts = ((await store.getState()) as RootState).accounts;
        const authorizedAccount = dataAcc.keys.activePubkey?.startsWith('@')
          ? dataAcc.keys.activePubkey?.replace('@', '')
          : dataAcc.keys.postingPubkey?.replace('@', '');
        const regularKeys = await validateFromObject({
          name: dataAcc.name,
          keys: {
            posting: !dataAcc.keys.postingPubkey && dataAcc.keys.posting,
            active: !dataAcc.keys.activePubkey && dataAcc.keys.active,
            memo: dataAcc.keys.memo,
          },
        });
        let authorizedKeys;
        try {
          authorizedKeys = await AccountUtils.addAuthorizedAccount(
            dataAcc.name,
            authorizedAccount,
            localAccounts,
          );
        } catch (e) {
          SimpleToast.show(e.message, {
            duration: SimpleToast.durations.LONG,
          });
          continue;
        }
        keys = {...authorizedKeys, ...regularKeys};
        if (!KeyUtils.hasKeys(keys)) {
          SimpleToast.show(
            translate('toast.no_accounts_no_auth', {username: dataAcc.name}),
            {
              duration: SimpleToast.durations.LONG,
            },
          );
          continue;
        }
      } else {
        keys = await validateFromObject(dataAcc);
      }
      if (wallet && KeyUtils.hasKeys(keys)) {
        store.dispatch<any>(addAccount(dataAcc.name, keys, false, false, true));
      }
    }
    setQrDataAccounts([]);
    setProcessingAccounts(false);
    return resetStackAndNavigate('Wallet');
  };

  return (
    <>
      <FocusAwareStatusBar />
      <QRCode
        onSuccess={onSuccess}
        topContent={
          acctPageTotal > 0 && !processingAccounts ? (
            <Text
              style={{textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>
              {translate('components.export_qr_accounts.scanning', {
                page: qrDataAccounts.length / 2 + 1,
                total: acctPageTotal,
              })}
            </Text>
          ) : null
        }
      />
    </>
  );
};

export default WalletQRScanner;
