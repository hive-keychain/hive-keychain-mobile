import {Account} from 'actions/interfaces';
import UserDropdown from 'components/form/UserDropdown';
import Separator from 'components/ui/Separator';
import React from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getFontSizeSmallDevices} from 'src/styles/typography';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import RequestItem from './RequestItem';

type Props = {
  username: string;
  accounts: Account[];
  account: string;
  setAccount: (account: string) => void;
};
export default ({username, setAccount}: Props) => {
  const {theme} = useThemeContext();
  const styles = getDimensionedStyles(useWindowDimensions(), theme);

  return username ? (
    <RequestItem
      title={translate('request.item.username')}
      content={`@${username}`}
    />
  ) : (
    <View style={styles.container}>
      <UserDropdown
        onSelected={(selectedAccount) => setAccount(selectedAccount.value)}
      />
      <Separator />
    </View>
  );
};

const getDimensionedStyles = ({width, height}: Dimensions, theme: Theme) =>
  StyleSheet.create({
    container: {width: '100%', marginBottom: 10, height: 60},

    text: {
      fontSize: getFontSizeSmallDevices(width, 13),
    },
  });
