import {resetModal} from 'actions/message';
import BigCheckSVG from 'assets/new_UI/Illustration.svg';
import ErrorSvg from 'assets/new_UI/error-circle.svg';
import EllipticButton from 'components/form/EllipticButton';
import React, {useContext, useEffect} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {
  button_link_primary_medium,
  title_primary_title_1,
} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalizeSentence} from 'utils/format';
import {translate} from 'utils/localize';

const DEFAULTHIDETIMEMS = 3000;
interface Props {
  capitalize?: boolean;
  notHideOnSuccess?: boolean;
}

const Message = ({
  messageModal,
  capitalize,
  resetModal,
  notHideOnSuccess,
}: Props & PropsFromRedux) => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

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
    switch (messageModal.type) {
      case MessageModalType.SUCCESS:
        return <BigCheckSVG style={styles.svgImage} />;
      case MessageModalType.ERROR:
        return <ErrorSvg style={styles.svgImage} />;
    }
  };

  return (
    <Modal
      visible={messageModal.key.trim().length > 0}
      transparent={true}
      animationType="fade">
      <View style={[styles.mainContainer]}>
        <TouchableOpacity style={{flex: 1}} onPress={() => resetModal()} />
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {renderIcon()}
            <Text style={[styles.text, styles.marginVertical]}>
              {capitalize ? capitalizeSentence(message) : message}
            </Text>
            <EllipticButton
              title={translate('common.close')}
              onPress={() => resetModal()}
              //TODO important need testing in IOS
              style={[getButtonStyle(theme).warningStyleButton, styles.button]}
              additionalTextStyle={styles.buttonText}
            />
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
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: '#212838bc',
    },
    modalContainer: {
      width: '100%',
      height: '50%',
      backgroundColor: getColors(theme).cardBgColor,
      borderColor: getColors(theme).cardBorderColorContrast,
      borderWidth: 0,
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      borderBottomWidth: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '100%',
      maxHeight: 300,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 14,
    },
    text: {
      ...title_primary_title_1,
      color: getColors(theme).secondaryText,
    },
    button: {
      width: '60%',
      marginHorizontal: 0,
      marginTop: 10,
      marginBottom: 25,
    },
    buttonText: {
      ...button_link_primary_medium,
    },
    svgImage: {
      marginTop: 15,
    },
    marginVertical: {
      marginVertical: 10,
    },
  });

export const MessageModal = connector(Message);
