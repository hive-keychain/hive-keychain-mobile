import {ModalScreenProps} from 'navigators/Root.types';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {useThemeContext} from 'src/context/theme.context';
import {
  CONTENTMARGINPADDING,
  MARGINPADDING,
  STACK_HEADER_HEIGHT,
  getElementHeight,
} from 'src/styles/spacing';
import {getBorderTest} from 'src/styles/test';
import {navigate} from 'utils/navigation';

interface Props {
  yPos: number;
  //   onLayoutDropdown: (event: any) => void;
}

const DropdownModal = ({yPos}: Props) => {
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [yPosMainContainer, setYPosMainContainer] = useState(0);

  //   useEffect(() => {
  //     setYPosMainContainer((prev) => prev + yPos);
  //   }, [yPos]);

  const {theme} = useThemeContext();
  const {width, height} = useWindowDimensions();

  const styles = getStyles(yPosMainContainer + yPos, width, height);

  console.log({yPosMainContainer}); //TODO remove line

  const onHandleClick = () => {
    setIsListExpanded(!isListExpanded);
    navigate('ModalScreen', {
      name: 'UserDropDown',
      modalContent: (
        <View>
          <Text>Modal Content //TODO</Text>
        </View>
      ),
      fixedHeight: 0.5,
      additionalWrapperFixedStyle: [
        styles.wrapperFixed,
        getBorderTest('yellow'),
      ],
      modalPosition: undefined,
      modalContainerStyle: undefined,
      //TODO bellow to complete
      renderButtonElement: (
        <View style={[getBorderTest('red')]}>
          <Text>//TODO button</Text>
        </View>
      ),
    } as ModalScreenProps);
  };

  const onLayoutMainContainer = (event: any) => {
    const {x, y, width, height} = event.nativeEvent.layout;
    setYPosMainContainer((prev) => prev + y);
  };

  return (
    <TouchableOpacity
      onPress={onHandleClick}
      style={[getBorderTest('blue')]}
      onLayout={onLayoutMainContainer}>
      <Text>Click me to open</Text>
    </TouchableOpacity>
  );
};

const getStyles = (topDropdown: number, width: number, height: number) =>
  StyleSheet.create({
    wrapperFixed: {
      top: topDropdown + getElementHeight(height) + STACK_HEADER_HEIGHT + 20, //TODO add this bellow in spacing as SEPARATORMINDEFAULT = 20
      bottom: undefined,
      left: MARGINPADDING + CONTENTMARGINPADDING,
      right: width * 0.05,
      width: '80%',
      height: 'auto',
      //   alignItems: 'flex-end',
      //   justifyContent: 'flex-start',
    },
  });

export default DropdownModal;
