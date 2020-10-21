import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    const {height, width} = Dimensions.get('window');
    this.height = height;
    this.width = width;
  }
  render() {
    let modalHeight = this.props.bottomHalf ? this.height / 2 : this.height;
    const styles = StyleSheetFactory.getSheet({
      boxBgColor: this.props.boxBackgroundColor,
      fullscreen: this.props.fullscreen,
      modalHeight: modalHeight,
      bottomHalf: this.props.bottomHalf,
      height: this.height,
      width: this.width,
      transparent: this.props.transparentContainer,
    });
    return (
      <View style={styles.fullHeight}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.outsideClick();
          }}>
          <View style={styles.mainContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalWrapper}>
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
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

class StyleSheetFactory {
  static getSheet({modalHeight, width, transparent}) {
    const styles = StyleSheet.create({
      fullHeight: {height: '100%'},
      mainContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
      },
      modalWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: modalHeight,
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
