import Icon from 'components/hive/Icon';
import React from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {useThemeContext} from 'src/context/theme.context';
import {Icons} from 'src/enums/icons.enums';
import {PRIMARY_RED_COLOR} from 'src/styles/colors';
import {Dimensions} from 'utils/common.types';
import CustomDropdown, {DropdownItem} from './CustomDropdown';

interface Props {
  list: DropdownItem[];
  selected: string | DropdownItem;
  onSelected: (item: string) => void;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  additionalDropdowContainerStyle?: StyleProp<ViewStyle>;
  copyButtonValue?: boolean;
  dropdownIconScaledSize?: Dimensions;
  showSelectedIcon?: JSX.Element;
  additionalTextStyle?: StyleProp<TextStyle>;
  additionalMainOverlayStyle?: StyleProp<ViewStyle>;
}

const UserDropdown = ({
  list,
  selected,
  onSelected,
  additionalContainerStyle,
  additionalDropdowContainerStyle,
  copyButtonValue,
  dropdownIconScaledSize,
  showSelectedIcon,
  additionalTextStyle,
  additionalMainOverlayStyle,
}: Props) => {
  const {theme} = useThemeContext();
  return (
    <CustomDropdown
      behaviour="down"
      theme={theme}
      list={list}
      selected={selected}
      onSelected={onSelected}
      additionalContainerStyle={additionalContainerStyle}
      additionalDropdowContainerStyle={additionalDropdowContainerStyle}
      dropdownIconScaledSize={dropdownIconScaledSize}
      copyButtonValue={copyButtonValue}
      showSelectedIcon={
        <Icon
          name={Icons.CHECK}
          theme={theme}
          width={15}
          height={15}
          strokeWidth={2}
          color={PRIMARY_RED_COLOR}
        />
      }
      additionalTextStyle={additionalTextStyle}
      additionalMainOverlayStyle={additionalMainOverlayStyle}
    />
  );
};

export default UserDropdown;
