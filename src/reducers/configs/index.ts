import AsyncStorage from '@react-native-community/async-storage';
//AsyncStorage.clear();
const baseConfig = {storage: AsyncStorage};

export const persistConfig = (key: string) => ({key, ...baseConfig});
