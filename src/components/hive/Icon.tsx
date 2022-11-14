import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

const getIconFilePath = (name: string, subType: string) => {
  console.log({name}); //TODO to remove
  switch (name) {
    case 'transfer':
      return require('src/assets/icons/transfer.png');
    case 'savings':
      return require('src/assets/icons/savings.png');
    case 'power_up_down':
      switch (subType) {
        case 'transfer_to_vesting':
          return require('src/assets/icons/powerup.png');
        case 'withdraw_vesting':
          return require('src/assets/icons/powerdown.png');
      }
    default:
      break;
  }
};

interface IconProps {
  onClick?: (params: any) => void;
  name: string;
  subType?: string;
  // type: IconType;
  // additionalStyle?: string;
  // tooltipMessage?: string;
  // tooltipPosition?: CustomTooltipPosition;
  // skipTooltipTranslation?: boolean;
  // ariaLabel?: string;
}

const Icon = (props: IconProps) => {
  //   if (props.onClick) {
  //     return (
  //       <TouchableOpacity onPress={props.onClick}>
  //         {renderImage()}
  //       </TouchableOpacity>
  //     );
  //   } else {
  const iconPath = getIconFilePath(props.name, props.subType);
  return (
    <View>
      <Image source={iconPath} style={styles.defaultIcon} />
    </View>
  );
  //   }
};

const styles = StyleSheet.create({
  defaultIcon: {
    width: 30,
    height: 30,
    tintColor: 'black',
    marginRight: 5,
  },
});

export default Icon;
