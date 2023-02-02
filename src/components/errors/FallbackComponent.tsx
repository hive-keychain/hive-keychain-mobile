import Clipboard from '@react-native-community/clipboard';
import Separator from 'components/ui/Separator';
import React from 'react';
import {
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export type Props = {
  error: Error;
  resetError: () => void;
};

const FallbackComponent = (props: Props) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.subtitle}>
        {'Hive Keychain encountered an error.'}
      </Text>
      <Text style={styles.error}>
        Please copy the following stack and contact us on{' '}
        <Text
          style={{color: 'blue'}}
          onPress={() => Linking.openURL('https://discord.gg/3EM6YfRrGv')}>
          Discord
        </Text>
        .
      </Text>
      <Text style={styles.error}>{props.error.toString()}</Text>
      <Text style={styles.error}>{`${props.error.stack?.slice(0, 500)}
       ${props.error.stack.length > 500 ? '...' : ''}`}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          Clipboard.setString(
            props.error.toString() + '\n\n' + props.error.stack,
          );
        }}>
        <Text style={styles.buttonText}>Copy Stack</Text>
      </TouchableOpacity>
      <Separator />
      <TouchableOpacity style={styles.button} onPress={props.resetError}>
        <Text style={styles.buttonText}>Restart</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fafafa',
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    marginHorizontal: 16,
  },
  title: {
    fontSize: 48,
    fontWeight: '300',
    paddingBottom: 16,
    color: '#000',
  },
  subtitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000',
  },
  error: {
    paddingVertical: 16,
  },
  button: {
    backgroundColor: '#2196f3',
    borderRadius: 50,
    padding: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default FallbackComponent;
