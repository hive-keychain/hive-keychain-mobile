import Icon from 'components/hive/Icon';
import {BackToTopButton} from 'components/ui/BackToTopButton';
import Loader from 'components/ui/Loader';
import {VscCall, VscTransfer, VscUtils} from 'hive-keychain-commons';
import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Linking,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {connect, ConnectedProps} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getColors} from 'src/styles/colors';
import {getCaptionStyle} from 'src/styles/text';
import {fields_primary_text_1} from 'src/styles/typography';
import {RootState} from 'store';
import {VscConfig} from 'utils/config';
import {translate} from 'utils/localize';
import VscHistoryItemComponent from './VscHistoryItemComponent';

const VscHistoryComponent = ({activeAccountName}: PropsFromRedux) => {
  const [transactions, setTransactions] = useState<(VscTransfer | VscCall)[]>();
  const [displayScrollToTop, setDisplayedScrollToTop] = useState(false);
  const vscItemList = useRef<ScrollView>(null);
  const [loading, setLoading] = useState(true);
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();
  const styles = getStyles(theme);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    const transactions = await VscUtils.getOrganizedHistory(activeAccountName!);
    setTransactions(transactions);
    setLoading(false);
  };

  const renderListItem = (transaction: VscTransfer | VscCall) => {
    return (
      <VscHistoryItemComponent key={transaction.id} transaction={transaction} />
    );
  };

  const handleScroll = (event: any) => {
    const {y: innerScrollViewY} = event.nativeEvent.contentOffset;
    setDisplayedScrollToTop(innerScrollViewY >= 50);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={[getCaptionStyle(width, theme), styles.header]}>
          {translate('vsc.full_history') + ' '}
          <Text
            style={styles.link}
            onPress={() =>
              Linking.openURL(
                `${VscConfig.BLOCK_EXPLORER}/@${activeAccountName}`,
              )
            }>
            {translate('vsc.full_history_block_explorer')}
          </Text>
        </Text>
        <ScrollView
          ref={vscItemList}
          onScroll={handleScroll}
          style={styles.viewContainer}>
          <FlatList
            data={transactions}
            renderItem={({item}) => renderListItem(item)}
            keyExtractor={(item) => item.id}
            style={styles.flatlist}
            ListEmptyComponent={() => {
              if (loading) {
                return <View></View>;
              } else {
                return (
                  <View style={styles.empty}>
                    <Icon name={Icons.ERROR} width={50} height={50} />
                    <View>
                      <Text style={[styles.textBase, styles.textEmpty]}>
                        {translate('vsc.empty')}
                      </Text>
                    </View>
                  </View>
                );
              }
            }}
          />
          {loading && <Loader size={'large'} animating />}
        </ScrollView>
      </View>

      {displayScrollToTop && (
        <BackToTopButton isScrollView theme={theme} element={vscItemList} />
      )}
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {height: '100%'},
    header: {marginBottom: 10, paddingHorizontal: 20},
    link: {color: getColors(theme).link},
    textBase: {
      color: getColors(theme).secondaryText,
      ...fields_primary_text_1,
    },
    viewContainer: {
      height: '100%',
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      overflow: 'scroll',
      paddingHorizontal: 10,
    },
    flatlist: {
      marginBottom: 80,
      paddingTop: 10,
      height: '100%',
    },
    empty: {
      marginTop: 10,
      marginBottom: 20,
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
    textEmpty: {marginTop: 10},
  });

const mapStateToProps = (state: RootState) => {
  return {
    activeAccountName: state.activeAccount.name,
  };
};

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(VscHistoryComponent);
