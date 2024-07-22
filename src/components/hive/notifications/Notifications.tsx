import {ModalScreenProps} from 'navigators/Root.types';
import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {Notification} from 'src/interfaces/notifications.interface';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {getModalBaseStyle} from 'src/styles/modal';
import {
  FontPoppinsName,
  button_link_primary_small,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {navigate} from 'utils/navigation';
import {NotificationsUtils} from 'utils/notifications.utils';
import Icon from '../Icon';
import NotificationsModal from './NotificationsModal';

const Notifications = ({user, properties}: PropsFromRedux) => {
  const [notifications, setNotifications] = useState<Notification[]>();
  const [hasMoreData, setHasMoreData] = useState(false);

  const {width} = useWindowDimensions();
  const {theme} = useThemeContext();
  const styles = getStyles(theme, width);

  useEffect(() => {
    if (user && user.name) init(user.name);
  }, [user]);

  const init = async (username: string) => {
    const {notifs, hasMore} = await NotificationsUtils.getNotifications(
      username,
      properties,
    );
    setNotifications(notifs);
    setHasMoreData(hasMore);
  };

  const showNotificationsModal = () => {
    navigate('ModalScreen', {
      name: 'NotificationsModal',
      modalContent: (
        <NotificationsModal
          notifs={notifications}
          user={user}
          moreData={hasMoreData}
          properties={properties}
        />
      ),
      modalContainerStyle: [getModalBaseStyle(theme).roundedTop],
      fixedHeight: 0.5,
    } as ModalScreenProps);
  };

  if (notifications && notifications.length > 0)
    return (
      <>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.touchable}
          onPress={() => {
            showNotificationsModal();
          }}>
          <Icon
            theme={theme}
            name={Icons.NOTIFICATIONS}
            color={PRIMARY_RED_COLOR}
            width={45}
            height={45}
            additionalContainerStyle={[{width: 25, height: 25}]}
          />
        </TouchableOpacity>
      </>
    );
  else return null;
};

const getStyles = (theme: Theme, width: Dimensions['width']) =>
  StyleSheet.create({
    touchable: {
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
      borderRadius: 50,
      borderWidth: 2,
      borderColor: 'white',
      backgroundColor: 'white',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    modal: {padding: 12, width: '100%'},
    textBase: {
      ...button_link_primary_small,
      color: getColors(theme).primaryText,
      fontSize: getFontSizeSmallDevices(width, 12),
    },
    dateText: {
      fontFamily: FontPoppinsName.ITALIC,
      fontSize: getFontSizeSmallDevices(width, 10),
    },
    actionButton: {
      height: 35,
      width: '40%',
    },
    loaderContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    unread: {
      width: 6,
      height: 6,
      backgroundColor: PRIMARY_RED_COLOR,
      borderRadius: 50,
      marginRight: 4,
      position: 'absolute',
      left: 0,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: 12,
    },
    line: {
      borderColor: getColors(theme).borderContrast,
    },
  });

const connector = connect(
  (state: RootState) => ({
    user: state.activeAccount,
    properties: state.properties.globals,
  }),
  {},
);
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(Notifications);
