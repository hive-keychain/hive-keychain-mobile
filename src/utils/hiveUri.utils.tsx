import {saveRequestedOperation} from 'actions/hive-uri';
import {Account} from 'actions/interfaces';
import RequestError from 'components/browser/requestOperations/components/RequestError';
import {RequestSuccess} from 'hive-keychain-commons';
import hiveTx from 'hive-tx';
import {DecodeResult, resolveCallback} from 'hive-uri';
import React from 'react';
import {Linking} from 'react-native';
import {RootState, store} from 'store';
import {ModalComponent} from '../enums/modal.enum';
import {buildRequestFromHiveUri, HiveUriOpType} from './hiveUriRequests.utils';
import {validateAuthority} from './keychain.utils';
import {goBack, navigate} from './navigation.utils';

export {HiveUriOpType} from './hiveUriRequests.utils';

const openHttpsCallbackUrl = (callbackUrl: string) => {
  try {
    const parsedCallbackUrl = new URL(callbackUrl);
    if (parsedCallbackUrl.protocol !== 'https:') return;
    Linking.openURL(parsedCallbackUrl.toString());
  } catch {
    return;
  }
};

export const processQRCodeOp = async (
  opType: HiveUriOpType,
  qrRequest: DecodeResult,
) => {
  const request = await buildRequestFromHiveUri(
    opType,
    qrRequest,
    (store.getState() as RootState).activeAccount.name,
  );
  const accounts: Account[] = await store.getState().accounts;
  if (accounts && accounts.length) {
    const validity = validateAuthority(accounts, request);

    if (validity.valid) {
      const payload = {
        request,
        accounts,
        sendResponse: async (response: RequestSuccess) => {
          let res: any;
          if (opType === HiveUriOpType.tx && !qrRequest.params.no_broadcast) {
            const tx = new hiveTx.Transaction(response.result);
            res = await tx.broadcast();
          }
          if (qrRequest?.params?.callback) {
            const callbackUrl = resolveCallback(qrRequest.params.callback, {
              sig:
                opType === HiveUriOpType.msg
                  ? response.result
                  : response.result.signatures || '',
              data: qrRequest,
              id: response.result.tx_id || res?.result?.tx_id,
            });

            openHttpsCallbackUrl(callbackUrl);
          }
        },
        sendError: () => {},
      };
      navigate('ModalScreen', {
        name: ModalComponent.BROADCAST,
        data: payload,
      });
    } else {
      navigate('ModalScreen', {
        name: `Operation_${request.type}`,
        modalContent: (
          <RequestError
            onClose={() => {
              goBack();
            }}
            error={validity.error}
          />
        ),
      });
    }
  } else {
    store.dispatch(saveRequestedOperation(opType, qrRequest));
  }
};
