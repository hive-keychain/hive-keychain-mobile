import CustomDropdown, {DropdownItem} from 'components/form/CustomDropdown';
import OperationInput from 'components/form/OperationInput';
import Icon from 'components/hive/Icon';
import Separator from 'components/ui/Separator';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {Theme} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {getCardStyle} from 'src/styles/card';
import {getColors} from 'src/styles/colors';
import {body_primary_body_2} from 'src/styles/typography';
import {translate} from 'utils/localize';

interface Props {
  theme: Theme;
  rpcList: DropdownItem[];
  selectedRPC: string;
  title: string;
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
  titleTranslationKey?: string;
}

const AddCustomRPC = ({
  theme,
  rpcList,
  selectedRPC,
  title,
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
  titleTranslationKey,
}: Props) => {
  const styles = getStyles(theme);
  return (
    <View>
      <Text style={styles.text}>{title}</Text>
      <View style={styles.rpcItemContainer}>
        <CustomDropdown
          titleTranslationKey={titleTranslationKey}
          behaviour="overlay"
          theme={theme}
          list={rpcList}
          selected={selectedRPC ?? rpcList[0].value}
          onSelected={onSelectedDropdown}
          onRemove={onRemoveDropdownItem}
          additionalContainerStyle={styles.flex85}
          keyExtractor="label"
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
            <Icon theme={theme} name={Icons.RAM} onClick={onHandleSave} />
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
            checkedColor={getColors(theme).icon}
          />
        </View>
      )}
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    flexRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    bottomLine: {
      marginVertical: 8,
      borderColor: getColors(theme).lineSeparatorStroke,
    },
    text: {
      color: getColors(theme).secondaryText,
      ...body_primary_body_2,
      fontSize: 15,
    },
    rpcItemContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
    },
    addButton: {
      minHeight: 50,
      alignItems: 'center',
      borderRadius: 30,
    },
    flex85: {width: '85%'},
    input: {
      marginHorizontal: 0,
    },
    checkBox: {
      width: '100%',
      margin: 0,
      paddingLeft: 0,
      backgroundColor: '#00000000',
      borderWidth: 0,
      alignContent: 'center',
    },
  });

export default AddCustomRPC;
