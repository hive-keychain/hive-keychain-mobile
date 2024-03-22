import {resetModal} from 'actions/message';
import EllipticButton from 'components/form/EllipticButton';
import Icon from 'components/hive/Icon';
import React, {useEffect} from 'react';
import {
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
import {getColors} from 'src/styles/colors';
import {
  SMALLEST_SCREEN_WIDTH_SUPPORTED,
  button_link_primary_medium,
  getFontSizeSmallDevices,
  title_primary_title_1,
} from 'src/styles/typography';
import {RootState} from 'store';
import {translate} from 'utils/localize';

const DEFAULTHIDETIMEMS = 3000;
interface Props {
  notHideOnSuccess?: boolean;
}

const Message = ({
  messageModal,
  resetModal,
  notHideOnSuccess,
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
        return <Icon name={Icons.SUCCESS} {...iconDimensions} />;
      case MessageModalType.ERROR:
        return <Icon name={Icons.ERROR} {...iconDimensions} />;
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
            <EllipticButton
              title={translate('common.close')}
              onPress={() => resetModal()}
              isWarningButton
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
  });

export const MessageModal = connector(Message);
