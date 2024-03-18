import {loadAccount} from 'actions/hive';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import {Caption} from 'components/ui/Caption';
import Loader from 'components/ui/Loader';
import React, {useState} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import Toast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {
  getFontSizeSmallDevices,
  title_primary_title_1,
} from 'src/styles/typography';
import {RootState} from 'store';
import {AsyncUtils} from 'utils/async.utils';
import {setProxy} from 'utils/hive';
import {translate} from 'utils/localize';

type Props = {};

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
      await AsyncUtils.waitForXSeconds(3);
      loadAccount(user.name);
      setLoading(false);
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
      await AsyncUtils.waitForXSeconds(3);
      loadAccount(user.name);
      setLoading(false);
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
      <View style={[styles.flewBewteen]}>
        {!loading && (
          <View style={[{flex: 1, paddingHorizontal: 16}]}>
            <Caption
              text={
                user.account.proxy.length > 0
                  ? 'governance.proxy.has_proxy'
                  : 'governance.proxy.proxy_def'
              }
              hideSeparator
              additionnalText={
                user.account.proxy.length > 0
                  ? 'governance.proxy.using_proxy'
                  : undefined
              }
              additionnalTextParams={
                user.account.proxy.length > 0 ? {name: user.account.proxy} : {}
              }
            />
            {user.account.proxy.length === 0 && !loading && (
              <OperationInput
                value={proxyUsername}
                onChangeText={setProxyUsername}
                leftIcon={<Icon name={Icons.AT} theme={theme} />}
                placeholder={translate('governance.proxy.placeholder')}
                autoCapitalize="none"
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
    },
    text: {
      textAlignVertical: 'center',
      ...title_primary_title_1,
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(width, 16),
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
    },
    flexEnd: {flex: 1, justifyContent: 'flex-end'},
    buttonText: {
      color: '#FFF',
    },
  });

const mapStateToProps = (state: RootState) => {
  return {
    user: state.activeAccount,
  };
};

const connector = connect(mapStateToProps, {
  loadAccount,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Proxy);
