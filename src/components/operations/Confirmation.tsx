import {loadAccount} from 'actions/index';
import EllipticButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import Background from 'components/ui/Background';
import {Caption} from 'components/ui/Caption';
import Separator from 'components/ui/Separator';
import {ConfirmationPageRoute} from 'navigators/Root.types';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {KeyType} from 'src/interfaces/keys.interface';
import {TransactionOptions} from 'src/interfaces/multisig.interface';
import {getButtonHeight} from 'src/styles/button';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {spacingStyle} from 'src/styles/spacing';
import {getFormFontStyle} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {KeyUtils} from 'utils/key.utils';
import {KeychainKeyTypes, KeychainKeyTypesLC} from 'utils/keychain.types';
import {translate} from 'utils/localize';
import {MultisigUtils} from 'utils/multisig.utils';
import {resetStackAndNavigate} from 'utils/navigation';
const LOGO_MULTISIG = require('assets/wallet/multisig.png');

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

type ConfirmationData = {
  title: string;
  value: string;
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
  const [isMultisig, setIsMultisig] = useState(false);
  const [twoFABots, setTwoFABots] = useState<{[botName: string]: string}>({});

  const {width, height} = useWindowDimensions();
  const {theme} = useThemeContext();
  const styles = getDimensionedStyles({width, height}, theme);

  useEffect(() => {
    checkForMultsig();
  }, []);

  const checkForMultsig = async () => {
    let useMultisig = false;
    switch (keyType) {
      case KeyType.ACTIVE: {
        if (user.keys.active) {
          useMultisig = KeyUtils.isUsingMultisig(
            user.keys.active,
            user.account,
            user.keys.activePubkey?.startsWith('@')
              ? user.keys.activePubkey.replace('@', '')
              : user.account.name,
            keyType.toLowerCase() as KeychainKeyTypesLC,
          );
          setIsMultisig(useMultisig);
          if (useMultisig) {
            const accounts = await MultisigUtils.get2FAAccounts(
              user.account,
              KeychainKeyTypes.active,
            );

            accounts.forEach((acc) =>
              setTwoFABots((old) => {
                return {...old, [acc]: ''};
              }),
            );
          }
        }
        break;
      }
      case KeyType.POSTING: {
        if (user.keys.posting) {
          useMultisig = KeyUtils.isUsingMultisig(
            user.keys.posting,
            user.account,
            user.keys.postingPubkey?.startsWith('@')
              ? user.keys.postingPubkey.replace('@', '')
              : user.account.name,
            keyType.toLowerCase() as KeychainKeyTypesLC,
          );
          setIsMultisig(useMultisig);

          if (useMultisig) {
            const accounts = await MultisigUtils.get2FAAccounts(
              user.account,
              KeychainKeyTypes.posting,
            );
            accounts.forEach((acc) =>
              setTwoFABots((old) => {
                return {...old, [acc]: ''};
              }),
            );
          }
        }
        break;
      }
    }
  };

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
        {isMultisig && (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 15,
            }}>
            <Image
              source={LOGO_MULTISIG}
              style={{width: 50, height: 30, marginTop: 10}}
            />
            <Caption text={'multisig.disclaimer_message'} hideSeparator />
          </View>
        )}
        <Caption text={title} hideSeparator />

        {warningText && (
          <Caption
            text={warningText}
            hideSeparator
            skipTranslation={skipWarningTranslation}
          />
        )}
        <View style={[getCardStyle(theme).defaultCardItem, {marginBottom: 0}]}>
          {data.map((e, i) => (
            <>
              <View style={[styles.justifyCenter, styles.confirmItem]}>
                <View style={[styles.flexRowBetween, styles.width95]}>
                  <Text style={[getFormFontStyle(width, theme).title]}>
                    {translate(e.title)}
                  </Text>
                  <Text
                    style={[
                      getFormFontStyle(width, theme).title,
                      styles.textContent,
                    ]}>
                    {e.value}
                  </Text>
                </View>
                {i !== data.length - 1 && (
                  <Separator
                    drawLine
                    height={0.5}
                    additionalLineStyle={styles.bottomLine}
                  />
                )}
              </View>
            </>
          ))}
        </View>
        <Separator />
        {twoFABots && Object.keys(twoFABots).length > 0 && (
          <View style={{flex: 1}}>
            {Object.entries(twoFABots).map(([botName, code]) => (
              <OperationInput
                keyboardType="numeric"
                labelInput={translate('multisig.bot_two_fa_code', {
                  account: user.name,
                })}
                value={code}
                onChangeText={(value) => {
                  setTwoFABots((old) => {
                    return {...old, [botName]: value};
                  });
                }}
              />
            ))}
          </View>
        )}
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
  });

const connector = connect((state: RootState) => ({user: state.activeAccount}), {
  loadAccount,
});

type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(ConfirmationPage);
