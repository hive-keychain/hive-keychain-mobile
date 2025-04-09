import {showModal} from 'actions/message';
import OperationButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import UserDropdown from 'components/form/UserDropdown';
import Icon from 'components/hive/Icon';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Loader from 'components/ui/Loader';
import Separator from 'components/ui/Separator';
import {ExportTransactionsUtils} from 'hive-keychain-commons';
import React, {useState} from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import FileViewer from 'react-native-file-viewer';
import SimpleToast from 'react-native-simple-toast';
import {connect, ConnectedProps} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {MessageModalType} from 'src/enums/messageModal.enums';
import {getColors, PRIMARY_RED_COLOR} from 'src/styles/colors';
import {getHorizontalLineStyle} from 'src/styles/line';
import {
  body_primary_body_2,
  body_primary_body_3,
  button_link_primary_medium,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {RootState} from 'store';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
const ExportTransaction = ({active, showModal}: PropsFromRedux) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useWindowDimensions());
  const [exporting, setExporting] = useState<boolean>(false);
  const {width, height} = useWindowDimensions();
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date(Date.now() - 86400000);
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(() => {
    const date = new Date();
    date.setHours(23, 59, 0, 0);
    return date;
  });
  const [showPicker, setShowPicker] = useState<'start' | 'end' | null>(null);

  const handleExport = async () => {
    try {
      // Fetch the transactions
      setExporting(true);
      const transactions = await ExportTransactionsUtils.fetchTransactions(
        active.name,
        startDate,
        endDate,
      );
      // Generate CSV from transactions
      const csv = ExportTransactionsUtils.generateCSV(transactions);

      const formatDateForFilename = (date: Date) =>
        date.toISOString().split('T')[0];
      const startStr = formatDateForFilename(startDate);
      const endStr = formatDateForFilename(endDate);

      const filePath = `${RNFetchBlob.fs.dirs.DownloadDir}/${active.name}-transactions-${startStr}-to-${endStr}.csv`;
      await RNFetchBlob.fs.writeFile(filePath, csv, 'utf8');

      const startReadable = startDate.toLocaleDateString('en-US');
      const endReadable = endDate.toLocaleDateString('en-US');
      showModal(
        'export_transactions.confirmation.success',
        MessageModalType.EXPORT_TRANSACTIONS_SUCCESS,
        {
          startDate: startReadable,
          endDate: endReadable,
          filePath: filePath,
          notHideOnSuccess: true,
        },
        false,
        () => {
          openFile(filePath);
        },
      );
      setExporting(false);
    } catch (error) {
      setExporting(false);
      showModal(
        'export_transactions.confirmation.error',
        MessageModalType.ERROR,
        {
          error: error.message ?? '',
          notHideOnSuccess: true,
        },
      );
    }
  };

  const openFile = async (filePath: string) => {
    try {
      await FileViewer.open(filePath);
    } catch (err) {
      SimpleToast.show(err.toString(), SimpleToast.LONG);
    }
  };

  return (
    <Background theme={theme}>
      <View style={styles.mainContainer}>
        <ScrollView style={styles.scrollContent}>
          <View style={styles.container}>
            <Separator height={25} />
            <FocusAwareStatusBar />
            <UserDropdown />
            <Separator height={height / 22} />

            <OperationInput
              editable={false}
              onPressOut={() => {
                setShowPicker('start');
              }}
              autoCapitalize={'none'}
              labelInput={translate('export_transactions.start_date')}
              placeholder={'mm/dd/yyyy'}
              value={startDate.toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              })}
              rightIcon={
                <View style={styles.flexRowCenter}>
                  <Separator
                    drawLine
                    additionalLineStyle={getHorizontalLineStyle(
                      theme,
                      1,
                      35,
                      16,
                    )}
                  />
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      setShowPicker('start');
                    }}>
                    <Icon
                      name={Icons.CALENDAR}
                      {...styles.icon}
                      color={PRIMARY_RED_COLOR}
                    />
                  </TouchableOpacity>
                </View>
              }
            />

            <Separator height={height / 50} />
            <OperationInput
              editable={false}
              onPressOut={() => {
                setShowPicker('start');
              }}
              autoCapitalize={'none'}
              labelInput={translate('export_transactions.end_date')}
              placeholder={'mm/dd/yyyy'}
              value={endDate.toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
              })}
              rightIcon={
                <View style={styles.flexRowCenter}>
                  <Separator
                    drawLine
                    additionalLineStyle={getHorizontalLineStyle(
                      theme,
                      1,
                      35,
                      16,
                    )}
                  />
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                      setShowPicker('end');
                    }}>
                    <Icon
                      name={Icons.CALENDAR}
                      {...styles.icon}
                      color={PRIMARY_RED_COLOR}
                    />
                  </TouchableOpacity>
                </View>
              }
            />
            <Separator height={height / 22} />
          </View>
        </ScrollView>

        {exporting ? (
          <View style={[styles.buttonWrapper]}>
            <Loader animating size={'small'} />
          </View>
        ) : (
          <View style={styles.buttonWrapper}>
            <OperationButton
              title={translate('common.export')}
              onPress={() => handleExport()}
              isWarningButton
              additionalTextStyle={styles.buttonText}
            />
          </View>
        )}

        {showPicker && (
          <Modal
            visible={showPicker === 'start' || showPicker === 'end'}
            transparent={true}
            animationType="fade">
            <TouchableOpacity
              style={styles.datePickerOverlay}
              onPress={() => {
                setShowPicker(null);
              }}>
              <View style={styles.datePickerContainer}>
                <View style={styles.datePickerWrapper}>
                  <Text style={styles.text}>
                    {showPicker === 'start'
                      ? translate(
                          'export_transactions.date_picker.choose_start_date',
                        )
                      : translate(
                          'export_transactions.date_picker.choose_ending_date',
                        )}
                  </Text>
                  <Separator />
                  <DatePicker
                    theme={theme}
                    modal={false}
                    mode="date"
                    maximumDate={new Date()}
                    minimumDate={showPicker === 'end' ? startDate : undefined}
                    title={
                      showPicker === 'start'
                        ? translate(
                            'export_transactions.date_picker.choose_start_date',
                          )
                        : translate(
                            'export_transactions.date_picker.choose_ending_date',
                          )
                    }
                    date={showPicker === 'start' ? startDate : endDate}
                    dividerColor={getColors(theme).cardBorderColorContrast}
                    buttonColor={getColors(theme).secondaryText}
                    onDateChange={(date) => {
                      if (showPicker === 'start') {
                        const startDateTime = new Date(date);
                        startDateTime.setHours(0, 0, 0, 0);
                        setStartDate(startDateTime);
                      } else {
                        const endDateTime = new Date(date);
                        endDateTime.setHours(23, 59, 59, 999);
                        setEndDate(endDateTime);
                      }
                    }}
                  />
                </View>
                <Separator />
                <View style={styles.datePickerButtonContainer}>
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowPicker(null)}>
                    <Text style={styles.datePickerButtonText}>
                      {translate('common.confirm')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        )}
      </View>
    </Background>
  );
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
    },
    scrollContent: {
      flex: 1,
    },
    container: {
      paddingHorizontal: 16,
    },
    buttonWrapper: {
      padding: 16,
      paddingBottom: 25,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemDropdown: {
      paddingHorizontal: 18,
    },
    marginTop: {marginTop: 20},
    text: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_2,
      fontSize: getFontSizeSmallDevices(width, 18),
    },
    textOperations: {
      ...body_primary_body_3,
      fontSize: getFontSizeSmallDevices(
        width,
        {...body_primary_body_3}.fontSize,
      ),
    },
    textNoPref: {
      textAlign: 'center',
      marginTop: 20,
    },
    flexRowCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },
    searchBar: {
      borderRadius: 33,
      marginVertical: 10,
      width: '100%',
      height: 45,
    },
    opacity: {
      opacity: 0.7,
    },
    marginVertical: {
      marginVertical: 15,
    },
    paddingHorizontal: {
      paddingHorizontal: 10,
    },
    centeredText: {textAlign: 'left'},

    flexCentered: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    buttonText: {
      ...button_link_primary_medium,
      fontSize: getFontSizeSmallDevices(
        width,
        {...button_link_primary_medium}.fontSize,
      ),
    },
    icon: {
      width: 18,
      height: 18,
    },
    datePickerOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: '#212838bc',
    },
    datePickerContainer: {
      width: '100%',
      backgroundColor: getColors(theme).cardBgColor,
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      paddingTop: 20,
    },
    datePickerWrapper: {
      alignItems: 'center',
      width: '100%',
    },
    datePickerButtonContainer: {
      flexDirection: 'row',
      height: 50,
      marginTop: 20,
      paddingHorizontal: '20%',
      marginBottom: 16,
      gap: 10,
    },
    datePickerButton: {
      flex: 1,
      backgroundColor: PRIMARY_RED_COLOR,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 25,
    },
    datePickerButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '500',
    },
  });
const mapStateToProps = (state: RootState) => ({
  active: state.activeAccount,
});

const connector = connect(mapStateToProps, {showModal});
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ExportTransaction);
