import {KeyTypes} from 'actions/interfaces';
import {addPreference} from 'actions/preferences';
import CheckBoxPanel from 'components/form/CheckBoxPanel';
import OperationButton from 'components/form/EllipticButton';
import TwoFaForm from 'components/form/TwoFaForm';
import {ConfirmationData} from 'components/operations/Confirmation';
import ConfirmationCard from 'components/operations/ConfirmationCard';
import MultisigCaption from 'components/ui/MultisigCaption';
import Separator from 'components/ui/Separator';
import {useDomainCheck} from 'hooks/domainCheck';
import {useCheckForMultisig} from 'hooks/useCheckForMultisig';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, View, useWindowDimensions} from 'react-native';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import SimpleToast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {getButtonHeight, getButtonStyle} from 'src/styles/button';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getCaptionStyle} from 'src/styles/text';
import {title_primary_body_2} from 'src/styles/typography';
import {RootState} from 'store';
import {urlTransformer} from 'utils/browser';
import {beautifyErrorMessage} from 'utils/keychain';
import {
  HiveErrorMessage,
  KeychainRequest,
  KeychainRequestTypes,
  RequestError,
  RequestId,
  RequestSuccess,
} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import {goBack} from 'utils/navigation';
import RequestMessage from './RequestMessage';

type Props = {
  confirmationData?: ConfirmationData[];
  has?: boolean;
  closeGracefully: () => void;
  sendResponse: (msg: RequestSuccess, keep?: boolean) => void;
  sendError: (msg: RequestError) => void;
  message?: string;
  method?: KeyTypes;
  request: KeychainRequest & RequestId;
  successMessage: string;
  errorMessage?:
    | string
    | ((
        msg: HiveErrorMessage,
        data: {currency?: string; username?: string; to?: string},
      ) => string);
  performOperation: (options: TransactionOptions) => any;
  additionalData?: object;
  beautifyError?: boolean;
  selectedUsername?: string;
  RequestUsername?: () => JSX.Element;
} & TypesFromRedux;

