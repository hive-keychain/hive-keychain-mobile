import ActiveOperationButton from 'components/form/ActiveOperationButton';
import AssetImage from 'components/ui/AssetImage';
import {BackToTopButton} from 'components/ui/Back-To-Top-Button';
import Separator from 'components/ui/Separator';
import React, {useRef, useState} from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {BuyCoinType} from 'src/enums/operations.enum';
import {getBuyCoinsListItem} from 'src/lists/buyHive.list';
import {getButtonStyle} from 'src/styles/button';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {
  getFontSizeSmallDevices,
  title_secondary_body_2,
  title_secondary_body_3,
} from 'src/styles/typography';
import {RootState} from 'store';
import {capitalize} from 'utils/format.utils';
import {translate} from 'utils/localize';
import OperationThemed from './OperationThemed';

export type BuyCoinsprops = {
  currency: BuyCoinType;
  iconColor: string;
};
type Props = PropsFromRedux & BuyCoinsprops;

const BuyCoinsComponent = ({user, currency}: Props) => {
  const [displayScrollToTop, setDisplayedScrollToTop] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const renderListItem = (item: any) => {
    const handleOnClick = () => {
      Linking.openURL(item.link);
    };
    return (
      <View
        key={`${item.image}`}
        style={[
          getCardStyle(theme).defaultCardItem,
          styles.border,
          styles.marginVertical,
        ]}>
        <ActiveOperationButton
          title={translate('wallet.operations.buy_coins.title_buy')}
          isLoading={false}
          onPress={handleOnClick}
          style={[getButtonStyle(theme).warningStyleButton, styles.buyButton]}
        />
        <View style={styles.marginLeft}>
          <View>
            <View style={{width: 60, height: 60}}>
              <AssetImage
                theme={theme}
                withoutSVGContainer
                nameImage={item.image.split('.')[0]}
              />
            </View>
            <Text style={[styles.textBase, styles.textTitle]}>
              {capitalize(item.image.split('.')[0])}
            </Text>
          </View>
          <Text style={[styles.textBase, styles.textDesc, styles.opaque]}>
            {translate(`wallet.operations.buy_coins.${item.description}`)}
          </Text>
        </View>
        <Separator />
      </View>
    );
  };

  const renderExchangeItem = (item: any) => {
    const handleOnClick = () => {
      Linking.openURL(item.link);
    };
    return (
      <View
        key={`${item.image}`}
        style={[
          getCardStyle(theme).defaultCardItem,
          {width: '48%', paddingHorizontal: 0, paddingVertical: 0},
          styles.border,
        ]}>
        <AssetImage
          theme={theme}
          nameImage={item.image.split('.')[0]}
          containerStyles={{
            borderWidth: 0,
          }}
          onClick={handleOnClick}
        />
      </View>
    );
  };

  const {theme} = useThemeContext();
  const {height} = useWindowDimensions();

  const styles = getDimensionedStyles(height, theme);

  return (
    <OperationThemed
      additionalSVGOpacity={1}
      additionalBgSvgImageStyle={{
        top: -70,
        opacity: 1,
      }}
      additionalContentContainerStyle={styles.content}
      childrenMiddle={
        <ScrollView ref={scrollViewRef}>
          <Separator />
          <View style={styles.marginHorizontal}>
            <View>
              {getBuyCoinsListItem(currency, user.name!).list.map((listItem) =>
                renderListItem(listItem),
              )}
            </View>
            <Separator height={25} />
            <View
              style={[
                getCardStyle(theme).defaultCardItem,
                styles.border,
                {paddingHorizontal: 10, paddingVertical: 10},
              ]}>
              <Text
                style={[
                  styles.textBase,
                  styles.textTitle,
                  styles.textCentered,
                ]}>
                {translate('wallet.operations.buy_coins.title_exchanges')}
              </Text>
              <Separator />
              <View
                style={[
                  {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                  },
                ]}>
                {getBuyCoinsListItem(currency, user.name!).exchanges.map(
                  (exchange) => renderExchangeItem(exchange),
                )}
              </View>
            </View>
          </View>
          {displayScrollToTop && (
            <BackToTopButton
              theme={theme}
              element={scrollViewRef}
              isScrollView
            />
          )}
        </ScrollView>
      }
    />
  );
};
const connector = connect((state: RootState) => {
  return {
    user: state.activeAccount,
  };
}, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

const getDimensionedStyles = (width: number, theme: Theme) =>
  StyleSheet.create({
    buyButton: {
      position: 'absolute',
      top: 3,
      right: 3,
      backgroundColor: PRIMARY_RED_COLOR,
      width: width / 7,
      marginHorizontal: 0,
      borderTopRightRadius: 16,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 0,
    },
    marginHorizontal: {
      marginHorizontal: 12,
    },
    marginVertical: {
      marginVertical: 5,
    },
    textBase: {
      color: getColors(theme).secondaryText,
    },
    textTitle: {
      ...title_secondary_body_2,
    },
    textDesc: {
      ...title_secondary_body_3,
      fontSize: getFontSizeSmallDevices(width, 15),
    },
    opaque: {
      opacity: 0.8,
    },
    marginLeft: {
      marginLeft: 30,
    },
    border: {
      borderColor: getColors(theme).secondaryCardBorderColor,
    },
    textCentered: {
      textAlign: 'center',
    },
    content: {
      borderWidth: 0,
      borderColor: '#00000000',
      backgroundColor: '#00000000',
    },
  });

export default connector(BuyCoinsComponent);
