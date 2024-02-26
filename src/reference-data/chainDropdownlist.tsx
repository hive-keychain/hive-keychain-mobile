import EthereumImage from 'assets/new_UI/ethereum_logo.svg';
import HiveChainImage from 'assets/new_UI/hive_logo.svg';
import {DropdownModalItem} from 'components/form/DropdownModal';
import React from 'react';
import {View} from 'react-native';

const iconListImage = {
  width: 18,
  height: 18,
};

export const chainItemList: DropdownModalItem[] = [
  {
    icon: <EthereumImage {...iconListImage} />,
    label: 'ethereum',
    value: 'eth_chain',
  },
  {
    icon: (
      <View
        style={{
          backgroundColor: '#FDEBEE',
          height: 20,
          width: 20,
          borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <HiveChainImage {...iconListImage} />
      </View>
    ),
    label: 'hive',
    value: 'hive_chain',
  },
];
