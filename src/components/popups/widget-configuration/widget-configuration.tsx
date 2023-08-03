import AsyncStorage from '@react-native-community/async-storage';
import OperationButton from 'components/form/EllipticButton';
import Icon from 'components/hive/Icon';
import Operation from 'components/operations/Operation';
import {WalletNavigation} from 'navigators/MainDrawer.types';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {ConnectedProps, connect} from 'react-redux';
import {RootState} from 'store';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {WidgetUtils} from 'utils/widget.utils';

interface Props {
  navigation: WalletNavigation;
  show: boolean;
  setShow: any;
}

export interface WidgetAccountBalanceToShow {
  name: string;
  show: boolean;
}

const WidgetConfiguration = ({
  navigation,
  show,
  setShow,
  accounts,
}: Props & PropsFromRedux): null => {
  const [accountsToShow, setAccountsToShow] = useState<
    WidgetAccountBalanceToShow[]
  >(
    accounts.map((acc) => {
      return {name: acc.name, show: false};
    }),
  );
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    init();
  }, [show]);

  const init = async () => {
    const accountsStoredToShow = await AsyncStorage.getItem(
      'account_balance_list',
    );
    if (accountsStoredToShow) {
      const accountsFound: WidgetAccountBalanceToShow[] = JSON.parse(
        accountsStoredToShow,
      );
      if (show) setAccountsToShow(accountsFound);
    }
  };

  useEffect(() => {
    if (show) {
      navigate('ModalScreen', {
        name: 'Whats_new_popup',
        modalContent: renderContent(),
        onForceCloseModal: handleClose,
      });
    }
  }, [show, loadingData, accountsToShow]);

  const handleClose = async () => {
    setShow(false);
    navigation.goBack();
  };

  const toogleShowAccount = (accountName: string, value: boolean) => {
    const copyState = [...accountsToShow];
    const updated = copyState.find((acc) => acc.name === accountName);
    updated.show = value;
    setAccountsToShow(copyState);
  };

  const handleSaveWidgetConfiguration = async () => {
    setLoadingData(true);
    await AsyncStorage.setItem(
      'account_balance_list',
      JSON.stringify(accountsToShow),
    );
    await WidgetUtils.sendWidgetData();
    setLoadingData(false);
    handleClose();
  };

  const renderContent = () => {
    return (
      <Operation
        title={translate('popup.widget_configuration.title')}
        logo={<Icon name="settings" />}
        onClose={handleClose}>
        <>
          <Text style={[styles.title, styles.marginTop]}>
            {translate('popup.widget_configuration.sub_title')}
          </Text>
          <Text style={[styles.text, styles.centeredText]}>
            {translate('popup.widget_configuration.intro')}
          </Text>
          {accountsToShow.map((accountToShow) => {
            return (
              <CheckBox
                key={accountToShow.name}
                checked={accountToShow.show}
                onPress={() =>
                  toogleShowAccount(accountToShow.name, !accountToShow.show)
                }
                title={`@${accountToShow.name}`}
              />
            );
          })}
          <OperationButton
            style={[styles.button, styles.marginVertical]}
            title={'SAVE'}
            onPress={handleSaveWidgetConfiguration}
            isLoading={loadingData}
          />
        </>
      </Operation>
    );
  };
  return null;
};

const styles = StyleSheet.create({
  rootContainer: {
    width: '100%',
  },
  title: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {fontSize: 16, marginBottom: 10},
  image: {
    marginBottom: 30,
    aspectRatio: 1.6,
    alignSelf: 'center',
    width: '100%',
  },
  marginTop: {
    marginTop: 18,
  },
  marginVertical: {
    marginVertical: 10,
  },
  button: {
    width: '100%',
    marginHorizontal: 0,
  },
  centeredText: {
    textAlign: 'center',
  },
});

const mapStateToProps = (state: RootState) => {
  return {
    user: state.activeAccount,
    accounts: state.accounts,
  };
};

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(WidgetConfiguration);
