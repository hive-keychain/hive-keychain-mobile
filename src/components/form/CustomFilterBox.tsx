import Icon from 'components/hive/Icon';
import React from 'react';
import {
  ScaledSize,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';

interface Props {
  theme: Theme;
  onClick: () => void;
}

//TODO decide if this component is needed at all

const CustomFilterBox = ({theme, onClick}: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const styles = getStyles(theme, useWindowDimensions());
  //TODO finish using CustomModal or make one using the same techinques.
  return (
    <>
      <Icon
        name={'settings-4'}
        theme={theme}
        onClick={() => setIsOpen(!isOpen)}
        //TODO pass styles bellow
        additionalContainerStyle={styles.iconContainer}
      />
      {isOpen && (
        <View style={styles.overlayContainer}>
          <View style={styles.expandedContainer}>
            <Text>TO finish</Text>
          </View>
        </View>
      )}
    </>
  );
};

export default CustomFilterBox;

const getStyles = (theme: Theme, {width, height}: ScaledSize) =>
  StyleSheet.create({
    iconContainer: {
      marginRight: 16,
      paddingHorizontal: 19,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: getColors(theme).secondaryCardBorderColor,
      backgroundColor: getColors(theme).secondaryCardBgColor,
      borderRadius: 26,
      zIndex: 11,
    },
    expandedContainer: {
      position: 'absolute',
      backgroundColor: getColors(theme).secondaryCardBgColor,
    },
    overlayContainer: {
      position: 'absolute',
      width: width,
      height: height,
      opacity: 0.8,
      flex: 1,
      backgroundColor: '#212838',
      //   top: 0,
      //   left: 0,
      //   bottom: 0,
      //   right: 0,
      bottom: 0,
      zIndex: 10,
      alignSelf: 'center',
    },
  });
