import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';
import {WebSocket} from 'mock-socket';
global.WebSocket = WebSocket;

//Updates:
//jest-websocket-mock not needed for now.
// {...,Server} from mock-server, not being used for now.
//Object.assign(global, require('jest-chrome')); for now not needed.

jest.mock('react-native-localize', () => {
  return {getLocales: jest.fn().mockReturnValue(['en'])};
});

jest.mock('react-native-simple-toast', () => ({
  SHORT: jest.fn(),
}));

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);

jest.mock('redux-persist', () => {
  const real = jest.requireActual('redux-persist');
  return {
    ...real,
    persistReducer: jest
      .fn()
      .mockImplementation((config, reducers) => reducers),
  };
});
//for later may be needed:
//jest.mock('redux-persist/integration/react', () => ({   PersistGate: (props: any) => props.children, }))
