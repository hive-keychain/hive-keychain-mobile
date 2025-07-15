import CloseButton from 'components/ui/CloseButton';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import Separator from 'components/ui/Separator';
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
import {initialWindowMetrics} from 'react-native-safe-area-context';
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
  additionalContentStyle?: StyleProp<ViewStyle>;
};
export default ({
  children,
  logo,
  title,
  onClose,
  additionalHeaderContainerStyle,
  additionalHeaderTitleStyle,
  additionalContentStyle,
}: Props) => {
  const {theme} = useThemeContext();
  const styles = getStyles(theme);
  return (
    <View
      style={{
        justifyContent: 'space-between',
        flexGrow: 1,
      }}>
      <FocusAwareStatusBar />
      <View style={[styles.header, additionalHeaderContainerStyle]}>
        <View style={styles.headerLeft}>{logo}</View>
        <Text style={[styles.title, additionalHeaderTitleStyle]}>{title}</Text>
        <CloseButton
          theme={theme}
          onPress={() => (onClose ? onClose() : goBack())}
        />
      </View>
      <ScrollView contentContainerStyle={additionalContentStyle}>
        {children}
        <Separator height={initialWindowMetrics.insets.bottom} />
      </ScrollView>
    </View>
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
      backgroundColor: 'red ',
      marginBottom: 8,
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
