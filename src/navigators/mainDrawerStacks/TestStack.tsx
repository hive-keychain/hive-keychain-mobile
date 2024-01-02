import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Button, Text, View} from 'react-native';

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TestScreen_1"
        component={({navigation}) => {
          return (
            <View>
              <Text>Test Screen 1</Text>
              <Button
                title="Go 2"
                onPress={() => navigation.navigate('TestScreen_2')}
              />
            </View>
          );
        }}
      />
      <Stack.Screen
        name="TestScreen_2"
        component={({navigation}) => {
          return (
            <View>
              <Text>Test Screen 2</Text>
              <Button
                title="Go 1"
                onPress={() => navigation.navigate('TestScreen_1')}
              />
            </View>
          );
        }}
      />
    </Stack.Navigator>
  );
};
