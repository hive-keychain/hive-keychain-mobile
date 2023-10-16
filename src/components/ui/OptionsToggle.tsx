import {RadioButton} from 'components/form/CustomRadioGroup';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Theme} from 'src/context/theme.context';
import {getColors} from 'src/styles/colors';
import {body_primary_body_1} from 'src/styles/typography';

type Props = {
  children: JSX.Element[];
  title: string;
  callback: (toggled: boolean) => void;
  toggled: boolean;
  theme: Theme;
};

const OptionsToggle = ({children, title, toggled, callback, theme}: Props) => {
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <RadioButton
          onSelect={() => {
            callback(!toggled);
          }}
          selected={toggled}
          style={styles.toggleButton}
          radioStyle={styles.radioStyle}
          additionalRadioStyleActive={styles.radioButtonActive}
        />
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={toggled ? styles.toggled : styles.untoggled}>
        {children}
      </View>
    </View>
  );
};

const getStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    toggled: {flex: 1, justifyContent: 'center'},
    untoggled: {display: 'none'},
    toggleButton: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: getColors(theme).icon,
      marginLeft: 0,
      marginRight: 0,
      paddingRight: 0,
    },
    header: {
      flexDirection: 'row',
    },
    title: {
      ...body_primary_body_1,
      color: getColors(theme).secondaryText,
    },
    radioButtonActive: {
      backgroundColor: getColors(theme).icon,
    },
    radioStyle: {
      width: 22,
      marginRight: 10,
    },
  });

export default OptionsToggle;
