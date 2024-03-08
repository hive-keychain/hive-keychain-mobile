import {addAccount} from 'actions/index';
import QRCode from 'components/qr_code';
import {translate} from 'i18n-js';
import {AddAccFromWalletNavigationProps} from 'navigators/mainDrawerStacks/AddAccount.types';
import React from 'react';
import {BarCodeReadEvent} from 'react-native-camera';
import SimpleToast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {RootState} from 'store';
import {handleAddAccountQR} from 'utils/linking';

const ScanQR = ({
  addAccount,
  localAccounts,
  route,
}: PropsFromRedux & AddAccFromWalletNavigationProps) => {
  const onSuccess = async ({data}: BarCodeReadEvent) => {
    try {
      if (!data.startsWith('keychain://add_account=')) {
        SimpleToast.show(translate('addAccountByQR.wrongQR'), SimpleToast.LONG);
        return;
      } else {
        const wallet = route.params ? route.params.wallet : false;

        handleAddAccountQR(data, wallet);
      }
    } catch (e) {
      console.log(e, data);
    }
  };
  return <QRCode onSuccess={onSuccess} />;
};

const mapStateToProps = (state: RootState) => {
  return {
    localAccounts: state.accounts,
  };
};

const connector = connect(mapStateToProps, {addAccount});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(ScanQR);
