import {addTab} from 'actions/index';
import {resetModal} from 'actions/message';
import {default as EllipticButton} from 'components/form/EllipticButton';
import Icon from 'components/hive/Icon';
import React, {useEffect} from 'react';
import {
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {getButtonHeight} from 'src/styles/button';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {
  SMALLEST_SCREEN_WIDTH_SUPPORTED,
  button_link_primary_medium,
  button_link_primary_small,
  getFontSizeSmallDevices,
  title_primary_title_1,
} from 'src/styles/typography';
import {RootState} from 'store';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

const DEFAULTHIDETIMEMS = 3000;
interface Props {
  notHideOnSuccess?: boolean;
  filePath?: string;
}

const Message = ({
  messageModal,
  resetModal,
  notHideOnSuccess,
  addTab,
  filePath,
}: Props & PropsFromRedux) => {
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, width, height);

  const handleReset = () => {
    resetModal();
  };

  useEffect(() => {
    if (messageModal.type !== MessageModalType.SUCCESS) return;
    let timeout: undefined | NodeJS.Timeout;
    if (!notHideOnSuccess) {
      timeout = setTimeout(handleReset, DEFAULTHIDETIMEMS);
    }
    return () => {
      if (timeout && !notHideOnSuccess) clearTimeout(timeout);
    };
  }, [notHideOnSuccess, messageModal]);

  const message = messageModal.skipTranslation
    ? messageModal.key
    : translate(messageModal.key, messageModal.params);

  const renderIcon = () => {
    const iconDimensions = {
      width: width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 70 : 120,
      height: width <= SMALLEST_SCREEN_WIDTH_SUPPORTED ? 70 : 120,
    };
    switch (messageModal.type) {
      case MessageModalType.SUCCESS:
      case MessageModalType.MULTISIG_SUCCESS:
      case MessageModalType.EXPORT_TRANSACTIONS_SUCCESS:
        return <Icon name={Icons.SUCCESS} {...iconDimensions} />;
      case MessageModalType.ERROR:
      case MessageModalType.EXPORT_TRANSACTIONS_ERROR:
        return <Icon name={Icons.ERROR} {...iconDimensions} />;
    }
  };

  const handleOpenFile = () => {
    if (filePath) {
    }
  };

  return (
    <Modal
      visible={messageModal.key.trim().length > 0}
      transparent={true}
      animationType="fade">
      <View style={[styles.mainContainer]}>
        <TouchableOpacity
          activeOpacity={1}
          style={{flex: 1}}
          onPress={() => resetModal()}
        />
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.svgImage}>{renderIcon()}</View>
            <Text style={[styles.text, styles.marginVertical]}>{message}</Text>
            {messageModal.type === MessageModalType.MULTISIG_SUCCESS && (
              <TouchableOpacity
                onPress={() => {
                  addTab(`https://hivehub.dev/tx/${messageModal.params.txId}`);
                  navigate('BrowserScreen');
                  resetModal();
                }}>
                <Text
                  style={{
                    ...styles.text,
                    marginBottom: -20,
                    fontWeight: 'bold',
                  }}>{`Tx ID`}</Text>

                <Text style={styles.text}>{messageModal.params.txId}</Text>
              </TouchableOpacity>
            )}
            {messageModal.type ===
              MessageModalType.EXPORT_TRANSACTIONS_SUCCESS && (
              <View style={styles.exportButtonsContainer}>
                <TouchableOpacity
                  onPress={() => resetModal()}
                  style={[
                    styles.exportButtonWrapper,
                    {
                      backgroundColor:
                        theme === Theme.LIGHT
                          ? 'white'
                          : getColors(theme).cardBgColor,
                      borderWidth: theme === Theme.DARK ? 1 : 0,
                      borderColor:
                        theme === Theme.DARK ? 'white' : 'transparent',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.buttonText,
                      styles.dynamicTextSize,
                      theme === Theme.LIGHT
                        ? {color: 'black'}
                        : {color: 'white'},
                    ]}>
                    {translate('common.close')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (filePath) {
                      Linking.openURL(`file://${filePath}`);
                    }
                  }}
                  style={[styles.exportButtonWrapper]}>
                  <Text style={styles.exportButtonText}>
                    {translate('export_transactions.open_file')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {messageModal.type !==
              MessageModalType.EXPORT_TRANSACTIONS_SUCCESS && (
              <EllipticButton
                title={translate('common.close')}
                onPress={() => resetModal()}
                isWarningButton
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    messageModal: state.message,
  };
};

const connector = connect(mapStateToProps, {
  resetModal,
  addTab,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const getStyles = (theme: Theme, width: number, height: number) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: '#212838bc',
    },
    modalContainer: {
      width: '100%',
      height: 'auto',
      minHeight: '40%',
      maxHeight: '80%',
      paddingVertical: 20,
      backgroundColor: getColors(theme).cardBgColor,
      borderColor: getColors(theme).cardBorderColorContrast,
      borderWidth: 0,
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      borderBottomWidth: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    modalContent: {
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 14,
    },
    text: {
      ...title_primary_title_1,
      color: getColors(theme).secondaryText,
      fontSize: getFontSizeSmallDevices(
        width,
        {...title_primary_title_1}.fontSize,
      ),
      paddingVertical: 10,
      paddingHorizontal: 8,
    },
    button: {
      width: '60%',
      marginHorizontal: 0,
      marginTop: 10,
      height: getButtonHeight(width),
    },
    buttonText: {
      ...button_link_primary_medium,
    },
    svgImage: {
      marginHorizontal: 15,
    },
    marginVertical: {
      marginVertical: 10,
    },
    exportButtonsContainer: {
      flexDirection: 'row',
      height: 50,
      marginTop: 20,
      paddingHorizontal: 16,
      marginBottom: 16,
      gap: 10,
    },
    exportButtonWrapper: {
      flex: 1,
      backgroundColor: PRIMARY_RED_COLOR,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 25,
    },
    exportButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '500',
    },
    dynamicTextSize: {
      fontSize: getFontSizeSmallDevices(
        width,
        button_link_primary_small.fontSize,
      ),
    },
  });

export const MessageModal = connector(Message);
