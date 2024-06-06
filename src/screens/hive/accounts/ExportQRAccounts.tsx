import {addKey, forgetAccount, forgetKey} from 'actions/accounts';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import SafeArea from 'components/ui/SafeArea';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {MainNavigation} from 'navigators/Root.types';
import React, {useState} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {MARGIN_PADDING} from 'src/styles/spacing';
import {
  button_link_primary_medium,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';

const ExportQRAccounts = ({
  account,
  forgetKey,
  forgetAccount,
  navigation,
  accounts,
}: PropsFromRedux & {navigation: MainNavigation}) => {
  useLockedPortrait(navigation);

  const username = account.name;
  if (!username) return null;

  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, {width, height});
  const [showQrCode, setShowQrCode] = useState(false);

  return (
    <Background theme={theme}>
      <SafeArea style={styles.safeArea}>
        <FocusAwareStatusBar />
        <View>
          <Text>//TODO now</Text>
        </View>
      </SafeArea>
    </Background>
  );
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    safeArea: {paddingHorizontal: 16},
    qrCardContainer: {
      display: 'flex',
      alignItems: 'center',
      marginTop: -10,
    },
    qrCard: {
      display: 'flex',
      alignItems: 'center',
      padding: 10,
      borderColor: getColors(theme).primaryText,
      borderWidth: 2,
      borderRadius: 16,
    },
    cardKey: {
      borderWidth: 1,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderColor: getColors(theme).quaternaryCardBorderColor,
      borderRadius: 19,
      paddingHorizontal: 21,
      paddingVertical: 15,
      marginBottom: 8,
    },
    avatar: {width: 30, height: 30, borderRadius: 50},
    operationButtonText: {
      ...button_link_primary_medium,
      fontSize: getFontSizeSmallDevices(
        width,
        {...button_link_primary_medium}.fontSize,
      ),
    },
    dropdownContainer: {
      width: '100%',
      padding: 0,
      borderRadius: 20,
      marginBottom: 0,
    },
    dropdownOverlay: {
      paddingHorizontal: MARGIN_PADDING,
    },
  });

const mapStateToProps = (state: RootState) => ({
  account: state.activeAccount,
  accounts: state.accounts,
});
const connector = connect(mapStateToProps, {
  forgetAccount,
  addKey,
  forgetKey,
});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(ExportQRAccounts);
