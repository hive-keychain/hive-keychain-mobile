import { treatHASRequest } from "actions/hiveAuthenticationService";
import { addAccount, addTabFromLinking } from "actions/index";
import * as hiveUri from "hive-uri";
import { CreateAccountFromWalletParamList } from "navigators/mainDrawerStacks/CreateAccount.types";
import { Linking } from "react-native";
import SimpleToast from "react-native-root-toast";
import { RootState, store } from "store";
import isURL from "validator/lib/isURL";
import AccountUtils from "./account.utils";
import { HASConfig } from "./config";
import { HiveUriOpType, processQRCodeOp } from "./hive-uri";
import { KeyUtils } from "./key.utils";
import { validateFromObject } from "./keyValidation";
import { translate } from "./localize";
import { goBack, goBackAndNavigate } from "./navigation";

let flagCurrentlyProcessing = false;
let qrDataAccounts: {
  data: string;
  index: number;
  total: number;
}[] = [];

export default async () => {
  Linking.addEventListener("url", ({ url }) => {
    if (url) {
      handleUrl(url);
    }
  });

  const initialUrl = await Linking.getInitialURL();
  if (initialUrl) {
    handleUrl(initialUrl);
  }
};

export const handleUrl = async (url: string, qr: boolean = false) => {
  if (url.startsWith(HASConfig.protocol)) {
    if (url.startsWith(HASConfig.auth_req)) {
      const buf = Buffer.from(url.replace(HASConfig.auth_req, ""), "base64");
      const data = JSON.parse(buf.toString());
      if (qr) {
        goBack();
      }
      store.dispatch(treatHASRequest(data));
    }
  } else if (url.startsWith("hive://")) {
    if (qr) {
      goBack();
    }
    if (url.startsWith("hive://sign/")) {
      const res = hiveUri.decode(url);
      const opType = url.match(/^hive:\/\/sign\/([^\/]+)/)[1] as HiveUriOpType;
      processQRCodeOp(opType, res);
    }
  } else if (url.startsWith("keychain://create_account=")) {
    const buf = url.replace("keychain://create_account=", "");
    try {
      const data = JSON.parse(Buffer.from(buf, "base64").toString());
      const { n, o, a, p, m } = data;
      goBackAndNavigate("CreateAccountScreen", {
        screen: "CreateAccountFromWalletScreenPageOne",
        params: {
          wallet: true,
          newPeerToPeerData: {
            name: n,
            publicKeys: {
              owner: o,
              active: a,
              posting: p,
              memo: m,
            },
          },
        } as CreateAccountFromWalletParamList["CreateAccountFromWalletScreenPageOne"],
      });
    } catch (error) {
      console.log("Error processing QR Create Accounts data, please check!", {
        error,
      });
    }
  } else if (isURL(url)) {
    if (qr) {
      goBack();
    }
    //@ts-ignore
    store.dispatch(addTabFromLinking(url));
  } else if (url.startsWith("keychain://add_account="))
    [handleAddAccountQR(url)];
  else [handleAddAccountQR(url)];
};

export const handleAddAccountQR = async (data: string, wallet = true) => {
  const obj = JSON.parse(data.replace("keychain://add_account=", ""));
  let keys = {};
  if (
    (obj.keys.activePubkey &&
      KeyUtils.isAuthorizedAccount(obj.keys.activePubkey)) ||
    (obj.keys.postingPubkey &&
      KeyUtils.isAuthorizedAccount(obj.keys.postingPubkey))
  ) {
    const localAccounts = ((await store.getState()) as RootState).accounts;

    for (let i = 0; i < localAccounts.length; i++) {
      const element = localAccounts[i];
      keys = await AccountUtils.addAuthorizedAccount(
        obj.name,
        element.name,
        localAccounts,
        SimpleToast
      );
    }
    if (!KeyUtils.hasKeys(keys)) {
      SimpleToast.show(
        translate("toast.no_accounts_no_auth", { username: obj.name }),
        {
          duration: SimpleToast.durations.LONG,
        }
      );
      return;
    }
  } else {
    keys = await validateFromObject(obj);
  }
  if (wallet && KeyUtils.hasKeys(keys)) {
    store.dispatch<any>(addAccount(obj.name, keys, wallet, true));
  } else {
    return;
  }
};

export const clearLinkingListeners = () => {
  Linking.removeAllListeners("url");
};
