import {RadioButton} from 'components/form/CustomRadioGroup';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type Props = {
  children: JSX.Element[];
  title: string;
  callback: (toggled: boolean) => void;
  toggled: boolean;
};

const OptionsToggle = ({children, title, toggled, callback}: Props) => {
  return (
    <View style={{flex: 1}}>
      <View style={styles.header}>
        <RadioButton
          onSelect={() => {
            callback(!toggled);
          }}
          selected={toggled}
          style={styles.toggleButton}
          radioStyle={{width: 60}}
        />
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={toggled ? styles.toggled : styles.untoggled}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toggled: {display: 'flex'},
  untoggled: {display: 'none'},
  toggleButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#77B9D1',
  },
  toggleButtonText: {
    color: '#77B9D1',
    fontWeight: '800',
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {color: 'black'},
});

export default OptionsToggle;
