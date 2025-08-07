import {loadAccount} from 'actions/hive';
import {KeyTypes} from 'actions/interfaces';
import EllipticButton from 'components/form/EllipticButton';
import TwoFaForm from 'components/form/TwoFaForm';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import MultisigCaption from 'components/ui/MultisigCaption';
import Separator from 'components/ui/Separator';
import {useCheckForMultisig} from 'hooks/useCheckForMultisig';
import {ConfirmationPageRoute} from 'navigators/Root.types';
import React, {useState} from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {KeyType} from 'src/interfaces/keys.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {Token} from 'src/interfaces/tokens.interface';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import {spacingStyle} from 'src/styles/spacing';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import {resetStackAndNavigate} from 'utils/navigation';
import ConfirmationCard from './ConfirmationCard';

export type ConfirmationPageProps = {
  onSend: (options: TransactionOptions) => void;
  title: string;
  introText?: string;
  warningText?: string;
  skipWarningTranslation?: boolean;
  data: ConfirmationData[];
  onConfirm?: (options: TransactionOptions) => Promise<void>;
  extraHeader?: React.JSX.Element;
  keyType: KeyType;
};

export enum ConfirmationDataTag {
  AMOUNT = 'amount',
  BALANCE = 'balance',
  USERNAME = 'username',
  OPERATION_TYPE = 'operation_type',
  COLLAPSIBLE = 'COLLAPSIBLE',
  REQUEST_USERNAME = 'REQUEST_USERNAME',
  SWAP = 'SWAP',
}

export type ConfirmationData = {
  title: string;
  value: string;
  tag?: ConfirmationDataTag;
  currency?: string;
  currentBalance?: string;
  amount?: string;
  finalBalance?: string;
  tokenInfo?: Token;
  hidden?: string;
  startToken?: string;
  endToken?: string;
  estimateValue?: number;
  slippage?: number;
};

const ConfirmationPage = ({
  route,
  loadAccount,
  user,
  colors,
  tokens,
}: {
  route: ConfirmationPageRoute;
} & PropsFromRedux) => {
  const {
    onSend,
    title,
    introText,
    warningText,
    keyType,
    data,
    skipWarningTranslation,
    onConfirm: onConfirmOverride,
    extraHeader,
  } = route.params;
  const [loading, setLoading] = useState(false);

  const {width, height} = useWindowDimensions();
  const {theme} = useThemeContext();
  const styles = getDimensionedStyles({width, height}, theme);
  const [isMultisig, twoFABots, setTwoFABots] = useCheckForMultisig(
    keyType?.toUpperCase() as KeyTypes,
    user,
  );

  const onConfirm = async () => {
    setLoading(true);
    Keyboard.dismiss();
    if (onConfirmOverride) {
      await onConfirmOverride({
        metaData: {twoFACodes: twoFABots},
        multisig: isMultisig,
      });
    } else {
      await onSend({metaData: {twoFACodes: twoFABots}, multisig: isMultisig});
      console.log('user.name', user.name, loadAccount);
      loadAccount(user.name, true);
    }
    setLoading(false);
    resetStackAndNavigate('WALLET');
  };

  return (
    <Background
      theme={theme}
      skipTop
      skipBottom
      additionalBgSvgImageStyle={{bottom: -initialWindowMetrics.insets.bottom}}>
      <ScrollView contentContainerStyle={styles.confirmationPage}>
        {extraHeader}
        {isMultisig && <MultisigCaption />}
        <Caption text={title} hideSeparator />

        {warningText && (
          <Caption
            text={warningText}
            hideSeparator
            textStyle={styles.warningText}
            skipTranslation={skipWarningTranslation}
          />
        )}
        <ConfirmationCard data={data} tokens={tokens} colors={colors} />

        <Separator />
        <TwoFaForm twoFABots={twoFABots} setTwoFABots={setTwoFABots} />
        <View style={spacingStyle.fillSpace}></View>
        <Separator />
        <EllipticButton
          title={translate('common.confirm')}
          onPress={onConfirm}
          isLoading={loading}
          isWarningButton
        />
      </ScrollView>
    </Background>
  );
};

const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    confirmationPage: {
      flexGrow: 1,
      marginBottom: 16,
      paddingHorizontal: 16,
    },

    warningText: {
      color: PRIMARY_RED_COLOR,
      marginTop: -10,
    },
  });

const connector = connect(
  (state: RootState) => ({
    user: state.activeAccount,
    colors: state.colors,
    tokens: state.tokens,
  }),
  {
    loadAccount,
  },
);

type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(ConfirmationPage);
