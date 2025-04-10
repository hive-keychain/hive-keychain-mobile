import {Account} from 'actions/interfaces';
import EllipticButton from 'components/form/EllipticButton';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import SafeArea from 'components/ui/SafeArea';
import Separator from 'components/ui/Separator';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {MainNavigation} from 'navigators/Root.types';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import QRCode from 'react-qr-code';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_3,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {RootState} from 'store';
import AccountUtils from 'utils/account.utils';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';

export const QR_CONTENT_PREFIX = 'keychain://add_accounts=';

const ExportQRAccounts = ({
  account,
  navigation,
  accounts,
}: PropsFromRedux & {navigation: MainNavigation}) => {
  useLockedPortrait(navigation);

  const username = account.name;
  if (!username) return null;

  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, {width, height});
  const [accountsDataQR, setaccountsDataQR] = useState<
    {
      data: Account[];
      index: number;
      total: number;
    }[]
  >([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const qrCodeRef = useRef<View>(null);

  useEffect(() => {
    exportAllAccountsQR();
  }, []);

  const exportAllAccountsQR = () => {
    let tempAccountsDataQR: {
      data: Account[];
      index: number;
      total: number;
    }[] = [];
    let index = 0;
    for (let i = 0; i < accounts.length; i += 2) {
      index++;
      const tempLocalAccountsChunk = [...accounts].splice(i, 2);
      tempAccountsDataQR.push({
        data: tempLocalAccountsChunk.map((t) =>
          AccountUtils.generateQRCodeFromAccount(t),
        ),
        index,
        total: Math.ceil(accounts.length / 2),
      });
    }
    setaccountsDataQR(tempAccountsDataQR);
  };

  const encode = (value: string) => {
    return Buffer.from(value).toString('base64');
  };

  const moveNext = () => {
    if (pageIndex === accountsDataQR.length - 1) {
      return;
    } else {
      setPageIndex((newPageIndex) => newPageIndex + 1);
    }
  };

  const movePrevious = () => {
    if (pageIndex === 0) {
      return;
    } else {
      setPageIndex((newPageIndex) => newPageIndex - 1);
    }
  };

  return (
    <Background theme={theme}>
      <SafeArea style={styles.safeArea}>
        <FocusAwareStatusBar />
        <View style={styles.qrCardContainer}>
          {accountsDataQR.length > 0 && (
            <View style={styles.qrCard}>
              <Text style={[styles.textBase, styles.disclaimer]}>
                {translate(
                  'components.export_qr_accounts.qr_exported_set_disclaimer1',
                ) + ' '}
              </Text>
              <Text
                style={[
                  styles.textBase,
                  styles.disclaimer,
                  styles.disclaimer_two,
                ]}>
                {translate('components.export_qr_accounts.qr_disclaimer2')}
              </Text>
              <View style={{alignItems: 'center'}}>
                <View style={{height: 50}}>
                  <Text style={[styles.textBase, styles.qrAccounts]}>
                    {accountsDataQR[pageIndex].index}/
                    {accountsDataQR[pageIndex].total} : @
                    {accountsDataQR[pageIndex].data
                      .map((e) => e.name)
                      .join(', @')}
                  </Text>
                </View>
                <Separator height={10} />
                <View ref={qrCodeRef}></View>
                <GestureRecognizer
                  onSwipeLeft={moveNext}
                  onSwipeRight={movePrevious}>
                  <QRCode
                    fgColor={getColors(theme).primaryText}
                    bgColor={'transparent'}
                    size={300}
                    value={`${QR_CONTENT_PREFIX}${encode(
                      JSON.stringify(accountsDataQR[pageIndex]),
                    )}`}
                  />
                </GestureRecognizer>
              </View>
              <Separator height={16} />
              <View style={styles.buttonsContainer}>
                <EllipticButton
                  style={[styles.button, pageIndex === 0 && styles.hidden]}
                  title={translate('common.previous')}
                  onPress={movePrevious}
                />
                <EllipticButton
                  style={[
                    styles.button,
                    pageIndex === accountsDataQR.length - 1 && styles.hidden,
                  ]}
                  title={translate('common.next')}
                  onPress={moveNext}
                  isWarningButton
                />
              </View>
            </View>
          )}
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
      justifyContent: 'center',
      width: '100%',
    },
    hidden: {opacity: 0},
    textBase: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_3,
    },
    disclaimer: {
      fontSize: getFontSizeSmallDevices(width, 14),
      textAlign: 'left',
      marginBottom: 5,
      marginTop: 10,
    },
    disclaimer_two: {
      marginBottom: 10,
    },
    qrCard: {
      display: 'flex',
      alignItems: 'center',
      padding: 10,
      width: '100%',
    },
    qrAccounts: {
      textAlign: 'center',
    },
    button: {
      width: '40%',
    },
    buttonsContainer: {
      width: '85%',
      marginTop: 20,
      justifyContent: 'space-between',
      flexDirection: 'row',
      display: 'flex',
      alignItems: 'center',
    },
  });

const mapStateToProps = (state: RootState) => ({
  account: state.activeAccount,
  accounts: state.accounts,
});
const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(ExportQRAccounts);
