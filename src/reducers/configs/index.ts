import AsyncStorage from '@react-native-async-storage/async-storage';
//AsyncStorage.clear();
const baseConfig = {storage: AsyncStorage};

export const persistConfig = (key: string) => ({key, ...baseConfig});
