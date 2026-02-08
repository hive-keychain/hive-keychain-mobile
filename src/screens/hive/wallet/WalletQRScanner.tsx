import {NavigationProp, RouteProp, useRoute} from '@react-navigation/native';
import {addAccount} from 'actions/index';
import {Account} from 'actions/interfaces';
import QRCode from 'components/qr_code';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Loader from 'components/ui/Loader';
import {BarcodeScanningResult} from 'expo-camera';
import React, {useRef, useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import SimpleToast from 'react-native-root-toast';
import {useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {RootState, store} from 'store';
import AccountUtils from 'utils/account.utils';
import {KeyUtils} from 'utils/key.utils';
import {validateFromObject} from 'utils/keyValidation.utils';
import {handleAddAccountQR, handleUrl} from 'utils/linking.utils';
import {translate} from 'utils/localize';

type AnyWalletQRRoute = RouteProp<
  Record<string, {wallet?: boolean} | undefined>,
  string
>;

const WalletQRScanner = ({navigation}: {navigation: NavigationProp<any>}) => {
  const route = useRoute<AnyWalletQRRoute>();
  const {theme} = useThemeContext();
  const [processingAccounts, setProcessingAccounts] = useState(false);
  const [qrDataAccounts, setQrDataAccounts] = useState<Account[]>([]);
  const [acctPageTotal, setAcctPageTotal] = useState(0);
  const [scannedPages, setScannedPages] = useState(0);
  const [currentImportingPage, setCurrentImportingPage] = useState(0);
  const scannedPageTimestampsRef = useRef<Map<number, number>>(new Map());
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
          const expectedPageIndex = scannedPages + 1;
          if (expectedPageIndex !== dataAccounts.index) {
            // Only show "already_scanned" if it was scanned more than 3 seconds ago
            if (expectedPageIndex > dataAccounts.index) {
              const lastScannedTime = scannedPageTimestampsRef.current.get(
                dataAccounts.index,
              );
              const now = Date.now();
              if (lastScannedTime && now - lastScannedTime > 5000) {
                SimpleToast.show(
                  translate('toast.export_qr_accounts.already_scanned', {
                    page: expectedPageIndex,
                  }),
                );
              }
              return;
            } else {
              SimpleToast.show(
                translate('toast.export_qr_accounts.scan_page_first', {
                  page: expectedPageIndex,
                }),
              );
              return;
            }
          }

          const acc = [...qrDataAccounts, ...dataAccounts.data];
          setQrDataAccounts(acc);
          const newScannedPages = scannedPages + 1;
          setScannedPages(newScannedPages);
          // Track when this page was scanned
          scannedPageTimestampsRef.current.set(dataAccounts.index, Date.now());
          if (dataAccounts.total > 1 && newScannedPages < dataAccounts.total) {
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
        handleAddAccountQR(data, wallet, true);
      } else handleUrl(data, true);
    } catch (e) {
      console.log(e, data);
    }
  };

  const handleAddAccountsQR = async (
    qrDataAccounts: Account[],
    wallet = true,
  ) => {
    for (let i = 0; i < qrDataAccounts.length; i++) {
      const dataAcc = qrDataAccounts[i];
      // Calculate which page we're currently importing (pages contain 2 accounts each)
      const currentPage = Math.floor(i / 2) + 1;
      setCurrentImportingPage(currentPage);

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
    setScannedPages(0);
    setAcctPageTotal(0);
    setCurrentImportingPage(0);
    scannedPageTimestampsRef.current.clear();
    navigation.goBack();
  };

  const isScanningMultipleAccounts =
    acctPageTotal > 0 && scannedPages < acctPageTotal && !processingAccounts;

  if (processingAccounts) {
    return (
      <>
        <FocusAwareStatusBar />
        <Background theme={theme} containerStyle={styles.loadingContainer}>
          <Loader animating size="large" />
          <Text
            style={[styles.loadingText, {color: getColors(theme).primaryText}]}>
            {translate('toast.export_qr_accounts.importing', {
              page: currentImportingPage,
              total: acctPageTotal,
            })}
          </Text>
        </Background>
      </>
    );
  }

  return (
    <>
      <FocusAwareStatusBar />
      <QRCode
        onSuccess={onSuccess}
        allowMultipleScans={isScanningMultipleAccounts}
        scanDebounceMs={isScanningMultipleAccounts ? 500 : 2000}
        topContent={
          acctPageTotal > 0 && !processingAccounts ? (
            <Text
              style={{textAlign: 'center', fontWeight: 'bold', fontSize: 16}}>
              {translate('components.export_qr_accounts.scanning', {
                page: scannedPages + 1,
                total: acctPageTotal,
              })}
            </Text>
          ) : null
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default WalletQRScanner;
