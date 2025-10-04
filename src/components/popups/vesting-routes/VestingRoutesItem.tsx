import {KeyTypes} from 'actions/interfaces';
import ActiveOperationButton from 'components/form/ActiveOperationButton';
import EllipticButton from 'components/form/EllipticButton';
import React, {useState} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import SimpleToast from 'react-native-root-toast';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Dimensions} from 'src/interfaces/common.interface';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_3,
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import {translate} from 'utils/localize';
import {VestingRoutesUtils} from 'utils/vestingRoutes.utils';
import {
  AccountVestingRoutesDifferences,
  VestingRoute,
  VestingRouteDifference,
} from './vestingRoutes.interface';

interface Props {
  accountVestingRouteDifference: AccountVestingRoutesDifferences;
  nextCarouselSlide: () => void;
  clearDisplayWrongVestingRoutes: () => void;
  isLast: boolean;
}

const VestingRoutesItem = ({
  accountVestingRouteDifference,
  nextCarouselSlide,
  clearDisplayWrongVestingRoutes,
  isLast,
  accounts,
}: Props & PropsFromRedux) => {
  const {account, differences} = accountVestingRouteDifference;
  const [isLoadingRevertAction, setIsLoadingRevertAction] = useState(false);
  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, {width, height}, differences.length);

  const renderVestingItemDetails = (
    vestingRoute: VestingRoute,
    vestingRouteType: 'old' | 'new',
  ) => {
    const additionalStyleType =
      vestingRouteType === 'old' ? styles.oldType : styles.newType;
    return (
      <View
        key={`vesting-item-details-${vestingRoute.toAccount}-${vestingRouteType}-${vestingRoute.percent}`}
        style={[styles.vestingItemDetailsContainer, additionalStyleType]}>
        <Text style={[styles.textBase, styles.title]}>
          {translate('popup.vesting_routes.item_details_from_title')}
          {`@${vestingRoute.fromAccount}`}
        </Text>
        <Text style={[styles.textBase, styles.title]}>
          {translate('popup.vesting_routes.item_details_to_title')}
          {`@${vestingRoute.toAccount}`}
        </Text>
        <Text style={[styles.textBase, styles.title]}>
          {translate('popup.vesting_routes.item_details_percent_title')}
          {vestingRoute.percent / 100}
        </Text>
        <Text style={[styles.textBase, styles.title]}>
          {translate('popup.vesting_routes.item_details_autovest_title')}
          {vestingRoute.autoVest.toString()}
        </Text>
      </View>
    );
  };

  const renderNone = () => {
    return (
      <View
        key={`vesting-item-details-none`}
        style={styles.vestingItemDetailsContainer}>
        <Text style={[styles.textBase, styles.title]}>
          {translate('popup.vesting_routes.item_details_non_existent_label')}
        </Text>
      </View>
    );
  };

  const skipAndSave = async (
    differences: VestingRouteDifference[],
    account: string,
  ) => {
    await VestingRoutesUtils.skipAccountRoutes(differences, account);
    checkForNextSlideOrHidePopup();
  };

  const checkForNextSlideOrHidePopup = () => {
    if (!isLast) return nextCarouselSlide();
    SimpleToast.show(
      translate('popup.vesting_routes.toast.handled_successfully'),
      {
        duration: SimpleToast.durations.LONG,
      },
    );
    clearDisplayWrongVestingRoutes();
  };

  const revert = async (
    differences: VestingRouteDifference[],
    account: string,
  ) => {
    setIsLoadingRevertAction(true);
    await VestingRoutesUtils.revertAccountRoutes(
      accounts,
      differences,
      account,
    );
    setIsLoadingRevertAction(false);
    checkForNextSlideOrHidePopup();
  };

  return (
    <View
      key={`vesting-routes-item${account}`}
      style={[styles.carouselItemContainer]}>
      <Text style={[styles.textBase, styles.accountTitle]}>
        {translate('popup.vesting_routes.account_item_label') + ': @'}
        {account}
      </Text>

      <ScrollView
        contentContainerStyle={[styles.vestingItemListContainer]}
        key={`${account}-vesting-item-list-container`}>
        <View style={styles.vestingRoutesTitlesContainer}>
          <Text
            style={[
              styles.textBase,
              styles.vestingRouteTitle,
              styles.oldRoute,
            ]}>
            {translate('popup.vesting_routes.account_item_old_route_title')}
          </Text>

          <Text
            style={[
              styles.textBase,
              styles.vestingRouteTitle,
              styles.newRoute,
            ]}>
            {translate('popup.vesting_routes.account_item_new_route_title')}
          </Text>
        </View>
        {differences.map(({oldRoute, newRoute}) => {
          const id = oldRoute?.toAccount ?? newRoute?.toAccount;
          return (
            <View
              key={`vesting-route-card-item-current-${id}`}
              style={[
                getCardStyle(theme).roundedCardItem,
                styles.vestingRouteCardItem,
              ]}>
              {oldRoute
                ? renderVestingItemDetails(oldRoute, 'old')
                : renderNone()}
              {newRoute
                ? renderVestingItemDetails(newRoute, 'new')
                : renderNone()}
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.vestingActionButtonsContainer}>
        <EllipticButton
          title={translate(
            'popup.vesting_routes.account_item_button_skip_label',
          )}
          onPress={() => skipAndSave(differences, account)}
          additionalTextStyle={styles.buttonDynamicText}
          style={styles.widerButton}
        />
        <ActiveOperationButton
          method={KeyTypes.active}
          isLoading={isLoadingRevertAction}
          onPress={() => revert(differences, account)}
          title={translate(
            'popup.vesting_routes.account_item_button_revert_label',
          )}
          style={styles.button}
          additionalTextStyle={styles.buttonDynamicText}
        />
      </View>
    </View>
  );
};

const getStyles = (
  theme: Theme,
  screenDimensions: Dimensions,
  vestingRoutesItemCount: number,
) =>
  StyleSheet.create({
    carouselItemContainer: {
      display: 'flex',
      height: '100%',
      width: '100%',
      flexGrow: 1,
      paddingBottom: 10,
    },
    textBase: {
      color: getColors(theme).secondaryText,
    },
    accountTitle: {
      ...headlines_primary_headline_2,
      fontSize: getFontSizeSmallDevices(screenDimensions.width, 16),
      textAlign: 'center',
    },
    vestingRoutesTitlesContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    vestingRouteTitle: {
      ...body_primary_body_3,
      fontSize: getFontSizeSmallDevices(
        screenDimensions.width,
        body_primary_body_3.fontSize,
      ),
    },
    oldRoute: {marginLeft: 16},
    newRoute: {marginRight: 16},
    vestingItemListContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: vestingRoutesItemCount === 1 ? 'center' : 'flex-start',
      flex: vestingRoutesItemCount === 1 ? 1 : 0,
    },
    vestingActionButtonsContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    button: {backgroundColor: '#68A0B4', width: '35%'},
    vestingItemDetailsContainer: {
      display: 'flex',
    },
    oldType: {
      alignItems: 'flex-start',
    },
    newType: {
      alignItems: 'flex-end',
    },
    title: {
      ...body_primary_body_3,
      fontSize: getFontSizeSmallDevices(screenDimensions.width, 12),
    },
    vestingRouteCardItem: {
      marginBottom: vestingRoutesItemCount > 1 ? 8 : 0,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: vestingRoutesItemCount > 1 ? 16 : 10,
      paddingHorizontal: 8,
    },
    widerButton: {width: '60%'},
    buttonDynamicText: {
      fontSize: getFontSizeSmallDevices(screenDimensions.width, 12),
    },
  });

const connector = connect((state: RootState) => {
  return {accounts: state.accounts};
}, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

export const VestingRoutesItemComponent = React.memo(
  connector(VestingRoutesItem),
);