const RequestOperation = ({
  closeGracefully,
  sendResponse,
  sendError,
  message,
  method,
  request,
  successMessage,
  errorMessage,
  performOperation,
  additionalData = {},
  beautifyError,
  addPreference,
  selectedUsername,
  has,
  accounts,
  confirmationData,
  colors,
  tokens,
  RequestUsername,
}: Props) => {
  const {theme} = useThemeContext();
  const {request_id, ...data} = request;
  const [loading, setLoading] = useState(false);
  const [keep, setKeep] = useState(false);
  let {domain, type, username} = data;
  domain = has ? domain : urlTransformer(domain).hostname;
  const width = useWindowDimensions().width;
  const domainHeader = useDomainCheck(request);
  const [isMultisig, twoFABots, setTwoFABots] = useCheckForMultisig(
    method,
    undefined,
    selectedUsername || username,
    accounts,
  );

  const styles = getStyles(theme, width);

  const renderRequestSummary = () => (
    <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}}>
      <View style={{flex: 1}}>
        {domainHeader && (
          <RequestMessage
            message={domainHeader}
            additionalTextStyle={[
              getCaptionStyle(width, theme),
              {paddingHorizontal: 10, marginTop: 0, color: PRIMARY_RED_COLOR},
            ]}
          />
        )}
        {message && message.length > 0 && (
          <RequestMessage
            message={message}
            additionalTextStyle={[
              getCaptionStyle(width, theme),
              {paddingHorizontal: 10, marginTop: 0},
            ]}
          />
        )}
        {isMultisig && <MultisigCaption />}

        <ConfirmationCard
          data={confirmationData}
          tokens={tokens}
          colors={colors}
          request={request}
          accounts={accounts}
          RequestUsername={RequestUsername}
        />
        <TwoFaForm twoFABots={twoFABots} setTwoFABots={setTwoFABots} />
        {method !== KeyTypes.active &&
        !!domain &&
        type !== KeychainRequestTypes.addAccount ? (
          <View style={styles.keep}>
            <CheckBoxPanel
              smallText
              checked={keep}
              onPress={() => {
                setKeep(!keep);
              }}
              title={translate(`request.keep${has ? '_has' : ''}`, {
                domain,
                username: username || selectedUsername,
                type,
              })}
              containerStyle={{paddingRight: 16, flex: 1, flexGrow: 1}}
              skipTranslation
            />
          </View>
        ) : (
          <></>
        )}
      </View>
      <OperationButton
        style={[getButtonStyle(theme).warningStyleButton, styles.button]}
        additionalTextStyle={[styles.text, styles.whiteText]}
        title={translate('request.confirm')}
        isLoading={loading}
        onPress={async () => {
          setLoading(true);
          let msg: string;
          try {
            const result = await Promise.race([
              performOperation({
                metaData: {twoFACodes: twoFABots},
                multisig: isMultisig,
                fromWallet: false,
              }),
              new Promise((_, reject) =>
                setTimeout(() => reject('REQ_TIMEOUT'), 30000),
              ),
            ]);
            if (result && result.error) throw result.error;
            msg = successMessage;
            const obj = {
              data,
              request_id,
              result,
              message: msg,
              ...additionalData,
            };
            if (selectedUsername) obj.data.username = selectedUsername;
            if (keep && !has) {
              addPreference(username, domain, type);
            }
            sendResponse(obj, keep);
          } catch (e) {
            console.log('error', e);
            if (e === 'REQ_TIMEOUT') {
              msg = isMultisig
                ? translate('multisig.pending')
                : translate('request.error.timeout');
            } else {
              if (!beautifyError) {
                if (typeof errorMessage === 'function') {
                  msg = errorMessage(e as any, data);
                } else {
                  msg = errorMessage;
                }
              } else {
                msg = beautifyErrorMessage(e as any);
              }
            }
            sendError({
              data,
              request_id,
              error: e === 'timeout' ? 'pending_multisig' : {},
              message: msg,
            });
          } finally {
            goBack();
            SimpleToast.show(msg, SimpleToast.LONG);
          }
          setLoading(false);
        }}
      />
      <Separator height={initialWindowMetrics.insets.bottom} />
    </ScrollView>
  );

  return renderRequestSummary();
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    keep: {marginTop: 16, flexDirection: 'row'},
    text: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
    },
    button: {marginTop: 16, marginBottom: 16, height: getButtonHeight(width)},
    whiteText: {color: '#FFF'},

    container: {
      paddingHorizontal: 12,
      flexGrow: 1,
    },
    bgColor: {
      backgroundColor: getColors(theme).icon,
    },
  });
const connector = connect(
  (state: RootState) => ({
    accounts: state.accounts,
    tokens: state.tokens,
    colors: state.colors,
  }),
  {
    addPreference,
  },
);
type TypesFromRedux = ConnectedProps<typeof connector>;
export default connector(RequestOperation);

// Without confirmation :

// signTx

export const processOperationWithoutConfirmation = async (
  performOperation: () => void,
  request: KeychainRequest & RequestId,
  sendResponse: (msg: RequestSuccess, keep?: boolean) => void,
  sendError: (msg: RequestError) => void,
  beautifyError: boolean,
  successMessage?: string,
  errorMessage?: string,
  additionalData?: any,
) => {
  const {request_id, ...data} = request;
  try {
    const result = await performOperation();
    let msg = successMessage;
    const obj = {
      data,
      request_id,
      result,
      message: msg,
      ...additionalData,
    };
    sendResponse(obj);
  } catch (e) {
    let msg;
    if (!beautifyError) {
      // if (typeof errorMessage === 'function') {
      //   msg = errorMessage(e, data);
      // } else {
      msg = errorMessage;
      //}
    } else {
      msg = beautifyErrorMessage(e as any);
    }
    sendError({data, request_id, error: {}, message: msg});
  }
};
