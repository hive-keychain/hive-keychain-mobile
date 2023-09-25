import ForgotPIN from 'components/modals/ForgotPIN';
import React, {useContext} from 'react';
import {
  ScaledSize,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import {Theme, ThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {FontPoppinsName, underlined} from 'src/styles/typography';
import {translate} from 'utils/localize';
import {navigate} from 'utils/navigation';

export default () => {
  const {theme} = useContext(ThemeContext);
  const styles = getDimensionedStyles(useWindowDimensions(), theme);
  return (
    <TouchableOpacity
      onPress={() => {
        navigate('ModalScreen', {
          modalContent: <ForgotPIN theme={theme} />,
          modalContainerStyle: {
            backgroundColor: getColors(theme).primaryBackground,
            borderColor: getColors(theme).cardBorderColor,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            borderWidth: 1,
            borderRadius: 22,
          } as StyleProp<ViewStyle>,
          fixedHeight: 0.4,
        });
      }}>
      <Text style={styles.text}>{translate('components.forgotPIN.title')}</Text>
    </TouchableOpacity>
  );
};

const getDimensionedStyles = ({width}: ScaledSize, theme: Theme) =>
  StyleSheet.create({
    text: {
      color: getColors(theme).secondaryText,
      //TODO cleanup
      // marginRight: width * 0.05,
      fontFamily: FontPoppinsName.SEMI_BOLD,
      ...underlined,
    },
  });
