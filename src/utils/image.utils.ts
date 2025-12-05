import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import {shareAsync} from 'expo-sharing';
import {Platform} from 'react-native';

const STORAGE_DIRECTORY_URI_KEY = 'android_storage_directory_uri';

/**
 * Gets the MIME type for a media file based on its file extension
 * @param extension - The file extension (e.g., 'jpg', 'png', 'mp4', 'webm')
 * @returns The MIME type string
 */
const getMimeTypeFromExtension = (extension: string): string => {
  const mimeTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',
    ico: 'image/x-icon',
    // Videos
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogv: 'video/ogg',
    ogg: 'video/ogg',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',
    '3gp': 'video/3gpp',
    flv: 'video/x-flv',
  };

  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
};

/**
 * Extracts the file extension from a media URL or data URL
 * @param mediaUrl - The URL or data URL of the media file
 * @returns The file extension (defaults to 'jpg' for images, 'mp4' for videos)
 */
const extractMediaExtension = (mediaUrl: string): string => {
  let extension = 'jpg'; // Default extension

  // Handle data URLs (base64 media)
  if (mediaUrl.startsWith('data:')) {
    const matches = mediaUrl.match(/data:(image|video)\/(\w+);/);
    if (matches && matches[2]) {
      extension = matches[2];
    } else if (mediaUrl.startsWith('data:video/')) {
      extension = 'mp4'; // Default for video data URLs
    }
  } else {
    // Handle regular URLs - try to extract extension from URL
    const urlParts = mediaUrl.split('/');
    const filename = urlParts[urlParts.length - 1];

    // Remove query parameters
    const filenameWithoutQuery = filename.split('?')[0];

    // Try to get extension from filename
    if (filenameWithoutQuery.includes('.')) {
      const extMatch = filenameWithoutQuery.match(/\.([^.]+)$/);
      if (extMatch && extMatch[1]) {
        extension = extMatch[1];
      }
    } else {
      // Try to get extension from URL path (images and videos)
      const extMatch = mediaUrl.match(
        /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|mp4|webm|ogv|ogg|mov|avi|mkv|3gp|flv)(\?|$)/i,
      );
      if (extMatch && extMatch[1]) {
        extension = extMatch[1];
      }
    }
  }

  return extension;
};

export const downloadFromUrl = async (uri: string) => {
  const extension = extractMediaExtension(uri);
  const isVideo = [
    'mp4',
    'webm',
    'ogv',
    'ogg',
    'mov',
    'avi',
    'mkv',
    '3gp',
    'flv',
  ].includes(extension.toLowerCase());
  const prefix = isVideo ? 'video' : 'image';
  const filename = `${prefix}_${Date.now()}.${extension}`;
  const result = await FileSystem.downloadAsync(
    uri,
    FileSystem.documentDirectory + filename,
  );

  // Get mimeType from Content-Type header if available, otherwise derive from extension
  const mimeType =
    result.headers?.['Content-Type'] || getMimeTypeFromExtension(extension);
  save(result.uri, filename, mimeType);
};

let askingForPermissions = false;
const save = async (uri: string, filename: string, mimetype: string) => {
  if (Platform.OS === 'android') {
    if (askingForPermissions) {
      return;
    }
    askingForPermissions = true;

    try {
      // Try to get previously granted directory URI
      const storedDirectoryUri = await AsyncStorage.getItem(
        STORAGE_DIRECTORY_URI_KEY,
      );

      let directoryUri: string | null = null;

      if (storedDirectoryUri) {
        // Use stored directory URI (permission persists for this URI)
        directoryUri = storedDirectoryUri;
      } else {
        // Request permission for the first time
        const permissions =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          directoryUri = permissions.directoryUri;
          // Store the directory URI for future use
          await AsyncStorage.setItem(STORAGE_DIRECTORY_URI_KEY, directoryUri);
        }
      }

      if (directoryUri) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await FileSystem.StorageAccessFramework.createFileAsync(
          directoryUri,
          filename,
          mimetype,
        )
          .then(async (fileUri) => {
            await FileSystem.writeAsStringAsync(fileUri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
          })
          .catch(async (e) => {
            console.log('error', e);
            // If the stored URI is no longer valid, clear it and fall back to sharing
            await AsyncStorage.removeItem(STORAGE_DIRECTORY_URI_KEY);
            shareAsync(uri);
          });
      } else {
        shareAsync(uri);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      shareAsync(uri);
    } finally {
      askingForPermissions = false;
    }
  } else {
    shareAsync(uri);
  }
};
