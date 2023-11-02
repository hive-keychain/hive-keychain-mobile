import Background from 'components/ui/Background';
import FocusAwareStatusBar from 'components/ui/FocusAwareStatusBar';
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {Theme} from 'src/context/theme.context';

interface Props {
  mode: 'enable' | 'disable';
  theme: Theme;
}
//TODO keep working here + add quentin notes about the goBack intended behaviour
const DisableEnableMyWitness = ({mode, theme}: Props) => {
  return (
    <Background using_new_ui theme={theme}>
      <>
        <FocusAwareStatusBar />
        <Text>TODO confirmation & operation of {mode} witness</Text>
      </>
    </Background>
  );
};

const styles = StyleSheet.create({});

export default DisableEnableMyWitness;
