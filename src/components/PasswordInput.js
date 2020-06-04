import React, {useState} from 'react';
import {Input, Icon} from 'react-native-elements';

export default (props) => {
  const [secure, setSecure] = useState(true);
  return (
    <Input
      {...props}
      leftIcon={{type: 'font-awesome-5', name: 'key'}}
      rightIcon={
        <Icon
          type="font-awesome-5"
          name={secure ? 'eye-slash' : 'eye'}
          onPress={() => setSecure(!secure)}
        />
      }
      secureTextEntry={secure}
    />
  );
};
