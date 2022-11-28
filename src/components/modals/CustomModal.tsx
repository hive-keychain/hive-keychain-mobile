import React from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {Dimensions as Dim} from 'utils/common.types';

type Props = {
  bottomHalf: boolean;
  boxBackgroundColor?: string;
  outsideClick: () => void;
  centerModal?: boolean;
};
type InnerProps = {
  height: number;
  width: number;
  isCentered: boolean | undefined;
};
class CustomModal extends React.Component<Props, {}> implements InnerProps {
  height;
  width;
  isCentered;
  constructor(props: Props) {
    super(props);
    const {height, width} = Dimensions.get('window');
    this.height = height;
    this.width = width;
    this.isCentered = this.props.centerModal || undefined;
  }
  render() {
    let modalHeight = this.props.bottomHalf ? this.height / 2 : this.height;
    const styles = StyleSheetFactory.getSheet({
      modalHeight: this.isCentered ? 450 : modalHeight,
      height: this.height,
      width: this.width,
      isCentered: this.isCentered,
    });
    return (
      <KeyboardAvoidingView
        style={styles.fullHeight}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <View style={styles.mainContainer}>
          {!this.isCentered && (
            <TouchableWithoutFeedback
              style={{height: '100%'}}
              onPress={() => {
                this.props.outsideClick();
              }}></TouchableWithoutFeedback>
          )}
          <View
            style={[
              styles.modalWrapper,
              !this.isCentered ? styles.absoluteModalWrapper : undefined,
            ]}>
            <View style={styles.modalContainer}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 0, y: 1}}
                colors={['white', '#B9C9D6']}
                style={styles.gradient}>
                {this.props.children}
              </LinearGradient>
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
    isCentered,
  }: Dim & {modalHeight: number; isCentered: boolean}) {
    const styles = StyleSheet.create({
      fullHeight: {height: '100%'},
      mainContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: isCentered ? 'space-around' : 'flex-end',
        height: '100%',
      },
      absoluteModalWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      },
      modalWrapper: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: modalHeight,
        maxHeight: isCentered ? 450 : 0.85 * height,
        flex: 1,
        height: 'auto',
      },
      modalContainer: {
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        borderWidth: 1,
        borderColor: 'white',
        borderStyle: 'solid',
        borderRadius: 10,
      },
      gradient: {
        width: '100%',
        height: '100%',
        flex: 0,
        margin: 0,
        borderRadius: 10,
        padding: 0,
        paddingHorizontal: width * 0.05,
        paddingVertical: width * 0.05,
      },
    });

    return styles;
  }
}

export default CustomModal;
