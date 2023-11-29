import ActiveOperationButton from 'components/form/ActiveOperationButton';
import {BackToTopButton} from 'components/hive/Back-To-Top-Button';
import AssetImage from 'components/ui/AssetImage';
import Separator from 'components/ui/Separator';
import React, {useContext, useRef, useState} from 'react';
import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {ThemeContext} from 'src/context/theme.context';
import {BuyCoinType} from 'src/enums/operations.enum';
import {BuyCoinsListItem} from 'src/reference-data/buy-coins-list-item.list';
import {getCardStyle} from 'src/styles/card';
import {RootState} from 'store';
import {capitalize} from 'utils/format';
import {translate} from 'utils/localize';

export type BuyCoinsprops = {
  currency: BuyCoinType;
  iconColor: string;
};
type Props = PropsFromRedux & BuyCoinsprops;

const BuyCoinsComponent = ({user, currency}: Props) => {
  const [displayScrollToTop, setDisplayedScrollToTop] = useState(false);
  const flatListRef = useRef();

  const renderListItem = (item: any) => {
    const handleOnClick = () => {
      Linking.openURL(item.link);
    };
    return (
      <View
        style={[getCardStyle(theme).defaultCardItem, styles.marginVertical]}>
        <View>
          <AssetImage nameImage={item.image.split('.')[0]} />
          <Text>{capitalize(item.image.split('.')[0])}</Text>
        </View>
        <Text style={styles.marginHorizontal}>
          {translate(`wallet.operations.buy_coins.${item.description}`)}
        </Text>
        <Separator height={25} />
        <View style={styles.centeredView}>
          <ActiveOperationButton
            title={translate('wallet.operations.buy_coins.title_buy')}
            isLoading={false}
            onPress={handleOnClick}
            style={styles.buyButton}
          />
        </View>
        <Separator height={15} drawLine={true} />
      </View>
    );
  };

  const renderItems = (item: any) => {
    const handleOnClick = () => {
      Linking.openURL(item.link);
    };

    if (item.titleKey) {
      return (
        <View style={styles.centeredView}>
          <Text style={styles.titleText}>{translate(item.titleKey)}</Text>
        </View>
      );
    } else if (item.name) {
      //TODO keep working bellow, make new svg based on name or try to load svg.
      return (
        <View style={getCardStyle(theme).defaultCardItem}>
          <AssetImage
            containerStyles={{
              borderRadius: 0,
              borderWidth: 0,
            }}
            nameImage={item.image.split('.')[0]}
          />
          <Text style={styles.marginHorizontal}>
            {translate(`wallet.operations.buy_coins.${item.description}`)}
          </Text>
          <Separator height={25} />
          <View style={styles.centeredView}>
            <ActiveOperationButton
              title={translate('wallet.operations.buy_coins.title_buy')}
              isLoading={false}
              onPress={handleOnClick}
              style={styles.buyButton}
            />
          </View>
          <Separator height={15} drawLine={true} />
        </View>
      );
    } else if (!item.name && item.image) {
      return (
        <View>
          <AssetImage
            containerStyles={{
              borderRadius: 0,
              borderWidth: 0,
            }}
            onClick={handleOnClick}
            nameImage={item.image.split('.')[0]}
          />
          <Separator height={5} />
        </View>
      );
    }
  };

  const onHandleScroll = (event: any) => {
    const {y: innerScrollViewY} = event.nativeEvent.contentOffset;
    setDisplayedScrollToTop(innerScrollViewY >= 50);
  };

  const {theme} = useContext(ThemeContext);
  const {height} = useWindowDimensions();

  const styles = getDimensionedStyles(height);

  return (
    <>
      <Separator />
      <View style={styles.marginHorizontal}>
        {/* <View style={styles.rowContainer}>
          <Text style={styles.switchText}>
            {translate('wallet.operations.buy_coins.title_hive')}
          </Text>
          <Switch
            trackColor={{false: '#767577', true: '#cbcacb'}}
            thumbColor={isEnabled ? '#77B9D1' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value: boolean) => {
              setIsEnabled(value);
              scrollToTop();
            }}
            value={isEnabled}
          />
          <Text style={styles.switchText}>
            {translate('wallet.operations.buy_coins.title_hbd')}
          </Text>
        </View> */}

        {/* Flatlist one list */}
        {/* <FlatList
          ref={flatListRef}
          data={ArrayUtils.mergeWithoutDuplicate(
            BuyCoinsListItem(currency, user.name).list,
            BuyCoinsListItem(currency, user.name).exchanges,
          )}
          renderItem={(item) => renderItems(item.item)}
          onScroll={onHandleScroll}
          // style={{maxHeight: '90%'}}
        /> */}

        <FlatList
          data={BuyCoinsListItem(currency, user.name!).list}
          renderItem={(item) => renderListItem(item.item)}
        />
      </View>
      {displayScrollToTop && (
        <BackToTopButton theme={theme} element={flatListRef} />
      )}
    </>
  );
};
const connector = connect((state: RootState) => {
  return {
    user: state.activeAccount,
  };
}, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

const getDimensionedStyles = (width: number) =>
  StyleSheet.create({
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    switchText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    buyButton: {
      backgroundColor: '#68A0B4',
      width: width / 5,
      marginHorizontal: 0,
    },
    centeredView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    marginHorizontal: {
      marginHorizontal: 12,
    },
    titleText: {
      fontWeight: 'bold',
      fontSize: 24,
    },
    marginVertical: {
      marginVertical: 5,
    },
    assetImage: {
      borderWidth: 1,
      flexShrink: 1,
    },
  });

export default connector(BuyCoinsComponent);
