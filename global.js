global.Buffer = require('buffer').Buffer;
global.process = require('process');
global.process.env.NODE_ENV = __DEV__ ? 'development' : 'production';
import 'react-native-get-random-values';
// Needed so that 'stream-http' chooses the right default protocol.
global.location = {
  protocol: 'file:',
};
