import {ModalPosition} from 'navigators/Root.types';
import React from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {Dimensions as Dim} from 'src/interfaces/common.interface';
import {getColors} from 'src/styles/colors';

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
  buttonElement?: React.ReactNode;
  theme: Theme;
  children: React.ReactNode;
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
    const {height, width} = Dimensions.get('window');
    const fixedHeight = this.props.fixedHeight;
    const theme = this.props.theme;
    const modalHeight = this.props.bottomHalf ? height / 2 : height;

    let styles = StyleSheetFactory.getSheet({
      modalHeight,
      height,
      width,
      fixedHeight,
      modalPosition: this.props.modalPosition,
      theme,
      bottomHalf: this.props.bottomHalf,
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
          <Pressable
            style={[{height: '100%'}, this.props.additionalClickeableAreaStyle]}
            onPress={() => {
              this.props.outsideClick();
            }}>
            {this.props.buttonElement}
          </Pressable>
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
    bottomHalf,
  }: Dim & {
    modalHeight: number;
    fixedHeight: number;
    theme: Theme;
    bottomHalf: boolean;
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
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        ...(bottomHalf
          ? {
              minHeight: modalHeight,
              maxHeight: 0.95 * height,
            }
          : {
              height: 0.95 * height,
            }),
      },
      modalWrapperFixed: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        height: fixedHeight * height,
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
