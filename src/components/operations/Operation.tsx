import CloseButton from 'components/ui/CloseButton';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import React from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {headlines_primary_headline_2} from 'src/styles/typography';
import {goBack} from 'utils/navigation';

type Props = {
  children: JSX.Element;
  logo?: JSX.Element;
  title: string;
  onClose?: () => void;
  //TODO make fix afte refactoring
  theme?: Theme;
  additionalHeaderContainerStyle?: StyleProp<ViewStyle>;
};
export default ({
  children,
  logo,
  title,
  onClose,
  theme,
  additionalHeaderContainerStyle,
}: Props) => {
  const styles = getStyles(theme);

  return (
    <>
      <FocusAwareStatusBar
        backgroundColor={getColors(theme).primaryBackground}
      />
      <View style={[styles.header, additionalHeaderContainerStyle]}>
        <View style={styles.headerLeft}>{logo}</View>
        <Text style={styles.title}>{title}</Text>
        <CloseButton
          theme={theme}
          onPress={() => (onClose ? onClose() : goBack())}
        />
      </View>
      {children}
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
      //TODO cleanup
      // fontSize: 18,
      // marginLeft: 20,
      alignSelf: 'center',
      ...headlines_primary_headline_2,
      color: getColors(theme).primaryText,
    },
  });
