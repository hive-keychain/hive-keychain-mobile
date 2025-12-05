import * as FileSystem from 'expo-file-system/legacy';
import {shareAsync} from 'expo-sharing';
import {Platform} from 'react-native';

export const downloadFromUrl = async (uri: string, extension: string) => {
  const filename = `image_${Date.now()}.${extension}`;
  const result = await FileSystem.downloadAsync(
    uri,
    FileSystem.documentDirectory + filename,
  );
  console.log(result);

  save(result.uri, filename, result.headers['Content-Type']);
};

const save = async (uri: string, filename: string, mimetype: string) => {
  if (Platform.OS === 'android') {
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (permissions.granted) {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        filename,
        mimetype,
      )
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
        })
        .catch((e) => console.log(e));
    } else {
      shareAsync(uri);
    }
  } else {
    shareAsync(uri);
  }
};
