import UserProfilePicture from 'components/ui/UserProfilePicture';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import {Dimensions} from 'utils/common.types';
import {translate} from 'utils/localize';
import CustomPicker from './CustomPicker';

type Props = {
  username: string;
  accounts: string[];
  onAccountSelected: (value: string) => void;
  additionalContainerStyle?: StyleProp<ViewStyle>;
  additionalPickerStyle?: StyleProp<TextStyle>;
  dropdownIconColor?: string;
  iosTextStyle?: StyleProp<TextStyle>;
};
const UserPicker = ({
  username,
  accounts,
  onAccountSelected,
  additionalContainerStyle,
  additionalPickerStyle,
  dropdownIconColor,
  iosTextStyle,
}: Props) => {
  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({width, height});
  if (!username) {
    return null;
  }

  return (
    <View style={[styles.container, additionalContainerStyle]}>
      <UserProfilePicture style={styles.image} username={username} />
      <View style={styles.subContainer}>
        <CustomPicker
          list={accounts}
          onSelected={onAccountSelected}
          selectedValue={username}
          prefix="@"
          style={[styles.picker, additionalPickerStyle]}
          prompt={translate('components.picker.prompt_user')}
          dropdownIconColor={dropdownIconColor}
          iosTextStyle={iosTextStyle}
        />
      </View>
    </View>
  );
};

const getDimensionedStyles = ({width, height}: Dimensions) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      width: '90%',
      marginHorizontal: width * 0.05,
      backgroundColor: '#E5EEF7',
      borderRadius: height / 30,
      marginVertical: height / 30,
      alignItems: 'center',
    },
    subContainer: {
      width: '80%',
      marginLeft: width * 0.04,
    },
    image: {
      margin: 2,
      width: height / 15 - 4,
      height: height / 15 - 4,
      borderRadius: height / 30,
    },
    picker: {
      flex: 1,
    },
  });

export default UserPicker;
