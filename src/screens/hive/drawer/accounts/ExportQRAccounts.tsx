import {Account} from 'actions/interfaces';
import CheckBoxPanel from 'components/form/CheckBoxPanel';
import EllipticButton from 'components/form/EllipticButton';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import useLockedPortrait from 'hooks/useLockedPortrait';
import {MainNavigation} from 'navigators/Root.types';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {initialWindowMetrics} from 'react-native-safe-area-context';
import GestureRecognizer from 'react-native-swipe-gestures';
import QRCode from 'react-qr-code';
import {ConnectedProps, connect} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Dimensions} from 'src/interfaces/common.interface';
import {getColors} from 'src/styles/colors';
import {
  body_primary_body_3,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {RootState} from 'store';
import AccountUtils from 'utils/account.utils';
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
  const [check1, setCheck1] = useState<boolean>(false);
  const [check2, setCheck2] = useState<boolean>(false);
  const [showQR, setShowQR] = useState<boolean>(false);
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

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Encodes a given string value into its base64 representation.
   *
   * @param value - The string to be encoded.
   * @returns The base64 encoded string.
   */

  /*******  8b3fabb0-082d-438c-bf6b-2f27e4ec0e4e  *******/
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
    <Background
      theme={theme}
      skipTop
      skipBottom
      additionalBgSvgImageStyle={{bottom: -initialWindowMetrics.insets.bottom}}>
      <View style={styles.container}>
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
              <View
                style={{
                  alignItems: 'center',
                  width: '100%',
                  flex: 1,
                }}>
                <Separator height={10} />
                {!showQR ? (
                  <View
                    style={{
                      width: '100%',
                      justifyContent: 'space-between',
                      flex: 1,
                    }}>
                    <View style={{height: 350}}>
                      <CheckBoxPanel
                        title="components.export_qr_accounts.check1"
                        onPress={() => {
                          setCheck1(!check1);
                        }}
                        checked={check1}
                        smallText
                      />
                      <CheckBoxPanel
                        title="components.export_qr_accounts.check2"
                        onPress={() => {
                          setCheck2(!check2);
                        }}
                        checked={check2}
                        smallText
                      />
                    </View>
                    <EllipticButton
                      title={translate('settings.keys.show_qr_code')}
                      style={{width: '80%'}}
                      isWarningButton
                      onPress={() => {
                        if (check1 && check2) setShowQR(true);
                      }}
                    />
                  </View>
                ) : (
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
                    <View
                      style={{
                        alignItems: 'center',
                      }}>
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
                        style={[
                          styles.button,
                          pageIndex === 0 && styles.hidden,
                        ]}
                        title={translate('common.previous')}
                        onPress={movePrevious}
                      />
                      <EllipticButton
                        style={[
                          styles.button,
                          pageIndex === accountsDataQR.length - 1 &&
                            styles.hidden,
                        ]}
                        title={translate('common.next')}
                        onPress={moveNext}
                        isWarningButton
                      />
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </View>
    </Background>
  );
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      flex: 1,
    },
    qrCardContainer: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      flexGrow: 1,
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
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    qrAccounts: {
      textAlign: 'center',
    },
    button: {
      width: '45%',
      margin: 0,
    },
    buttonsContainer: {
      width: '80%',
      marginTop: 20,
      justifyContent: 'space-between',
      flexDirection: 'row',
      display: 'flex',
    },
  });

const mapStateToProps = (state: RootState) => ({
  account: state.activeAccount,
  accounts: state.accounts,
});
const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;
export default connector(ExportQRAccounts);
