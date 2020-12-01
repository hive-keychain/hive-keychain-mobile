import * as React from 'react';
import {StatusBar} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

export default (props) => (useIsFocused() ? <StatusBar {...props} /> : null);
