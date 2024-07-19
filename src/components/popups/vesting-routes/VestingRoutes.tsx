import Carousel from 'components/carousel/carousel';
import { WalletNavigation } from 'navigators/MainDrawer.types';
import { ModalScreenProps } from 'navigators/Root.types';
import React, { useEffect, useState } from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { ConnectedProps, connect } from 'react-redux';
import { Theme, useThemeContext } from 'src/context/theme.context';
import {
  PRIMARY_RED_COLOR,
  getColors
} from 'src/styles/colors';
import { getModalBaseStyle } from 'src/styles/modal';
import {
  body_primary_body_1,
  getFontSizeSmallDevices,
  headlines_primary_headline_2
} from 'src/styles/typography';
import { RootState } from 'store';
import { Dimensions } from 'utils/common.types';
import { translate } from 'utils/localize';
import { goBack, navigate } from 'utils/navigation';
import { AccountVestingRoutesDifferences } from './vesting-routes.interface';
import { VestingRoutesItemComponent } from './VestingRoutesItem';

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
  const [moveNext, setMoveNext] = useState<boolean>(false);

  useEffect(() => {
    if (vestingRoutesDifferences && vestingRoutesDifferences.length > 0) {
      navigate('ModalScreen', {
        name: 'VestingRoutesPopup',
        modalContent: renderContent(),
        onForceCloseModal: handleClose,
        modalContainerStyle: getModalBaseStyle(theme).roundedTop,
      } as ModalScreenProps);
    }
  }, [vestingRoutesDifferences, moveNext]);

  const handleClose = async () => {
    setVestingRoutesDifferences(undefined);
    goBack();
  };

  const styles = getStyles(theme, useWindowDimensions());

  const renderContent = () => {
    return (
      <View aria-label="vesting-routes-component" style={[styles.rootContainer]}>
        <View style={styles.paddingTop}>
        <Text style={[styles.baseText, styles.title, styles.marginBottom]}>
          {translate('popup.vesting_routes.title')}
        </Text>
        <Text style={{textAlign: 'center'}}>
          <Text style={[styles.baseText, styles.description]}>
            {translate('popup.vesting_routes.warning_message')}
          </Text>
          <Text
            style={[styles.baseText, styles.description, styles.highlight]}
            onPress={() => {
              Linking.openURL('https://discord.gg/UpXnBQtJw7');
            }}>
            {translate('common.discord_server')}
          </Text>
        </Text>
        </View>
        {vestingRoutesDifferences && (
          <View style={[styles.carouselContainer]}>
          <Carousel
            buttonsConfig={{
              prevTitle: 'not_used',
              nextTitle: 'not_used',
              lastTitle: 'not_used',
            }}
            content={vestingRoutesDifferences}
            renderItem={(item) => (
              <VestingRoutesItemComponent
                accountVestingRouteDifference={item}
                nextCarouselSlide={() => {
                  setMoveNext(true);
                }}
                isLast={
                  item.account ===
                  vestingRoutesDifferences[vestingRoutesDifferences.length - 1]
                    .account
                }
                clearDisplayWrongVestingRoutes={handleClose}
              />
            )}
            theme={theme}
            hideButtons
            moveNext={moveNext}
            resetMoveNext={() => setMoveNext(false)}
          />
          </View>
        )}
      </View>
    );
  };
  return null;
};

const getStyles = (theme: Theme, screenDimensions: Dimensions) =>
  StyleSheet.create({
    rootContainer: {
      display: 'flex',
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'space-evenly',
      height: screenDimensions.height * 0.6,
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
    highlight: {
      color: PRIMARY_RED_COLOR,
    },
    carouselContainer: {display: 'flex', height: '60%', width: '100%', flexGrow: 1, justifyContent: 'center'},
     marginBottom: {marginBottom: 12},
     paddingTop: {paddingTop: 20}
  });

const connector = connect((state: RootState) => {
  return {accounts: state.accounts};
}, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

export const VestingRoutesPopup = connector(VestingRoutes);
