import {loadAccount} from 'actions/index';
import {KeyTypes} from 'actions/interfaces';
import EllipticButton from 'components/form/EllipticButton';
import TwoFaForm from 'components/form/TwoFaForm';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import MultisigCaption from 'components/ui/MultisigCaption';
import Separator from 'components/ui/Separator';
import UsernameWithAvatar from 'components/ui/UsernameWithAvatar';
import {useCheckForMultisig} from 'hooks/useCheckForMultisig';
import {ConfirmationPageRoute} from 'navigators/Root.types';
import React, {useState} from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import Icon from 'src/components/hive/Icon';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {KeyType} from 'src/interfaces/keys.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {getButtonHeight} from 'src/styles/button';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {spacingStyle} from 'src/styles/spacing';
import {getFormFontStyle} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import {resetStackAndNavigate} from 'utils/navigation';

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
}

export type ConfirmationData = {
  title: string;
  value: string;
  tag?: string;
  currency?: string;
  currentBalance?: number;
  amount?: number;
  finalBalance?: number;
};

export const createBalanceData = (
  title: string,
  currentBalance: number,
  amount: number,
  currency: string,
): ConfirmationData => {
  const finalBalance = Number((currentBalance - amount).toFixed(3));
  return {
    title,
    value: `${currentBalance} ${currency}`,
    tag: ConfirmationDataTag.BALANCE,
    currency,
    currentBalance,
    amount,
    finalBalance,
  };
};

const renderConfirmationValue = (
  e: ConfirmationData,
  width: number,
  theme: Theme,
  styles: any,
) => {
  switch (e.tag) {
    case ConfirmationDataTag.USERNAME:
      return <UsernameWithAvatar username={e.value} />;
    case ConfirmationDataTag.AMOUNT:
      return (
        <Text
          style={[getFormFontStyle(width, theme).title, styles.textContent]}>
          {e.value + ` ${e.currency ? e.currency : ''}`}
        </Text>
      );
    case ConfirmationDataTag.BALANCE:
      if (
        e.currentBalance !== undefined &&
        e.amount !== undefined &&
        e.finalBalance !== undefined
      ) {
        const isInsufficient = e.finalBalance < 0;
        return (
          <View style={styles.balanceRow}>
            <Text
              style={[
                getFormFontStyle(width, theme).title,
                styles.textContent,
                styles.opaque,
              ]}>
              {`${e.currentBalance} ${e.currency || ''}`}
            </Text>
            <Icon
              name={Icons.ARROW_RIGHT_BROWSER}
              additionalContainerStyle={styles.arrowIcon}
              width={20}
              height={20}
            />
            <Text
              style={[
                getFormFontStyle(width, theme).title,
                styles.textContent,
                styles.opaque,
              ]}>
              {isInsufficient ? (
                <Text style={styles.errorText}>Insufficient Balance</Text>
              ) : (
                `${e.finalBalance} ${e.currency || ''}`
              )}
            </Text>
          </View>
        );
      }
      return (
        <Text
          style={[getFormFontStyle(width, theme).title, styles.textContent]}>
          {e.value + ` ${e.currency ? e.currency : ''}`}
        </Text>
      );
    default:
      return (
        <Text
          style={[getFormFontStyle(width, theme).title, styles.textContent]}>
          {e.value}
        </Text>
      );
  }
};

const ConfirmationPage = ({
  route,
  loadAccount,
  user,
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
      loadAccount(user.name, true);
    }
    setLoading(false);
    resetStackAndNavigate('WALLET');
  };

  return (
    <Background theme={theme}>
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
        <View style={[getCardStyle(theme).defaultCardItem, {marginBottom: 0}]}>
          {data.map((e, i) => (
            <React.Fragment key={`${e.title}-${i}`}>
              <View style={[styles.justifyCenter, styles.confirmItem]}>
                <View style={[styles.flexRowBetween, styles.width95]}>
                  <Text style={[getFormFontStyle(width, theme).title]}>
                    {translate(e.title)}
                  </Text>
                  {renderConfirmationValue(e, width, theme, styles)}
                </View>
                {i !== data.length - 1 && (
                  <Separator
                    drawLine
                    height={0.5}
                    additionalLineStyle={styles.bottomLine}
                  />
                )}
              </View>
            </React.Fragment>
          ))}
        </View>
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
        <Separator />
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
    confirmItem: {
      marginVertical: 8,
    },
    warning: {color: 'red'},
    flexRowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    info: {
      opacity: 0.7,
    },
    textContent: {
      color: getColors(theme).senaryText,
    },
    bottomLine: {
      width: '100%',
      borderColor: getColors(theme).secondaryLineSeparatorStroke,
      margin: 0,
      marginTop: 12,
    },
    width95: {
      width: '95%',
    },
    justifyCenter: {justifyContent: 'center', alignItems: 'center'},
    operationButton: {
      marginHorizontal: 0,
      height: getButtonHeight(width),
    },
    operationButtonConfirmation: {
      backgroundColor: '#FFF',
    },
    paddingHorizontal: {
      paddingHorizontal: 18,
    },
    warningText: {
      color: PRIMARY_RED_COLOR,
      marginTop: -10,
    },
    balanceRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    arrowIcon: {
      marginHorizontal: 8,
    },
    opaque: {
      opacity: 0.7,
    },
    errorText: {
      color: PRIMARY_RED_COLOR,
    },
  });

const connector = connect((state: RootState) => ({user: state.activeAccount}), {
  loadAccount,
});

type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(ConfirmationPage);
