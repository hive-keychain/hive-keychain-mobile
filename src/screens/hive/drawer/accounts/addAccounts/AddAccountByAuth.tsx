import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {addAccount} from 'actions/index';
import {showModal} from 'actions/message';
import TitleLogoLight from 'assets/images/wallet/img_import_dark.svg';
import TitleLogoDark from 'assets/images/wallet/img_import_light.svg';
import EllipticButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import Background from 'components/ui/Background';
import CustomIconButton from 'components/ui/CustomIconButton';
import Separator from 'components/ui/Separator';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {} from 'navigators/mainDrawerStacks/AddAccount.types';
import React, {useState} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {Text} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import {connect, ConnectedProps} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enum';
import {MessageModalType} from 'src/enums/messageModal.enum';
import {Dimensions} from 'src/interfaces/common.interface';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_1,
  button_link_primary_medium,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {RootState} from 'store';
import AccountUtils from 'utils/account.utils';
import {translate} from 'utils/localize';

type AnyAuthRoute = RouteProp<
  Record<string, {wallet?: boolean} | undefined>,
  string
>;

const AddAccountByAuth = ({
  addAccount,
  localAccounts,
  showModal,
}: PropsFromRedux) => {
  const navigation = useNavigation<any>();
  const route = useRoute<AnyAuthRoute>();
  const [account, setAccount] = useState('');
  const [authorizedAccount, setAuthorizedAccount] = useState('');

  useLockedPortrait(navigation);

  const onImportKeysByAuth = async () => {
    try {
      const keys = await AccountUtils.addAuthorizedAccount(
        account,
        authorizedAccount,
        localAccounts,
      );
      if (keys) {
        const wallet = route.params ? route.params.wallet : false;
        addAccount(account, keys, wallet, false);
        showModal('common.added_account', MessageModalType.SUCCESS);
      } else {
        showModal('toast.error_add_account', MessageModalType.ERROR);
      }
    } catch (e) {
      showModal(
        (e as any).message || JSON.stringify(e),
        MessageModalType.ERROR,
        undefined,
        true,
      );
    }
  };

  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, {width, height});

  return (
    <Background
      theme={theme}
      skipTop
      skipBottom
      additionalBgSvgImageStyle={{bottom: -initialWindowMetrics.insets.bottom}}>
      <ScrollView contentContainerStyle={styles.topContainer}>
        <Separator height={30} />
        <CustomIconButton
          lightThemeIcon={<TitleLogoLight />}
          darkThemeIcon={<TitleLogoDark />}
          onPress={() => {}}
          theme={theme}
        />
        <Separator height={height / 22} />
        <Text style={[styles.text, styles.opacity, styles.centeredText]}>
          {translate('addAccountByAuth.text')}
        </Text>
        <Separator height={height / 22} />
        <OperationInput
          labelInput={translate('common.username')}
          placeholder={translate('common.username')}
          value={account}
          onChangeText={setAccount}
        />
        <Separator height={height / 22} />
        <OperationInput
          labelInput={translate('common.authorized_username')}
          placeholder={translate('common.authorized_username')}
          value={authorizedAccount}
          onChangeText={setAuthorizedAccount}
          rightIcon={
            <Icon
              name={Icons.SCANNER}
              theme={theme}
              onPress={() => {
                navigation.navigate('ScanQRScreen', {wallet: true});
              }}
            />
          }
        />
        <View style={styles.bottomContainer}>
          <EllipticButton
            title={translate('common.import')}
            onPress={onImportKeysByAuth}
            additionalTextStyle={styles.buttonText}
            isWarningButton
          />
        </View>
      </ScrollView>
    </Background>
  );
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    topContainer: {
      alignItems: 'center',
      justifyContent: 'space-between',
      flexGrow: 1,
      paddingHorizontal: 16,
    },
    text: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_1,
      fontSize: getFontSizeSmallDevices(
        width,
        {...body_primary_body_1}.fontSize,
      ),
    },
    opacity: {
      opacity: 0.7,
    },
    centeredText: {textAlign: 'center'},
    bottomContainer: {
      marginBottom: 15,
      width: '100%',
      alignItems: 'center',
      minHeight: height / 5,
      flexGrow: 1,
      justifyContent: 'flex-end',
    },
    smallerText: {
      fontSize: 13,
    },
    buttonText: {
      ...button_link_primary_medium,
      fontSize: getFontSizeSmallDevices(
        width,
        {...button_link_primary_medium}.fontSize,
      ),
    },
  });

const mapStateToProps = (state: RootState) => {
  return {
    localAccounts: state.accounts,
  };
};

const connector = connect(mapStateToProps, {addAccount, showModal});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(AddAccountByAuth);
