import Icon from 'components/hive/Icon';
import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Image from 'react-native-fast-image';
import HBDSvgIcon from 'src/assets/icons/svgs/hbd_green.svg';
import HIVESvgIcon from 'src/assets/icons/svgs/hive-engine.svg';
import {Dimensions} from 'utils/common.types';
//TODO remove file
export interface SelectOption {
  label: string;
  subLabel?: string;
  value: any;
  img?: string;
  imgBackup?: string;
}

interface CustomSelectorProps {
  list: SelectOption[];
}

const CustomSelector = ({list}: CustomSelectorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectOption>(list[0]);

  const {width, height} = useWindowDimensions();
  const styles = getDimensionedStyles({width, height});

  const renderItemSelect = (item: SelectOption) => {
    // console.log({item}); //TODO to remove

    const getImageElement = () => {
      switch (true) {
        case item.img.includes('hbd_green.svg'):
          return <HBDSvgIcon height={40} width={40} />;
        case item.img.includes('hive-engine.svg'):
          return <HIVESvgIcon height={40} width={40} />;

        default:
          return (
            <Image
              style={styles.image}
              source={{uri: item.img}}
              resizeMode={Image.resizeMode.contain}
              fallback
            />
          );
      }
    };
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '90%',
          // justifyContent: 'space-between',
        }}
        key={item.label}>
        {/* {getImageElement()} */}
        {/* //TODO onClick */}
        <Text>{item.label}</Text>
      </View>
    );
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
        }}>
        {renderItemSelect(selectedItem)}
        <Icon
          name="expand_more"
          fillIconColor="black"
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </View>
      {isExpanded && (
        <ScrollView
          style={{
            overflow: 'scroll',
            maxHeight: 200,
          }}>
          {list.map((itemList) => {
            return renderItemSelect(itemList);
          })}
        </ScrollView>
      )}
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
    testRectangle: {
      width: '100%',
      backgroundColor: 'green',
      height: 200,
    },
  });

export default CustomSelector;
