import Clipboard from '@react-native-community/clipboard';
import {Account, KeyTypes} from 'actions/interfaces';
import EllipticButton from 'components/form/EllipticButton';
import AddKey from 'components/modals/AddKey';
import Separator from 'components/ui/Separator';
import {MainNavigation, ModalScreenProps} from 'navigators/Root.types';
import React, {useEffect, useState} from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getModalBaseStyle} from 'src/styles/modal';
import {
  button_link_primary_medium,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {KeyUtils} from 'utils/key.utils';
import {translate} from 'utils/localize';
import Icon from './Icon';

type Props = {
  type: KeyTypes;
  account: Account;
  containerStyle: StyleProp<ViewStyle>;
  forgetKey: (username: string, key: KeyTypes) => void;
  navigation: MainNavigation;
  theme: Theme;
};
export default ({
  type,
  account,
  forgetKey,
  containerStyle,
  navigation,
  theme,
}: Props) => {
  if (!account) {
    return null;
  }

  const privateKey = account.keys[type];
  const publicKey = account.keys[`${type}Pubkey` as KeyTypes];
  const [isPKShown, showPK] = useState(false);
  const [isAuthorizedAccount, setIsAuthorizedAccount] = useState(false);

  useEffect(() => {
    if (publicKey) {
      setIsAuthorizedAccount(KeyUtils.isAuthorizedAccount(publicKey));
    }
  }, [publicKey]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      showPK(false);
    });
    return unsubscribe;
  }, [navigation]);

  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, width, height);

  return (
    <View style={containerStyle}>
      <View style={styles.row}>
        <Text style={styles.keyAuthority}>
          {translate('keys.key_type', {
            type: translate(`keys.${type}`),
          })}
          :
        </Text>
        {privateKey && (
          <RemoveKey
            forgetKey={() => {
              forgetKey(account.name, type);
            }}
            theme={theme}
          />
        )}
      </View>
      <Separator height={20} />
      {privateKey ? (
        <>
          <View style={styles.row}>
            <Text style={styles.keyType}>{translate('common.public')}</Text>
          </View>

          <Separator height={5} />

          <CopyKey wif={publicKey} isAuthorizedAccount={isAuthorizedAccount}>
            <Text style={[styles.key, styles.opacity]}>
              {isAuthorizedAccount
                ? translate('keys.using_authorized_account', {
                    authorizedAccount: publicKey,
                  })
                : publicKey.substring(0, 15) +
                  '...' +
                  publicKey.substring(publicKey.length - 15, publicKey.length)}
            </Text>
          </CopyKey>
          <Separator height={20} />
          <View style={styles.row}>
            <Text style={styles.keyType}>{translate('common.private')}</Text>
          </View>
          <Separator height={5} />
          <CopyKey wif={privateKey}>
            <View style={[styles.row, styles.aligned, {height: 40}]}>
              <Text
                style={
                  isPKShown ? [styles.key, styles.opacity] : styles.keyHidden
                }>
                {isPKShown
                  ? privateKey.substring(0, 15) +
                    '...' +
                    privateKey.substring(
                      privateKey.length - 15,
                      privateKey.length,
                    )
                  : hidePrivateKey(privateKey)}
              </Text>
              <ViewKey
                isPKShown={isPKShown}
                toggle={() => {
                  showPK(!isPKShown);
                }}
                theme={theme}
              />
            </View>
          </CopyKey>
        </>
      ) : (
        <View>
          <Separator />
          <EllipticButton
            title={translate('settings.keys.add')}
            style={styles.addKey}
            additionalTextStyle={styles.addKeyText}
            onPress={() => {
              navigation.navigate('ModalScreen', {
                name: 'AddKeyModal',
                modalContent: (
                  <AddKey type={type} name={account.name} theme={theme} />
                ),
                modalContainerStyle: [
                  getModalBaseStyle(theme).roundedTop,
                  styles.paddingHorizontal,
                ],
                fixedHeight: 0.4,
              } as ModalScreenProps);
            }}
          />
          <Separator height={30} />
        </View>
      )}
    </View>
  );
};

const RemoveKey = ({
  forgetKey,
  theme,
}: {
  forgetKey: () => void;
  theme: Theme;
}) => {
  return (
    <Icon
      name={Icons.REMOVE}
      theme={theme}
      onPress={forgetKey}
      color={PRIMARY_RED_COLOR}
    />
  );
};

const CopyKey = ({
  wif,
  children,
  isAuthorizedAccount,
}: {
  wif: string;
  children: JSX.Element;
  isAuthorizedAccount?: boolean;
}) => {
  return isAuthorizedAccount ? (
    children
  ) : (
    <TouchableOpacity
      activeOpacity={1}
      onLongPress={() => {
        Clipboard.setString(wif);
        Toast.show(translate('toast.keys.copied'));
      }}>
      {children}
    </TouchableOpacity>
  );
};
type ViewKeyProps = {toggle: () => void; isPKShown: boolean; theme: Theme};
const ViewKey = ({toggle, isPKShown, theme}: ViewKeyProps) => {
  return (
    <Icon
      name={isPKShown ? Icons.NOT_SEE : Icons.SEE}
      theme={theme}
      color={PRIMARY_RED_COLOR}
      onPress={toggle}
    />
  );
};

const hidePrivateKey = (privateKey: string) => {
  let hiddenKey = '';
  for (let i = 0; i < 15; i++) {
    hiddenKey += '\u25cf ';
  }
  return hiddenKey;
};

const getStyles = (theme: Theme, width: number, height: number) =>
  StyleSheet.create({
    keyAuthority: {
      color: getColors(theme).secondaryText,
      ...button_link_primary_medium,
      fontSize: getFontSizeSmallDevices(
        width,
        {...button_link_primary_medium}.fontSize,
      ),
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    keyType: {
      color: getColors(theme).secondaryText,
      ...button_link_primary_medium,
      fontSize: getFontSizeSmallDevices(width, 13),
    },
    key: {
      color: getColors(theme).secondaryText,
      ...button_link_primary_medium,
      fontSize: 12,
    },
    smallerText: {
      fontSize: 10,
    },
    aligned: {
      alignItems: 'center',
    },
    keyHidden: {
      color: getColors(theme).iconBW,
      fontSize:
        Platform.OS === 'android' ? getFontSizeSmallDevices(width, 20) : 12,
      letterSpacing: Platform.OS === 'android' ? -2 : 0,
    },
    addKey: {
      backgroundColor: getColors(theme).tertiaryCardBgColor,
      borderColor: getColors(theme).septenaryCardBorderColor,
      borderWidth: 1,
    },
    addKeyText: {
      color: getColors(theme).secondaryText,
      ...button_link_primary_medium,
      fontSize: getFontSizeSmallDevices(
        width,
        {...button_link_primary_medium}.fontSize,
      ),
    },
    opacity: {
      opacity: 0.7,
    },
    paddingHorizontal: {
      paddingHorizontal: 16,
    },
  });
