import {addTab} from 'actions/index';
import {ActiveAccount} from 'actions/interfaces';
import {
  loadNotifications,
  markAllNotificationsAsRead,
} from 'actions/notifications';
import EllipticButton from 'components/form/EllipticButton';
import {BackToTopButton} from 'components/ui/BackToTopButton';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import moment from 'moment';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import SimpleToast from 'react-native-root-toast';
import {initialWindowMetrics} from 'react-native-safe-area-context';
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
import {RootState} from 'store';
import {translate} from 'utils/localize';
import {goBack, goBackAndNavigate} from 'utils/navigation.utils';
import {PeakDNotificationsUtils} from 'utils/notifications.utils';
type Props = {
  user: ActiveAccount;
} & PropsFromRedux;

type NotificationListItemProps = {
  notification: Notification;
  onClick: (notification: Notification) => void;
  styles: any;
  theme: Theme;
};

const NotificationsModal = ({
  notifications,
  user,
  markAllNotificationsAsRead,
  loadNotifications,
  addTab,
}: Props) => {
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [displayScrollToTop, setDisplayedScrollToTop] = useState(false);

  const flatListRef = useRef<FlatList<Notification>>(null);

  const {width} = useWindowDimensions();
  const {theme} = useThemeContext();
  const styles = getStyles(theme, width);

  const handleClick = useCallback(
    (notification: Notification) => {
      addTab(notification.externalUrl || notification.txUrl);
      goBackAndNavigate('Browser');
    },
    [addTab],
  );

  useEffect(() => {
    setLoadingNotifications(false);
  }, [notifications.list.length]);

  const markAllAsRead = async () => {
    setLoadingNotifications(true);
    await PeakDNotificationsUtils.markAllAsRead(user);
    markAllNotificationsAsRead();
    SimpleToast.show(translate('components.notifications.mark_as_read'), {
      duration: SimpleToast.durations.LONG,
    });
    goBack();
  };

  const handleScroll = (event: any) => {
    const {y: innerScrollViewY} = event.nativeEvent.contentOffset;
    if (isLoadingMore) return;
    setDisplayedScrollToTop(innerScrollViewY >= 50);
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    console.log('handleLoadMore');
    loadNotifications(user.name, notifications.list);
  };

  const NotificationListItem = React.memo(
    ({notification, onClick, styles, theme}: NotificationListItemProps) => (
      <>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => onClick(notification)}
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
    ),
  );

  const renderItem = useCallback(
    (notification: Notification) => (
      <NotificationListItem
        notification={notification}
        onClick={handleClick}
        styles={styles}
        key={notification.id}
        theme={theme}
      />
    ),
    [handleClick, styles, theme],
  );

  return (
    <View style={styles.modal}>
      <View style={styles.header}>
        <Text style={getHeaderTitleStyle(theme, width)}>
          {translate('settings.settings.notifications.title')}
        </Text>
        {notifications.list.find((e) => !e.read) ? (
          <EllipticButton
            title={translate(
              'components.notifications.notification_set_all_as_read',
            )}
            onPress={markAllAsRead}
            style={[getButtonStyle(theme, width).outline, styles.actionButton]}
          />
        ) : null}
      </View>
      <Separator />
      {!loadingNotifications && (
        <FlatList
          ref={flatListRef}
          data={notifications.list}
          initialNumToRender={20}
          scrollEnabled
          onScroll={handleScroll}
          onEndReachedThreshold={0.5}
          renderItem={({item}) => renderItem(item)}
          keyExtractor={(notification) => notification.id}
          onEndReached={() => {
            if (notifications.hasMore) handleLoadMore();
          }}
          ListFooterComponent={() => (
            <Separator height={initialWindowMetrics.insets.bottom} />
          )}
        />
      )}
      {!loadingNotifications && displayScrollToTop && (
        <BackToTopButton
          theme={theme}
          element={flatListRef}
          isScrollView={false}
        />
      )}
      {loadingNotifications && (
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
      paddingHorizontal: 12,
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
      height: '100%',
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
    notifications: state.notifications,
    properties: state.properties.globals,
  }),
  {addTab, markAllNotificationsAsRead, loadNotifications},
);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(NotificationsModal);
