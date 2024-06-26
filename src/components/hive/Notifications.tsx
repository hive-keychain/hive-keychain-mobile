import EllipticButton from 'components/form/EllipticButton';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {Overlay} from 'react-native-elements';
import SimpleToast from 'react-native-simple-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {Notification} from 'src/interfaces/notifications.interface';
import {getButtonStyle} from 'src/styles/button';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {
  FontPoppinsName,
  button_link_primary_small,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import {NotificationsUtils} from 'utils/notifications.utils';
import {PeakDNotificationsUtils} from 'utils/peakd-notifications.utils';
import Icon from './Icon';

const Notifications = ({user, properties}: PropsFromRedux) => {
  const [notifications, setNotifications] = useState<Notification[]>();
  const [isNotificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [allRead, setAllRead] = useState(false);
  const [settingNotifications, setSettingNotifications] = useState(false);
  const flatListRef = useRef();

  const {width} = useWindowDimensions();
  const {theme} = useThemeContext();
  const styles = getStyles(theme, width);

  useEffect(() => {
    if (user && user.name) init(user.name);
  }, [user]);

  const init = async (username: string) => {
    setNotifications([]);
    setHasMoreData(false);
    const userConfig = await PeakDNotificationsUtils.getAccountConfig(username);
    if (userConfig) {
      const {notifs, hasMore} = await NotificationsUtils.getNotifications(
        username,
        properties,
      );
      setNotifications(notifs);
      setHasMoreData(hasMore);
    }
  };

  const handleClick = (notification: Notification) => {
    if (notification.externalUrl) {
      Linking.openURL(notification.externalUrl);
    } else if (notification.txUrl) Linking.openURL(notification.txUrl);
  };

  const markAllAsRead = async () => {
    setSettingNotifications(true);
    await NotificationsUtils.markAllAsRead(user);
    setNotifications(
      notifications?.map((notif) => {
        notif.read = true;
        return notif;
      }),
    );
    setSettingNotifications(false);
    SimpleToast.show(
      translate('components.notifications.mark_as_read'),
      SimpleToast.LONG,
    );
  };

  const renderItem = (notification: Notification) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => handleClick(notification)}
        style={styles.itemContainer}>
        {!notification.read && <View style={styles.unread} />}
        <View>
          <Text style={styles.textBase}>
            {translate(notification.message, notification.messageParams)}
          </Text>
          <Text style={[styles.textBase, styles.dateText]}>
            {moment(notification.createdAt).fromNow()}
          </Text>
        </View>
        <Separator drawLine height={5} />
      </TouchableOpacity>
    );
  };

  if (notifications && notifications.length > 0)
    return (
      <>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.touchable}
          onPress={() => setNotificationPanelOpen(!isNotificationPanelOpen)}>
          <Icon
            theme={theme}
            name={Icons.NOTIFICATIONS}
            color={PRIMARY_RED_COLOR}
            width={45}
            height={45}
            additionalContainerStyle={[{width: 25, height: 25}]}
          />
        </TouchableOpacity>
        <Overlay
          isVisible={isNotificationPanelOpen}
          overlayStyle={[
            getCardStyle(theme).defaultCardItem,
            styles.cardOverlay,
          ]}
          onBackdropPress={() => setNotificationPanelOpen(false)}>
          {!settingNotifications && (
            <FlatList
              ref={flatListRef}
              data={notifications}
              initialNumToRender={20}
              scrollEnabled
              onEndReachedThreshold={0.5}
              renderItem={(item) => renderItem(item.item)}
              keyExtractor={(notification) => notification.id}
              //TODO complete bellow
              // style={styles.transactionsList}
              // onScroll={handleScroll}
              // onEndReached={() => {
              //   if (
              //     transactions.list.length &&
              //     transactions.list[transactions.list.length - 1].last
              //   ) {
              //     const isLast =
              //       transactions.list[transactions.list.length - 1].last;
              //     if (!isLast && displayedTransactions.length > 8) {
              //       tryToLoadMore();
              //     }
              //   }
              // }}
              // ListFooterComponent={() => {
              //   return (
              //     <>
              //       {transactions.list[transactions.list.length - 1]?.last ===
              //         false &&
              //         transactions.lastUsedStart !== 0 &&
              //         !loading &&
              //         !bottomLoader && (
              //           <TouchableOpacity
              //             activeOpacity={1}
              //             style={styles.loadMorePanel}
              //             onPress={() => tryToLoadMore()}>
              //             <Text style={styles.textBase}>
              //               {translate('wallet.operations.history.load_more')}
              //             </Text>
              //             <Icon
              //               name={Icons.ADD_CIRCLE_OUTLINE}
              //               theme={theme}
              //               additionalContainerStyle={{marginLeft: 5}}
              //             />
              //           </TouchableOpacity>
              //         )}
              //       {/* BOTTOM LOADER */}
              //       {!loading && bottomLoader && (
              //         <View style={styles.centeredContainer}>
              //           <Loader animating size={'small'} />
              //         </View>
              //       )}
              //       {/* END BOTTOM LOADER */}
              //     </>
              //   );
              // }}
              ListHeaderComponent={() => {
                return !allRead ? (
                  <>
                    <EllipticButton
                      title={translate(
                        'components.notifications.notification_set_all_as_read',
                      )}
                      onPress={markAllAsRead}
                      style={[
                        getButtonStyle(theme, width).outline,
                        styles.actionButton,
                      ]}
                    />
                    <Separator height={8} />
                  </>
                ) : null;
              }}
            />
          )}
          {settingNotifications && (
            <View style={styles.loaderContainer}>
              <Loader animating />
            </View>
          )}
        </Overlay>
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
    cardOverlay: {
      width: '80%',
      height: '80%',
    },
    textBase: {
      ...button_link_primary_small,
      color: getColors(theme).primaryText,
    },
    dateText: {
      fontFamily: FontPoppinsName.ITALIC,
      fontSize: getFontSizeSmallDevices(width, 10),
    },
    actionButton: {
      height: 35,
      width: '50%',
      alignSelf: 'flex-end',
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
