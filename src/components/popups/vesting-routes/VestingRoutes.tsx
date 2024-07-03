import Carousel from 'components/carousel/carousel';
import {WalletNavigation} from 'navigators/MainDrawer.types';
import {ModalScreenProps} from 'navigators/Root.types';
import React, {useEffect} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {
  NEUTRAL_WHITE_COLOR,
  PRIMARY_RED_COLOR,
  getColors,
} from 'src/styles/colors';
import {getModalBaseStyle} from 'src/styles/modal';
import {
  body_primary_body_1,
  button_link_primary_medium,
  getFontSizeSmallDevices,
  headlines_primary_headline_2,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import {goBack, navigate} from 'utils/navigation';
import {VestingRoutesItemComponent} from './VestingRoutesItem';
import {AccountVestingRoutesDifferences} from './vesting-routes.interface';

interface Props {
  navigation: WalletNavigation;
  vestingRoutesDifferences: AccountVestingRoutesDifferences[] | undefined;
  setVestingRoutesDifferences: (
    value: AccountVestingRoutesDifferences[],
  ) => void;
}

const VestingRoutes = ({
  navigation,
  accounts,
  vestingRoutesDifferences,
  setVestingRoutesDifferences,
}: Props & PropsFromRedux): null => {
  const {theme} = useThemeContext();

  useEffect(() => {
    if (vestingRoutesDifferences && vestingRoutesDifferences.length > 0) {
      navigate('ModalScreen', {
        name: 'VestingRoutesPopup',
        modalContent: renderContent(),
        onForceCloseModal: handleClose,
        modalContainerStyle: getModalBaseStyle(theme).roundedTop,
      } as ModalScreenProps);
    }
  }, [vestingRoutesDifferences]);

  const handleClose = async () => {
    setVestingRoutesDifferences(undefined);
    goBack();
  };

  const styles = getStyles(theme, useWindowDimensions());

  const renderContent = () => {
    return (
      <View aria-label="vesting-routes-component" style={styles.rootContainer}>
        <Text style={[styles.baseText, styles.title]}>
          {translate('popup.vesting_routes.vesting_routes_title')}
        </Text>
        <Text style={[styles.baseText, styles.description]}>
          {translate('popup.vesting_routes.vesting_routes_warning_message')}
        </Text>
        <Carousel
          buttonsConfig={{
            prevTitle: 'prev',
            nextTitle: 'next',
            lastTitle: 'last',
          }}
          carouselContent={vestingRoutesDifferences}
          renderItem={(item) => (
            <VestingRoutesItemComponent accountVestingRouteDifference={item} />
          )}
          theme={theme}
        />
      </View>
    );
  };
  return null;
};

const getStyles = (theme: Theme, screenDimensions: Dimensions) =>
  StyleSheet.create({
    rootContainer: {
      flex: 1,
      paddingHorizontal: 16,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      height: screenDimensions.height * 0.8,
    },
    baseText: {
      color: getColors(theme).secondaryText,
    },
    title: {
      textAlign: 'center',
      ...headlines_primary_headline_2,
      fontSize: getFontSizeSmallDevices(screenDimensions.width, 18),
    },
    description: {
      ...body_primary_body_1,
      fontSize: getFontSizeSmallDevices(
        screenDimensions.width,
        body_primary_body_1.fontSize,
      ),
    },
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: '100%',
      height: 60,
    },
    image: {
      aspectRatio: 1.6,
      alignSelf: 'center',
      width: '100%',
      borderRadius: 16,
    },
    warningProceedButton: {
      backgroundColor: PRIMARY_RED_COLOR,
      width: '40%',
    },
    outlineButton: {
      borderColor: getColors(theme).borderContrast,
      borderWidth: 1,
      width: '40%',
    },
    textButtonFilled: {
      ...button_link_primary_medium,
      fontSize: 13,
      color: NEUTRAL_WHITE_COLOR,
    },
  });

const connector = connect((state: RootState) => {
  return {accounts: state.accounts};
}, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

export const VestingRoutesPopup = connector(VestingRoutes);
