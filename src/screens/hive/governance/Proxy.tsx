import {loadAccount} from 'actions/hive';
import {ActiveAccount} from 'actions/interfaces';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import CustomInput from 'components/form/CustomInput';
import Icon from 'components/hive/Icon';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import React, {useState} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import Toast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getButtonStyle} from 'src/styles/button';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {
  getFontSizeSmallDevices,
  title_primary_title_1,
} from 'src/styles/typography';
import {setProxy} from 'utils/hive';
import {translate} from 'utils/localize';

type Props = {
  user: ActiveAccount;
};

const Proxy = ({loadAccount, user}: PropsFromRedux & Props) => {
  const [proxyUsername, setProxyUsername] = useState('');
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles(width, height, theme);
  const [loading, setLoading] = useState(false);

  const setAsProxy = async () => {
    if (!user.keys.active) {
      Toast.show(translate('governance.proxy.error.active'));
      return;
    }
    setLoading(true);
    if (
      await setProxy(user.keys.active, {
        account: user.name,
        proxy: proxyUsername.replace(/\s/g, ''),
      })
    ) {
      Toast.show(
        translate('governance.proxy.success.set_proxy', {name: proxyUsername}),
      );
      setTimeout(() => {
        loadAccount(user.name);
        setLoading(false);
      }, 3000);
    } else {
      setLoading(false);
      Toast.show(translate('governance.proxy.error.set_proxy'));
    }
  };

  const removeProxy = async () => {
    if (!user.keys.active) {
      Toast.show(translate('governance.proxy.error.active'));
      return;
    }
    setLoading(true);

    if (
      await setProxy(user.keys.active, {
        account: user.name,
        proxy: '',
      })
    ) {
      setTimeout(() => {
        loadAccount(user.name);
        setLoading(false);
      }, 3000);
      Toast.show(translate('governance.proxy.success.clear_proxy'));
    } else {
      setLoading(false);
      Toast.show(translate('governance.proxy.error.clear_proxy'));
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.flexEnd}>
          <Loader animating />
        </View>
      )}
      <View style={styles.flewBewteen}>
        {!loading && (
          <View style={{flex: 1}}>
            <Text style={[styles.text, styles.textOpaque]}>
              {translate(
                user.account.proxy.length > 0
                  ? 'governance.proxy.has_proxy'
                  : 'governance.proxy.proxy_def',
              )}
            </Text>
            <Separator />
            {user.account.proxy.length > 0 && (
              <Text style={[styles.text, styles.textOpaque]}>
                {translate('governance.proxy.using_proxy', {
                  name: user.account.proxy,
                })}
              </Text>
            )}
            <Separator />
            {user.account.proxy.length === 0 && !loading && (
              <CustomInput
                value={proxyUsername}
                onChangeText={setProxyUsername}
                leftIcon={<Icon name={Icons.AT} theme={theme} />}
                placeholder={translate('governance.proxy.placeholder')}
                autoCapitalize="none"
                containerStyle={[
                  getCardStyle(theme).defaultCardItem,
                  styles.borderAligned,
                ]}
                inputStyle={[styles.text, {textAlignVertical: 'center'}]}
                additionalInputContainerStyle={[styles.inputContainer]}
              />
            )}
          </View>
        )}
        {user.account.proxy.length === 0 && !loading && (
          <ActiveOperationButton
            title={translate('governance.proxy.buttons.set')}
            onPress={() => setAsProxy()}
            isLoading={false}
            style={[getButtonStyle(theme).warningStyleButton, styles.button]}
            additionalTextStyle={[styles.text, styles.buttonText]}
          />
        )}
        {user.account.proxy.length > 0 && !loading && (
          <ActiveOperationButton
            title={translate('governance.proxy.buttons.clear')}
            onPress={() => removeProxy()}
            isLoading={false}
            style={[getButtonStyle(theme).warningStyleButton, styles.button]}
          />
        )}
      </View>
    </View>
  );
};

const getDimensionedStyles = (width: number, heigth: number, theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      flex: 1,
      marginTop: 30,
      paddingHorizontal: width * 0.05,
    },
    text: {
      textAlignVertical: 'center',
      ...title_primary_title_1,
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(heigth, 16),
    },
    textOpaque: {
      opacity: 0.7,
    },
    button: {
      marginBottom: 20,
    },
    input: {marginLeft: 0, marginVertical: 10, marginTop: 50},
    borderAligned: {
      borderRadius: 30,
      alignSelf: 'center',
      paddingHorizontal: 0,
      paddingVertical: 0,
      marginLeft: 0,
      paddingLeft: 0,
    },
    inputContainer: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      borderBottomWidth: 0,
      alignContent: 'center',
      justifyContent: 'center',
      lineHeight: 22,
    },
    flewBewteen: {
      flex: 1,
      justifyContent: 'space-between',
    },
    flexEnd: {flex: 1, justifyContent: 'flex-end'},
    buttonText: {
      color: '#FFF',
    },
  });

const connector = connect(undefined, {
  loadAccount,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Proxy);
