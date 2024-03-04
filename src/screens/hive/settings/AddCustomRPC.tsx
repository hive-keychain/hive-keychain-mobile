import DropdownModal, {DropdownModalItem} from 'components/form/DropdownModal';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import Separator from 'components/ui/Separator';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getCardStyle} from 'src/styles/card';
import {PRIMARY_RED_COLOR, getColors} from 'src/styles/colors';
import {
  LABELINDENTSPACE,
  MARGINLEFTRIGHTMIN,
  MARGINPADDING,
} from 'src/styles/spacing';
import {
  body_primary_body_2,
  getFontSizeSmallDevices,
} from 'src/styles/typography';
import {translate} from 'utils/localize';

interface Props {
  theme: Theme;
  rpcList: DropdownModalItem[];
  tittleTranslationKey?: string;
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
  additionalTitleStyle?: StyleProp<TextStyle>;
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
  tittleTranslationKey,
  additionalTitleStyle,
}: Props) => {
  const {width, height} = useWindowDimensions();
  const styles = getStyles(theme, width, height);
  return (
    <View
      style={{
        alignItems: 'center',
        alignContent: 'center',
        width: '100%',
      }}>
      <View
        style={{
          width: '100%',
          justifyContent: 'flex-start',
        }}>
        <Text style={[styles.text, styles.indent, additionalTitleStyle]}>
          {translate(tittleTranslationKey)}
        </Text>
      </View>
      <View style={styles.rpcItemContainer}>
        <DropdownModal
          list={rpcList}
          selected={selectedRPC ?? rpcList[0].value}
          onSelected={(selectedItem) => onSelectedDropdown(selectedItem.value)}
          onRemove={onRemoveDropdownItem}
          additionalDropdowContainerStyle={[styles.dropdownWidth]}
          dropdownIconScaledSize={styles.dropdownIconDimensions}
          additionalOverlayStyle={{
            paddingHorizontal: MARGINPADDING,
          }}
          additionalListExpandedContainerStyle={styles.dropdownWidth}
          selectedBgColor={PRIMARY_RED_COLOR}
        />
        <TouchableOpacity
          style={[getCardStyle(theme).defaultCardItem, styles.addButton]}
          onPress={setAddNewRpc}>
          <Text style={styles.text}>{addNewRpc ? 'x' : '+'}</Text>
        </TouchableOpacity>
      </View>
      {addNewRpc && (
        <View style={[getCardStyle(theme).defaultCardItem]}>
          <View style={styles.flexRow}>
            <Text style={styles.text}>
              {translate('settings.settings.add_rpc_title')}
            </Text>
            <Icon
              theme={theme}
              name={Icons.RAM}
              onClick={onHandleSave}
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
            additionalInputContainerStyle={styles.input}
            inputStyle={styles.text}
            onChangeText={onChangeInput}
          />
          <CheckBox
            checked={checkedValue}
            onPress={onChangeCheckBox}
            title={checkBoxTitle}
            containerStyle={styles.checkBox}
            textStyle={styles.text}
            checkedColor={PRIMARY_RED_COLOR}
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
      ...body_primary_body_2,
      fontSize: getFontSizeSmallDevices(width, 13),
    },
    rpcItemContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      marginBottom: MARGINLEFTRIGHTMIN,
    },
    addButton: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 30,
      paddingHorizontal: 0,
      paddingVertical: 0,
      width: 50,
      height: 50,
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
      width: width * 0.77,
    },
    dropdownIconDimensions: {width: 15, height: 15},
    indent: {
      marginLeft: LABELINDENTSPACE,
    },
  });

export default AddCustomRPC;
