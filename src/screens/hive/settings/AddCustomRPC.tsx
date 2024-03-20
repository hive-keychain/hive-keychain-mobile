import {Rpc} from 'actions/interfaces';
import CheckBox from 'components/form/CustomCheckBox';
import DropdownModal, {DropdownModalItem} from 'components/form/DropdownModal';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import Separator from 'components/ui/Separator';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {
  LABEL_INDENT_SPACE,
  MARGIN_LEFT_RIGHT_MIN,
  MARGIN_PADDING,
} from 'src/styles/spacing';
import {
  getFontSizeSmallDevices,
  headlines_primary_headline_3,
} from 'src/styles/typography';
import {translate} from 'utils/localize';

interface Props {
  title: string;
  theme: Theme;
  rpcList: DropdownModalItem[];
  selectedRPC: string;
  placeHolderInput: string;
  checkBoxTitle: string;
  onHandleSave: () => void;
  input: string;
  onChangeInput: (text: string) => void;
  checkedValue: boolean;
  onChangeCheckBox: () => void;
  addNewRpc: boolean;
  setAddNewRpc: () => void;
  onRemoveDropdownItem: (item: string) => void;
  onSelectedDropdown: (item: string) => void;
  additionalDropdowContainerStyle?: StyleProp<ViewStyle>;
  additionalListExpandedContainerStyle?: StyleProp<ViewStyle>;
}
const AddCustomRPC = ({
  theme,
  rpcList,
  selectedRPC,
  placeHolderInput,
  checkBoxTitle,
  onHandleSave,
  input,
  onChangeInput,
  checkedValue,
  onChangeCheckBox,
  addNewRpc,
  setAddNewRpc,
  onRemoveDropdownItem,
  onSelectedDropdown,
  additionalDropdowContainerStyle,
  additionalListExpandedContainerStyle,
  title,
}: Props) => {
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, width, height);

  const cleanRpcLabel = (label: string) =>
    label.replace('http://', '').replace('https://', '').split('/')[0];

  const getItemDropDownSelected = (rpcItem: Rpc): DropdownModalItem => {
    return {
      label: cleanRpcLabel(rpcItem.uri),
      value: rpcItem.uri,
    };
  };

  return (
    <View
      style={{
        alignItems: 'center',
        alignContent: 'center',
        width: '100%',
      }}>
      <View style={styles.rpcItemContainer}>
        <DropdownModal
          dropdownTitle={title}
          list={rpcList}
          selected={getItemDropDownSelected({uri: selectedRPC} as Rpc)}
          onSelected={(selectedItem) => onSelectedDropdown(selectedItem.value)}
          onRemove={onRemoveDropdownItem}
          additionalDropdowContainerStyle={[
            styles.dropdownWidth,
            additionalDropdowContainerStyle,
          ]}
          dropdownIconScaledSize={styles.dropdownIconDimensions}
          additionalListExpandedContainerStyle={[
            styles.dropdownWidth,
            additionalListExpandedContainerStyle,
          ]}
          additionalOverlayStyle={{
            paddingHorizontal: MARGIN_PADDING,
          }}
          drawLineBellowSelectedItem
          showSelectedIcon={
            <Icon
              name={Icons.CHECK}
              theme={theme}
              width={18}
              height={18}
              strokeWidth={2}
              color={PRIMARY_RED_COLOR}
            />
          }
          additionalLineStyle={styles.bottomLineDropdownItem}
        />
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            activeOpacity={1}
            style={[getCardStyle(theme).defaultCardItem, styles.addButton]}
            onPress={setAddNewRpc}>
            <Text style={[styles.text, styles.textAdd]}>
              {addNewRpc ? 'x' : '+'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {addNewRpc && (
        <View style={[getCardStyle(theme).defaultCardItem, {width: '100%'}]}>
          <View style={styles.flexRow}>
            <Text style={styles.text}>
              {translate('settings.settings.add_rpc_title')}
            </Text>
            <Icon
              theme={theme}
              name={Icons.RAM}
              onPress={onHandleSave}
              color={PRIMARY_RED_COLOR}
            />
          </View>
          <Separator
            drawLine
            height={0.5}
            additionalLineStyle={styles.bottomLine}
          />
          <OperationInput
            placeholder={placeHolderInput}
            value={input}
            onChangeText={onChangeInput}
          />
          <Separator />
          <CheckBox
            checked={checkedValue}
            onPress={onChangeCheckBox}
            title={checkBoxTitle}
            skipTranslation
            smallText
          />
        </View>
      )}
    </View>
  );
};

const getStyles = (theme: Theme, width: number, height: number) =>
  StyleSheet.create({
    flexRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 'auto',
    },
    bottomLine: {
      marginVertical: 8,
      borderColor: getColors(theme).lineSeparatorStroke,
    },
    text: {
      color: getColors(theme).secondaryText,
      ...headlines_primary_headline_3,
      fontSize: getFontSizeSmallDevices(width, 13),
    },
    textAdd: {
      fontSize: getFontSizeSmallDevices(width, 15),
    },
    rpcItemContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      marginBottom: MARGIN_LEFT_RIGHT_MIN,
    },
    addButtonContainer: {justifyContent: 'flex-end'},
    addButton: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 30,
      paddingHorizontal: 0,
      paddingVertical: 0,
      width: 48,
      height: 48,
      alignSelf: 'center',
      marginBottom: 0,
    },
    input: {
      marginHorizontal: 0,
      width: '100%',
    },
    checkBox: {
      width: '100%',
      margin: 0,
      paddingLeft: 0,
      backgroundColor: '#00000000',
      borderWidth: 0,
      alignContent: 'center',
    },
    dropdownWidth: {
      width: width * 0.7,
    },
    dropdownIconDimensions: {width: 15, height: 15},
    indent: {
      marginLeft: LABEL_INDENT_SPACE,
    },
    bottomLineDropdownItem: {
      borderWidth: 1,
      width: '85%',
      borderColor: getColors(theme).lineSeparatorStroke,
      alignSelf: 'center',
    },
  });

export default AddCustomRPC;
