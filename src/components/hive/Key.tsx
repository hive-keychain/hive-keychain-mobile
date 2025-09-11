import {Account, KeyTypes} from 'actions/interfaces';
import EllipticButton from 'components/form/EllipticButton';
import AddKey from 'components/modals/AddKey';
import {WrongKeysOnUser} from 'components/popups/wrong-key/WrongKeyPopup';
import CustomToolTip from 'components/ui/CustomToolTip';
import Separator from 'components/ui/Separator';
import * as Clipboard from 'expo-clipboard';
import {FormatUtils} from 'hive-keychain-commons';
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
import Toast from 'react-native-root-toast';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {
  BLACK_OVERLAY_TRANSPARENT,
  PRIMARY_RED_COLOR,
  getColors,
} from 'src/styles/colors';
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
  wrongKeysFound?: WrongKeysOnUser;
};
export default ({
  type,
  account,
  forgetKey,
  containerStyle,
  navigation,
  theme,
  wrongKeysFound,
}: Props) => {
  if (!account) {
    return null;
  }

  const privateKey = account.keys?.[type];
  const publicKey = account.keys?.[`${type}Pubkey` as KeyTypes];
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

  const getIsWrongKey = () => {
    if (
      wrongKeysFound &&
      Object.keys(wrongKeysFound).length &&
      wrongKeysFound.hasOwnProperty(account.name)
    ) {
      return wrongKeysFound[account.name].includes(type.toString());
    }
    return false;
  };

  return (
    <View style={containerStyle}>
      <View style={styles.row}>
        <View style={styles.rowKey}>
          <Text style={styles.keyAuthority}>
            {translate('keys.key_type', {
              type: translate(`keys.${type}`),
            })}
            :
          </Text>
          {getIsWrongKey() && (
            <View style={styles.smallMarginLeft}>
              <CustomToolTip
                message={'popup.wrong_key.key_info_tooltip'}
                iconColor={PRIMARY_RED_COLOR}
                width={width * 0.65}
                height={height * 0.25}
                textStyle={[styles.keyType, styles.paddingText]}
                containerStyle={{
                  backgroundColor: getColors(theme).cardBgLighter,
                }}
                overlayColor={BLACK_OVERLAY_TRANSPARENT}
                pointerColor={getColors(theme).cardBgLighter}
              />
            </View>
          )}
        </View>
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
                : FormatUtils.shortenString(publicKey, 15)}
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
                  ? FormatUtils.shortenString(privateKey, 15)
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
                modalContent: <AddKey type={type} name={account.name} />,
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
  children: React.ReactNode;
  isAuthorizedAccount?: boolean;
}) => {
  return isAuthorizedAccount ? (
    children
  ) : (
    <TouchableOpacity
      activeOpacity={1}
      onLongPress={() => {
        Clipboard.setStringAsync(wif);
        Toast.show(translate('toast.keys.copied'));
      }}>
      {children}
    </TouchableOpacity>
  );
};
type ViewKeyProps = {toggle: () => void; isPKShown: boolean; theme: Theme};
const ViewKey = ({toggle, isPKShown, theme}: ViewKeyProps) => {
  return (
    <TouchableOpacity activeOpacity={1} onPress={toggle}>
      <Icon
        name={isPKShown ? Icons.NOT_SEE : Icons.SEE}
        theme={theme}
        color={PRIMARY_RED_COLOR}
      />
    </TouchableOpacity>
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
    rowKey: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
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
    paddingText: {
      paddingHorizontal: 8,
    },
    smallMarginLeft: {marginLeft: 4},
  });
