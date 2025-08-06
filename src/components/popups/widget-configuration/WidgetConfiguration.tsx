import AsyncStorage from '@react-native-community/async-storage';
import CheckBoxPanel from 'components/form/CheckBoxPanel';
import EllipticButton from 'components/form/EllipticButton';
import Operation from 'components/operations/Operation';
import Separator from 'components/ui/Separator';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {WidgetAsyncStorageItem} from 'src/enums/widgets.enum';
import {getColors} from 'src/styles/colors';
import {getModalBaseStyle} from 'src/styles/modal';
import {getFontSizeSmallDevices} from 'src/styles/typography';
import {RootState} from 'store';
import {translate} from 'utils/localize';
import {goBack, navigate} from 'utils/navigation';
import {WidgetUtils} from 'utils/widget.utils';

interface Props {
  show: boolean;
  setShow: (val: boolean) => void;
}

export interface WidgetAccountBalanceToShow {
  name: string;
  show: boolean;
}

const WidgetConfiguration = ({
  show,
  setShow,
  accounts,
}: Props & PropsFromRedux): null => {
  const [accountsToShow, setAccountsToShow] = useState<
    WidgetAccountBalanceToShow[]
  >([]);
  const [loadingData, setLoadingData] = useState(false);
  const {theme} = useThemeContext();
  useEffect(() => {
    if (show) {
      init();
    }
  }, [show, accounts.length]);
  const styles = getStyles(
    useThemeContext().theme,
    useWindowDimensions().width,
  );
  const init = async () => {
    const accountsStoredToShow = await AsyncStorage.getItem(
      WidgetAsyncStorageItem.ACCOUNT_BALANCE_LIST,
    );

    if (accountsStoredToShow) {
      setAccountsToShow(JSON.parse(accountsStoredToShow));
    } else if (accounts.length) {
      await WidgetUtils.scanAccountsAndSave(accounts.map((acc) => acc.name));
      setAccountsToShow(
        accounts.map((acc) => {
          return {name: acc.name, show: false};
        }),
      );
    }
  };

  useEffect(() => {
    if (show) {
      navigate('ModalScreen', {
        name: 'WidgetConfiguration',
        modalContent: renderContent(),
        onForceCloseModal: handleClose,
        modalContainerStyle: [
          getModalBaseStyle(theme).roundedTop,
          styles.modal,
        ],
      });
    }
  }, [show, loadingData, accountsToShow]);

  const handleClose = async () => {
    setShow(false);
    goBack();
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
      WidgetAsyncStorageItem.ACCOUNT_BALANCE_LIST,
      JSON.stringify(accountsToShow),
    );
    await WidgetUtils.sendWidgetData('account_balance_list');
    setLoadingData(false);
    handleClose();
  };

  const renderContent = () => {
    return (
      <Operation
        title={translate('popup.widget_configuration.title')}
        onClose={handleClose}>
        <View style={styles.rootContainer}>
          <Text style={[styles.text, styles.centeredText]}>
            {translate('popup.widget_configuration.intro')}
          </Text>
          {accountsToShow.map((accountToShow) => {
            return (
              <CheckBoxPanel
                key={accountToShow.name}
                checked={accountToShow.show}
                onPress={() =>
                  toogleShowAccount(accountToShow.name, !accountToShow.show)
                }
                title={`@${accountToShow.name}`}
                skipTranslation
              />
            );
          })}
          <Separator />
          <EllipticButton
            title={translate('common.save')}
            isWarningButton
            onPress={handleSaveWidgetConfiguration}
            isLoading={loadingData}
          />
        </View>
      </Operation>
    );
  };
  return null;
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    rootContainer: {
      width: '100%',
      padding: 16,
    },
    title: {
      textAlign: 'center',
      color: getColors(theme).primaryText,
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    text: {
      fontSize: getFontSizeSmallDevices(width, 14),
      marginBottom: 10,
      color: getColors(theme).primaryText,
    },
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
    modal: {
      padding: 16,
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
