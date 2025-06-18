import {ActiveAccount} from 'actions/interfaces';
import {showModal} from 'actions/message';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {getColors} from 'src/styles/colors';
import {
  getFontSizeSmallDevices,
  title_primary_body_2,
} from 'src/styles/typography';
import {formatBalance} from 'utils/format';
import {getCurrency} from 'utils/hive';
import {getAccount} from 'utils/hiveUtils';
import {SwapTokenUtils} from 'utils/swap-token.utils';

type Props = {
  username: string;
  startToken: string;
  amount: number;
  accounts: ActiveAccount[];
};

export default ({username, startToken, amount, accounts}: Props) => {
  const {theme} = useThemeContext();
  const {width} = useWindowDimensions();
  const styles = getStyles(theme, width);
  const [balance, setBalance] = useState<number>();
  const [balanceAfterSwap, setBalanceAfterSwap] = useState<string>();

  const getBalance = async () => {
    const account = accounts.find((e) => e.name === username);
    if (!account) return 0;

    try {
      const extendedAccount = await getAccount(username);
      if (!extendedAccount) return 0;

      let balance = 0;
      if (startToken === getCurrency('HBD')) {
        balance = parseFloat(
          (extendedAccount.hbd_balance as string).split(' ')[0],
        );
      } else if (startToken === getCurrency('HIVE')) {
        balance = parseFloat((extendedAccount.balance as string).split(' ')[0]);
      } else {
        const tokenBalances = await SwapTokenUtils.getSwapTokenStartList(
          extendedAccount,
        );
        if (tokenBalances && tokenBalances.length > 0) {
          const tokenBalance = tokenBalances.find(
            (token) => token.symbol === startToken,
          );
          if (tokenBalance) {
            balance = parseFloat(tokenBalance.balance);
          }
        }
      }

      return balance;
    } catch (error) {
      showModal('request.error.swap.fetching_balance', MessageModalType.ERROR, {
        error: error.message,
      });
      return 0;
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        const balance = await getBalance();
        setBalance(balance);
        const newBalanceAfterSwap = Number((balance - amount).toFixed(3));
        const formattedBalanceAfterSwap = formatBalance(newBalanceAfterSwap);
        setBalanceAfterSwap(formattedBalanceAfterSwap);
      } catch (error) {
        console.error('Error initializing data:', error);
        showModal(
          'request.error.swap.fetching_balance',
          MessageModalType.ERROR,
          {
            error: error.message,
          },
        );
      }
    };

    initializeData();
  }, [startToken, username, accounts, amount]);

  return (
    <View style={styles.container}>
      <Text style={[styles.textBase, styles.title]}>Balance</Text>
      <Text style={[styles.textBase, styles.content, styles.opaque]}>
        {balance !== undefined
          ? Number(balanceAfterSwap) < 0
            ? `${balance} ${startToken} ==>  Insufficient Balance`
            : `${balance} ${startToken} ==>  ${balanceAfterSwap} ${startToken}`
          : 'calculating...'}
      </Text>
    </View>
  );
};

const getStyles = (theme: Theme, width: number) =>
  StyleSheet.create({
    container: {paddingVertical: 5},
    title: {fontSize: getFontSizeSmallDevices(width, 14)},
    content: {fontSize: getFontSizeSmallDevices(width, 14)},
    textBase: {
      color: getColors(theme).secondaryText,
      ...title_primary_body_2,
    },
    opaque: {
      opacity: 0.8,
    },
  });
