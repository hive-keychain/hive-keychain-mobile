import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {ImageStyle} from 'react-native-fast-image';
import {useThemeContext} from 'src/context/theme.context';
import {Dimensions} from 'utils/common.types';
import CustomDropdown, {DropdownItem} from './CustomDropdown';

interface Props {
  list: DropdownItem[];
  selected: string | DropdownItem;
  onSelected: (item: string) => void;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  additionalDropdowContainerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  copyButtonValue?: boolean;
  dropdownIconScaledSize?: Dimensions;
}

const UserDropdown = ({
  list,
  selected,
  onSelected,
  additionalContainerStyle,
  additionalDropdowContainerStyle,
  iconStyle,
  copyButtonValue,
  dropdownIconScaledSize,
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
      iconStyle={iconStyle}
      copyButtonValue={copyButtonValue}
    />
  );
};

export default UserDropdown;
