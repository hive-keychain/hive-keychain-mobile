import React, {Component} from 'react';
import {
  View,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Blur from './Blur';

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
    const {height, width} = Dimensions.get('window');
    this.height = height;
    this.width = width;
  }
  render() {
    console.log('show now');
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
      <Blur show={this.props.visible}>
        <Modal
          transparent={true}
          visible={this.props.visible}
          presentationStyle={this.props.mode}>
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
        </Modal>
      </Blur>
    );
  }
}

class StyleSheetFactory {
  static getSheet({
    boxBgColor,
    fullscreen,
    bottomHalf,
    modalHeight,
    width,
    height,
    transparent,
  }) {
    const styles = StyleSheet.create({
      mainContainer: {
        flex: 1,
        backgroundColor: 'transparent',
      },
      modalWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        height: modalHeight,
      },
      modalContainer: {
        backgroundColor: 'white',
        width: '100%',
        borderWidth: 1,
        borderColor: 'white',
        borderStyle: 'solid',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
      },
      gradient: {
        width: '100%',
        height: '100%',
        margin: 0,
        borderRadius: 10,
        padding: 0,
        paddingHorizontal: width * 0.05,
        paddingVertical: width * 0.05,
      },
    });

    if (fullscreen) {
      styles.modalWrapper = {
        ...styles.modalWrapper,
        flex: 1,
      };

      styles.modalContainer = {
        ...styles.modalContainer,
        flex: 1,
      };
    } else if (bottomHalf) {
      styles.modalWrapper = {
        ...styles.modalWrapper,
        marginTop: modalHeight,
      };

      styles.modalContainer = {
        ...styles.modalContainer,
        flex: 1,
      };
    } else {
      styles.modalWrapper = {
        ...styles.modalWrapper,
        flex: 1,
      };

      styles.modalContainer = {
        ...styles.modalContainer,
        marginHorizontal: 10,
      };
    }

    return styles;
  }
}
