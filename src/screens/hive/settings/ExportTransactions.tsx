import EllipticButton from 'components/form/EllipticButton';
import OperationInput from 'components/form/OperationInput';
import UserDropdown from 'components/form/UserDropdown';
import Icon from 'components/hive/Icon';
import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
import {ExportTransactionsUtils} from 'hive-keychain-commons';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {connect, ConnectedProps} from 'react-redux';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
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
import RNFetchBlob from "rn-fetch-blob";
const ExportTransaction = ({active, globals}: PropsFromRedux) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme, useWindowDimensions());
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
      const transactions = await ExportTransactionsUtils.fetchTransactions(
        active.name,
        startDate,
        endDate
       
      );

      // Generate CSV from transactions
      const csv = ExportTransactionsUtils.generateCSV(transactions);
      console.info('csv', csv);

      // Format dates for filename (e.g., 2025-03-30)
      const formatDateForFilename = (date: Date) => date.toISOString().split('T')[0];
      const startStr = formatDateForFilename(startDate);
      const endStr = formatDateForFilename(endDate);

      // Safe file path
      const path = `${RNFetchBlob.fs.dirs.DownloadDir}/${active.name}-transactions-${startStr}-to-${endStr}.csv`;

      // Save the CSV file to device storage
      await RNFetchBlob.fs.writeFile(path, csv, 'utf8');

      // Format dates for alert (e.g., MM/DD/YYYY)
      const startReadable = startDate.toLocaleDateString('en-US');
      const endReadable = endDate.toLocaleDateString('en-US');

      alert(`Transactions from ${startReadable} to ${endReadable} saved to:\n${path}`);
    } catch (error: any) {
      console.error('Error exporting transactions:', error);
      alert(`Failed to export transactions.\n${error.message ?? ''}`);
    }
  };

  return (
    <Background theme={theme}>
      <View style={styles.container}>
        <FocusAwareStatusBar />
        <UserDropdown />
        <Separator height={height / 22} />

        <Text
          style={[
            styles.text,
            styles.opacity,
            styles.paddingHorizontal,
            styles.centeredText,
          ]}>
          {translate('export_transactions.start_date')}
        </Text>
        <OperationInput
          editable={false}
          onPressOut={() => {
            setShowPicker('start');
          }}
          autoCapitalize={'none'}
          labelInput={translate('common.from')}
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
                additionalLineStyle={getHorizontalLineStyle(theme, 1, 35, 16)}
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
        <Text
          style={[
            styles.text,
            styles.opacity,
            styles.paddingHorizontal,
            styles.centeredText,
          ]}>
          {translate('export_transactions.end_date')}
        </Text>
        <OperationInput
          editable={false}
          onPressOut={() => {
            setShowPicker('start');
          }}
          autoCapitalize={'none'}
          labelInput={translate('common.to')}
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
                additionalLineStyle={getHorizontalLineStyle(theme, 1, 35, 16)}
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

        <EllipticButton
          title={translate('common.export')}
          onPress={() => {
            handleExport();
          }}
          additionalTextStyle={styles.buttonText}
          isWarningButton
        />

        {showPicker && (
          <DatePicker
            theme={theme}
            modal
            mode="date"
            maximumDate={new Date()}
            minimumDate={showPicker === 'end' ? startDate : undefined}
            title={showPicker ? `Select ${showPicker} date` : undefined}
            open={showPicker === 'start' || showPicker === 'end'}
            date={showPicker === 'start' ? startDate : endDate}
            onConfirm={(date) => {
              if (showPicker === 'start') {
                const startDateTime = new Date(date);
                startDateTime.setHours(0, 0, 0, 0);
                setStartDate(startDateTime);
              } else {
                const endDateTime = new Date(date);
                endDateTime.setHours(23, 59, 59, 999);
                setEndDate(endDateTime);
              }
              setShowPicker(null);
            }}
            onCancel={() => {
              setShowPicker(null);
            }}
          />
        )}
      </View>
    </Background>
  );
};

const getStyles = (theme: Theme, {width, height}: Dimensions) =>
  StyleSheet.create({
    container: {flex: 1, paddingHorizontal: 16},
    itemDropdown: {
      paddingHorizontal: 18,
    },
    marginTop: {marginTop: 20},
    text: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_2,
      fontSize: getFontSizeSmallDevices(width, 15),
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
  });
const mapStateToProps = (state: RootState) => ({
  active: state.activeAccount,
  globals: state.properties.globals,
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ExportTransaction);
