import React from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import {AccountVestingRoutesDifferences} from './vesting-routes.interface';

interface Props {
  accountVestingRouteDifference: AccountVestingRoutesDifferences;
}

const VestingRoutesItem = ({
  accountVestingRouteDifference,
}: Props & PropsFromRedux) => {
  const {account, differences} = accountVestingRouteDifference;
  const {theme} = useThemeContext();

  const styles = getStyles(theme, useWindowDimensions());

  return (
    <View key={`vesting-routes-item${account}`} style={styles.carouselItem}>
      <View style={styles.carouselItemContainer}>
        <View style={styles.accountTitle}>
          {translate('popup.vesting_routes.vesting_route_account_item_label') +
            ': @'}
          {account}
        </View>
        <View style={styles.vestingRoutesTitlesContainer}>
          <View style={[styles.vestingRouteTitle, styles.oldRoute]}>
            {translate(
              'popup.vesting_routes.vesting_route_account_item_old_route_title',
            )}
          </View>
          <View style={[styles.vestingRouteTitle, styles.newRoute]}>
            {translate(
              'popup.vesting_routes.vesting_route_account_item_new_route_title',
            )}
          </View>
        </View>
        <View
          style={styles.vestingItemListContainer}
          key={`${account}-vesting-item-list-container`}>
          {differences.map(({oldRoute, newRoute}) => {
            const id = oldRoute?.toAccount ?? newRoute?.toAccount;
            return (
              <div
                key={`vesting-route-card-item-current-${id}`}
                className="vesting-route-card-item">
                {oldRoute
                  ? renderVestingItemDetails(oldRoute, 'old')
                  : renderNone()}
                {newRoute
                  ? renderVestingItemDetails(newRoute, 'new')
                  : renderNone()}
              </div>
            );
          })}
        </View>
        <div className="vesting-action-buttons-container">
          <ButtonComponent
            dataTestId="button-skip-vesting-routes"
            type={ButtonType.ALTERNATIVE}
            label={'popup_html_vesting_route_account_item_button_skip_label'}
            onClick={() => skipAndSave(differences, account)}
            additionalClass="vesting-action-button small-font"
          />
          <OperationButtonComponent
            dataTestId="button-revert-vesting-routes"
            requiredKey={KeychainKeyTypesLC.active}
            onClick={() => revert(differences, account)}
            label={'popup_html_vesting_route_account_item_button_revert_label'}
            additionalClass={'vesting-action-button small-font'}
          />
        </div>
      </View>
    </View>
  );
};

const getStyles = (theme: Theme, screenDimensions: Dimensions) =>
  StyleSheet.create({
    carouselItem: {},
    carouselItemContainer: {},
    accountTitle: {},
    vestingRoutesTitlesContainer: {},
    vestingRouteTitle: {},
    oldRoute: {},
    newRoute: {},
    vestingItemListContainer: {},
  });

const connector = connect((state: RootState) => {
  return {accounts: state.accounts};
}, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

export const VestingRoutesItemComponent = connector(VestingRoutesItem);
