import CloseButton from 'components/ui/CloseButton';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import React from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {Theme, useThemeContext} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {headlines_primary_headline_2} from 'src/styles/typography';
import {goBack} from 'utils/navigation';

type Props = {
  children: JSX.Element;
  title: string;
  logo?: JSX.Element;
  onClose?: () => void;
  additionalHeaderContainerStyle?: StyleProp<ViewStyle>;
  additionalHeaderTitleStyle?: StyleProp<TextStyle>;
};
export default ({
  children,
  logo,
  title,
  onClose,
  additionalHeaderContainerStyle,
  additionalHeaderTitleStyle,
}: Props) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme);

  return (
    <>
      <FocusAwareStatusBar />
      <View style={[styles.header, additionalHeaderContainerStyle]}>
        <View style={styles.headerLeft}>{logo}</View>
        <Text style={[styles.title, additionalHeaderTitleStyle]}>{title}</Text>
        <CloseButton
          theme={theme}
          onPress={() => (onClose ? onClose() : goBack())}
        />
      </View>
      <ScrollView>{children}</ScrollView>
    </>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },
    headerLeft: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    close: {
      alignItems: 'center',
    },
    title: {
      alignSelf: 'center',
      ...headlines_primary_headline_2,
      color: getColors(theme).primaryText,
    },
  });
