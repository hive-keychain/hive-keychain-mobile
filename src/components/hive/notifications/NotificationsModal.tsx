import {DynamicGlobalProperties} from '@hiveio/dhive';
import {addTab} from 'actions/index';
import {ActiveAccount} from 'actions/interfaces';
import EllipticButton from 'components/form/EllipticButton';
import {BackToTopButton} from 'components/ui/Back-To-Top-Button';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import moment from 'moment';
import React, {useRef, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import SimpleToast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Notification} from 'src/interfaces/notifications.interface';
import {getButtonStyle} from 'src/styles/button';
import {getColors, PRIMARY_RED_COLOR} from 'src/styles/colors';
import {getHeaderTitleStyle} from 'src/styles/headers';
import {
  button_link_primary_small,
  FontPoppinsName,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';
import {NotificationsUtils} from 'utils/notifications.utils';

type Props = {
  notifs: Notification[];
  user: ActiveAccount;
  moreData: boolean;
  properties: DynamicGlobalProperties;
} & PropsFromRedux;

const NotificationsModal = ({
  notifs,
  user,
  moreData,
  properties,
  addTab,
}: Props) => {
  const [settingNotifications, setSettingNotifications] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [displayScrollToTop, setDisplayedScrollToTop] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(notifs);
  const [hasMoreData, setHasMoreData] = useState(moreData);

  const flatListRef = useRef();

  const {width} = useWindowDimensions();
  const {theme} = useThemeContext();
  const styles = getStyles(theme, width);

  const handleClick = (notification: Notification) => {
    addTab(notification.externalUrl || notification.txUrl);
    navigate('BrowserScreen');
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

  const handleScroll = (event: any) => {
    const {y: innerScrollViewY} = event.nativeEvent.contentOffset;
    if (isLoadingMore) return;
    setDisplayedScrollToTop(innerScrollViewY >= 50);
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    const {notifs, hasMore} = await NotificationsUtils.getNotifications(
      user.name!,
      properties!,
      notifications,
    );
    setNotifications(notifs);
    setHasMoreData(hasMore);
    setIsLoadingMore(false);
  };

  const renderItem = (notification: Notification) => {
    return (
      <>
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
        </TouchableOpacity>
        <Separator drawLine height={5} additionalLineStyle={styles.line} />
      </>
    );
  };
  return (
    <View style={styles.modal}>
      {!settingNotifications && (
        <ScrollView ref={flatListRef} onScroll={handleScroll}>
          <ScrollView horizontal contentContainerStyle={{flex: 1}}>
            <FlatList
              data={notifications}
              initialNumToRender={20}
              scrollEnabled
              onEndReachedThreshold={0.5}
              renderItem={(item) => renderItem(item.item)}
              keyExtractor={(notification) => notification.id}
              ListHeaderComponent={() => {
                return (
                  <>
                    <View style={styles.header}>
                      <Text style={getHeaderTitleStyle(theme, width)}>
                        {translate('settings.settings.notifications.title')}
                      </Text>
                      {notifications.find((e) => !e.read) ? (
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
                      ) : null}
                    </View>
                    <Separator />
                  </>
                );
              }}
              onEndReached={() => {
                if (hasMoreData) handleLoadMore();
              }}
              ListFooterComponent={() => (
                <Separator height={initialWindowMetrics.insets.bottom} />
              )}
            />
          </ScrollView>
        </ScrollView>
      )}
      {!settingNotifications && displayScrollToTop && (
        <BackToTopButton theme={theme} element={flatListRef} isScrollView />
      )}
      {settingNotifications && (
        <View style={styles.loaderContainer}>
          <Loader animating />
        </View>
      )}
    </View>
  );
};

const getStyles = (theme: Theme, width: number) =>
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
    modal: {
      padding: 12,
      paddingBottom: 0,
      width: '100%',
      marginBottom: initialWindowMetrics?.insets.bottom,
    },
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

const connector = connect(undefined, {addTab});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(NotificationsModal);
