import {resetModal} from 'actions/message';
import BigCheckSVG from 'assets/new_UI/Illustration.svg';
import ErrorSvg from 'assets/new_UI/error-circle.svg';
import EllipticButton from 'components/form/EllipticButton';
import React, {useContext, useEffect} from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getButtonStyle} from 'src/styles/button';
import {getColors} from 'src/styles/colors';
import {
  button_link_primary_medium,
  title_primary_title_1,
} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalizeSentence} from 'utils/format';
import {translate} from 'utils/localize';
//TODO important: check on every use of showModal and replace to get only the tr key.
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
    if (!messageModal.show) return;
    //TODO when adding types of modals, add the check here, if MODAL.SUCCESS
    let timeout: undefined | NodeJS.Timeout;
    if (!notHideOnSuccess) {
      timeout = setTimeout(handleReset, DEFAULTHIDETIMEMS);
    }
    return () => {
      if (timeout && !notHideOnSuccess) clearTimeout(timeout);
    };
  }, [notHideOnSuccess, messageModal.show]);

  const message = translate(messageModal.messageKey);

  return messageModal.show ? (
    <Modal visible={messageModal.show} transparent={true} animationType="fade">
      <View style={[styles.mainContainer]}>
        <TouchableOpacity style={{flex: 1}} onPress={() => resetModal()} />
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {messageModal.isError ? (
              <ErrorSvg style={styles.svgImage} />
            ) : (
              <BigCheckSVG style={styles.svgImage} />
            )}
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
  ) : null;
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
