import {loadAccount} from 'actions/hive';
import {ActiveAccount} from 'actions/interfaces';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import CustomInput from 'components/form/CustomInput';
import Loader from 'components/ui/Loader';
import React, {useState} from 'react';
import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import Toast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {Width} from 'utils/common.types';
import {setProxy} from 'utils/hive';
import {translate} from 'utils/localize';

type Props = {
  user: ActiveAccount;
};

const Proxy = ({loadAccount, user}: PropsFromRedux & Props) => {
  const [proxyUsername, setProxyUsername] = useState('');
  const styles = getDimensionedStyles(useWindowDimensions());
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
      <View>
        <Text style={styles.text}>
          {translate(
            user.account.proxy.length > 0
              ? 'governance.proxy.has_proxy'
              : 'governance.proxy.proxy_def',
          )}
        </Text>

        {user.account.proxy.length > 0 && (
          <Text style={styles.text}>
            {translate('governance.proxy.using_proxy', {
              name: user.account.proxy,
            })}
          </Text>
        )}
      </View>
      {user.account.proxy.length === 0 && !loading && (
        <View>
          <CustomInput
            value={proxyUsername}
            onChangeText={setProxyUsername}
            leftIcon={<Text>@</Text>}
            placeholder={translate('governance.proxy.placeholder')}
            inputColor="black"
            backgroundColor="white"
            containerStyle={styles.input}
            autoCapitalize="none"
          />
          <ActiveOperationButton
            title={translate('governance.proxy.buttons.set')}
            onPress={() => setAsProxy()}
            isLoading={false}
            style={styles.button}
          />
        </View>
      )}
      {user.account.proxy.length > 0 && !loading && (
        <ActiveOperationButton
          title={translate('governance.proxy.buttons.clear')}
          onPress={() => removeProxy()}
          isLoading={false}
          style={styles.button}
        />
      )}
      {loading && (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Loader animating />
        </View>
      )}
      <View></View>
    </View>
  );
};

const getDimensionedStyles = ({width}: Width) =>
  StyleSheet.create({
    container: {
      width: '100%',
      flex: 1,
      marginTop: 30,
      paddingHorizontal: width * 0.05,
    },
    text: {
      marginBottom: 10,
      fontSize: 16,
      lineHeight: 16,
      textAlignVertical: 'center',
    },
    button: {
      marginTop: 100,
    },
    input: {marginLeft: 0, marginVertical: 10, marginTop: 50},
  });

const connector = connect(undefined, {
  loadAccount,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Proxy);
