import {ModalPosition} from 'navigators/Root.types';
import React from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {Dimensions as Dim} from 'utils/common.types';

type Props = {
  bottomHalf: boolean;
  boxBackgroundColor?: string;
  outsideClick: () => void;
  fixedHeight?: number;
  containerStyle?: StyleProp<ViewStyle>;
  additionalWrapperFixedStyle?: StyleProp<ViewStyle>;
  additionalMainContainerStyle?: StyleProp<ViewStyle>;
  additionalClickeableAreaStyle?: StyleProp<ViewStyle>;
  modalPosition?: ModalPosition;
  buttonElement?: JSX.Element;
  theme: Theme;
};
type InnerProps = {height: number; width: number};

/**
 * Note: fixedHeight(0 - 1 range, i.e: 0.3)
 */
class CustomModal extends React.Component<Props, {}> implements InnerProps {
  height;
  width;
  fixedHeight;
  theme;
  constructor(props: Props) {
    super(props);
    const {height, width} = Dimensions.get('window');
    this.height = height;
    this.width = width;
    this.fixedHeight = props.fixedHeight;
    this.theme = props.theme;
  }
  render() {
    let modalHeight = this.props.bottomHalf ? this.height / 2 : this.height;

    let styles = StyleSheetFactory.getSheet({
      modalHeight: modalHeight,
      height: this.height,
      width: this.width,
      fixedHeight: this.fixedHeight,
      modalPosition: this.props.modalPosition,
      theme: this.theme,
    });
    return (
      <KeyboardAvoidingView
        style={styles.fullHeight}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View
          style={[
            styles.mainContainer,
            this.props.additionalMainContainerStyle,
          ]}>
          <TouchableWithoutFeedback
            style={[{height: '100%'}, this.props.additionalClickeableAreaStyle]}
            onPress={() => {
              this.props.outsideClick();
            }}>
            {this.props.buttonElement}
          </TouchableWithoutFeedback>
          <View
            style={[
              this.fixedHeight ? styles.modalWrapperFixed : styles.modalWrapper,
              this.props.additionalWrapperFixedStyle,
            ]}>
            <View style={[styles.modalContainer, this.props.containerStyle]}>
              {this.props.children}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

class StyleSheetFactory {
  static getSheet({
    modalHeight,
    width,
    height,
    fixedHeight,
    modalPosition,
    theme,
  }: Dim & {
    modalHeight: number;
    fixedHeight: number;
    theme: Theme;
  } & {modalPosition: ModalPosition}) {
    const styles = StyleSheet.create({
      fullHeight: {height: '100%'},
      mainContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: modalPosition ?? 'flex-end',
      },
      modalWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: modalHeight,
        maxHeight: 0.85 * height,
        height: 'auto',
      },
      modalWrapperFixed: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: fixedHeight * height,
        height: 'auto',
        maxHeight: 0.85 * height,

        width: '100%',
      },
      modalContainer: {
        backgroundColor: getColors(theme).primaryBackground,
        width: '100%',
        height: '100%',
        borderWidth: 1,
        borderColor: 'transparent',
        borderStyle: 'solid',
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
      },
    });

    return styles;
  }
}

export default CustomModal;
