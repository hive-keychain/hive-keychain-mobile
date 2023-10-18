import {resetModal} from 'actions/message';
import BigCheckSVG from 'assets/new_UI/Illustration.svg';
import ErrorSvg from 'assets/new_UI/error-circle.svg';
import EllipticButton from 'components/form/EllipticButton';
import React, {useContext} from 'react';
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

interface Props {
  capitalize?: boolean;
}

const Message = ({
  messageModal,
  capitalize,
  resetModal,
}: Props & PropsFromRedux) => {
  const {theme} = useContext(ThemeContext);
  const styles = getStyles(theme);

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
            <Text style={styles.text}>
              {capitalize
                ? capitalizeSentence(messageModal.message)
                : messageModal.message}
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
      height: 300,
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
      marginBottom: 25,
    },
    buttonText: {
      ...button_link_primary_medium,
    },
    svgImage: {
      marginTop: 45,
    },
  });

export const MessageModal = connector(Message);
