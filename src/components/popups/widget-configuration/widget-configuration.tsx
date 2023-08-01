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
import {navigate} from 'utils/navigation';
import {WidgetUtils} from 'utils/widget.utils';

interface Props {
  navigation: WalletNavigation;
  show: boolean;
  setShow: any;
}

const WidgetConfiguration = ({
  navigation,
  show,
  setShow,
  accounts,
  properties,
  prices,
}: Props & PropsFromRedux): null => {
  const [accountsToShow, setAccountsToShow] = useState<
    {name: string; show: boolean}[]
  >(
    accounts.map((acc) => {
      return {name: acc.name, show: false};
    }),
  );
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const accountsStoredToShow = await AsyncStorage.getItem(
      'account_balance_list',
    );
    if (accountsStoredToShow) {
      console.log({accountsStoredToShow}); //TODO remove line
      //TODO organize interfaces.
      const accountsFound: {name: string; show: boolean}[] = JSON.parse(
        accountsStoredToShow,
      );
      for (let i = 0; i < accountsFound.length; i++) {
        const acc = accountsFound[i];
        if (acc.show) {
          console.log({acc}); //TODO remove line
          toogleShowAccount(acc.name, true);
        }
      }
    }
  };

  useEffect(() => {
    console.log('in widget-configuration', {show, accountsToShow}); //TODO remove line
    if (show) {
      navigate('ModalScreen', {
        name: 'Whats_new_popup',
        modalContent: renderContent(),
        onForceCloseModal: handleClose,
      });
    }
  }, [show, accountsToShow, loadingData]);

  const handleClose = async () => {
    setShow(false);
    navigation.goBack();
  };

  const toogleShowAccount = (accountName: string, value: boolean) => {
    const copyState = [...accountsToShow];
    const updated = copyState.find((acc) => acc.name === accountName);
    console.log({updated}); //TODO remove line
    updated.show = value;
    setAccountsToShow(copyState);
  };

  const handleSaveWidgetConfiguration = async () => {
    setLoadingData(true);
    //saving into async storage so it will be processed by utils later on.
    console.log(
      'about to save in async storage: ',
      JSON.stringify(accountsToShow),
    );
    await AsyncStorage.setItem(
      'account_balance_list',
      JSON.stringify(accountsToShow),
    );
    setLoadingData(false);
    WidgetUtils.sendWidgetData();
    handleClose();
  };

  const renderContent = () => {
    return (
      <Operation
        title="Widget Configuration"
        logo={<Icon name="settings" />}
        onClose={handleClose}>
        <>
          <Text style={[styles.title, styles.marginTop]}>
            Widget Account Balance Configuration
          </Text>
          <Text style={[styles.text, styles.centeredText]}>
            Choose which accounts will be shown in the Widget.
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
    properties: state.properties,
    accounts: state.accounts,
    prices: state.currencyPrices,
  };
};

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(WidgetConfiguration);
