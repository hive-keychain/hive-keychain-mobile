import AsyncStorage from '@react-native-async-storage/async-storage';
import {Buffer} from 'buffer';
import * as FileSystem from 'expo-file-system/legacy';
import {shareAsync} from 'expo-sharing';
import {Platform} from 'react-native';
import SimpleToast from 'react-native-root-toast';
import {translate} from 'utils/localize';

const STORAGE_DIRECTORY_URI_KEY = 'android_storage_directory_uri';

// Video file extensions
const VIDEO_EXTENSIONS = [
  'mp4',
  'webm',
  'ogv',
  'ogg',
  'mov',
  'avi',
  'mkv',
  '3gp',
  'flv',
] as const;

/**
 * Checks if an extension or mimeType represents a video
 */
const isVideoExtension = (extension: string): boolean => {
  return VIDEO_EXTENSIONS.includes(extension.toLowerCase() as any);
};

const isVideoMimeType = (mimeType: string): boolean => {
  return mimeType.startsWith('video/');
};

/**
 * Shares a file with platform-specific parameters
 * @param uri - The file URI to share
 * @param mimeType - The MIME type of the file
 */
const shareFile = (uri: string, mimeType: string) => {
  if (Platform.OS === 'ios') {
    shareAsync(uri, {UTI: getUTIFromMimeType(mimeType)});
  } else {
    shareAsync(uri, {mimeType});
  }
};

/**
 * Converts MIME type to iOS UTI (Uniform Type Identifier)
 * @param mimeType - The MIME type string (e.g., 'image/gif', 'video/mp4')
 * @returns The UTI string for iOS
 */
const getUTIFromMimeType = (mimeType: string): string => {
  const utiMap: Record<string, string> = {
    // Images
    'image/jpeg': 'public.jpeg',
    'image/png': 'public.png',
    'image/gif': 'com.compuserve.gif',
    'image/webp': 'public.webp',
    'image/svg+xml': 'public.svg-image',
    'image/bmp': 'com.microsoft.bmp',
    'image/x-icon': 'com.microsoft.ico',
    // Videos
    'video/mp4': 'public.mpeg-4',
    'video/webm': 'org.webmproject.webm',
    'video/ogg': 'org.xiph.ogg',
    'video/quicktime': 'com.apple.quicktime-movie',
    'video/x-msvideo': 'public.avi',
    'video/x-matroska': 'org.matroska.mkv',
    'video/3gpp': 'public.3gpp',
    'video/x-flv': 'com.adobe.flash.video',
  };

  return utiMap[mimeType] || 'public.data';
};

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
 * Gets the file extension from a MIME type
 * @param mimeType - The MIME type string (e.g., 'image/gif', 'video/mp4')
 * @returns The file extension
 */
const getExtensionFromMimeType = (mimeType: string): string => {
  const extensionMap: Record<string, string> = {
    // Images
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/bmp': 'bmp',
    'image/x-icon': 'ico',
    // Videos
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/ogg': 'ogg',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi',
    'video/x-matroska': 'mkv',
    'video/3gpp': '3gp',
    'video/x-flv': 'flv',
  };

  return extensionMap[mimeType] || 'jpg';
};

/**
 * Extracts the file extension from a media URL or data URL
 * @param mediaUrl - The URL or data URL of the media file
 * @returns The file extension (defaults to 'jpg' for images, 'mp4' for videos)
 */
const extractMediaExtension = (mediaUrl: string): string => {
  // Handle data URLs (base64 media)
  if (mediaUrl.startsWith('data:')) {
    const matches = mediaUrl.match(/data:(image|video)\/(\w+);/);
    if (matches && matches[2]) {
      return matches[2];
    }
    if (mediaUrl.startsWith('data:video/')) {
      return 'mp4'; // Default for video data URLs
    }
    return 'jpg'; // Default for image data URLs
  }

  // Handle regular URLs - try to extract extension from URL
  const urlParts = mediaUrl.split('/');
  const filename = urlParts[urlParts.length - 1];
  const filenameWithoutQuery = filename.split('?')[0];

  // Try to get extension from filename
  if (filenameWithoutQuery.includes('.')) {
    const extMatch = filenameWithoutQuery.match(/\.([^.]+)$/);
    if (extMatch && extMatch[1]) {
      return extMatch[1];
    }
  }

  // Try to get extension from URL path
  const extMatch = mediaUrl.match(
    /\.(gif|jpg|jpeg|png|webp|svg|bmp|ico|mp4|webm|ogv|ogg|mov|avi|mkv|3gp|flv)(\?|$)/i,
  );
  if (extMatch && extMatch[1]) {
    return extMatch[1];
  }

  return 'jpg'; // Default extension
};

export const downloadFromUrl = async (
  uri: string,
  onShowModal?: (
    onSave: (onComplete?: () => void) => Promise<void>,
    onShare: () => void,
  ) => void,
) => {
  // Initial extension from URL (may be inaccurate)
  let extension = extractMediaExtension(uri);

  // Get initial mimeType from extension
  let mimeType = getMimeTypeFromExtension(extension);

  let fileUri: string;
  let finalExtension = extension;
  let finalMimeType = mimeType;

  // Determine if we should use fetch (for GIFs and videos) or downloadAsync
  const isGif = extension.toLowerCase() === 'gif';
  const isVideoFromExtension = isVideoExtension(extension);

  /**
   * Downloads media using fetch and preserves binary data
   */
  const downloadWithFetch = async (): Promise<void> => {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(
        `Failed to download: ${response.status} ${response.statusText}`,
      );
    }

    // Update mimeType and extension from Content-Type header
    const contentType = response.headers.get('Content-Type');
    if (contentType) {
      finalMimeType = contentType;
      finalExtension = getExtensionFromMimeType(finalMimeType);
    }

    // Convert to base64 for storage
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    // Generate filename with correct extension
    const prefix = isVideoMimeType(finalMimeType) ? 'video' : 'image';
    const filename = `${prefix}_${Date.now()}.${finalExtension}`;
    fileUri = FileSystem.documentDirectory + filename;

    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
  };

  if (isGif || isVideoFromExtension) {
    // Use fetch for GIFs and videos to preserve binary data
    await downloadWithFetch();
  } else {
    // Use downloadAsync for regular images
    // After download, check Content-Type and handle videos/GIFs if detected
    const prefix = isVideoFromExtension ? 'video' : 'image';
    const initialFilename = `${prefix}_${Date.now()}.${extension}`;

    const result = await FileSystem.downloadAsync(
      uri,
      FileSystem.documentDirectory + initialFilename,
    );
    fileUri = result.uri;

    // Get mimeType from Content-Type header if available
    const contentType = result.headers?.['Content-Type'];
    if (contentType) {
      finalMimeType = contentType;
      finalExtension = getExtensionFromMimeType(finalMimeType);

      const isVideoFromMimeType = isVideoMimeType(finalMimeType);
      const isGifFromMimeType = finalMimeType === 'image/gif';

      // If Content-Type indicates it's a video or GIF but we used downloadAsync,
      // re-download with fetch to preserve binary data
      if (
        (isVideoFromMimeType || isGifFromMimeType) &&
        !isGif &&
        !isVideoFromExtension
      ) {
        // Delete the incorrectly downloaded file
        try {
          await FileSystem.deleteAsync(fileUri, {idempotent: true});
        } catch (e) {
          // Ignore deletion errors
        }
        // Re-download with fetch to preserve binary data
        await downloadWithFetch();
      } else if (finalExtension !== extension) {
        // Rename file if extension changed but it's not a video/GIF
        const correctPrefix = isVideoFromMimeType ? 'video' : 'image';
        const timestampMatch = initialFilename.match(/_(\d+)\./);
        const timestamp = timestampMatch
          ? timestampMatch[1]
          : Date.now().toString();
        const newFilename = `${correctPrefix}_${timestamp}.${finalExtension}`;
        const newFileUri = FileSystem.documentDirectory + newFilename;
        try {
          await FileSystem.moveAsync({
            from: fileUri,
            to: newFileUri,
          });
          fileUri = newFileUri;
        } catch (error) {
          console.error('Error renaming file:', error);
        }
      }
    }
  }

  // Extract filename from fileUri for saving
  const finalFilename =
    fileUri.split('/').pop() || `media_${Date.now()}.${finalExtension}`;

  if (Platform.OS === 'android' && onShowModal) {
    // Show modal for Android
    onShowModal(
      (onComplete?: () => void) =>
        saveFile(fileUri, finalFilename, finalMimeType, onComplete),
      () => shareFile(fileUri, finalMimeType),
    );
  } else {
    // iOS - direct share
    shareFile(fileUri, finalMimeType);
  }
};

const saveFile = async (
  uri: string,
  filename: string,
  mimetype: string,
  onComplete?: () => void,
) => {
  try {
    await save(uri, filename, mimetype);
    // Show toast notification after successful save
    SimpleToast.show(translate('common.file_saved_successfully'), {
      duration: SimpleToast.durations.SHORT,
    });
    onComplete?.();
  } catch (error) {
    console.error('Error saving file:', error);
    SimpleToast.show(translate('common.file_save_failed'), {
      duration: SimpleToast.durations.SHORT,
    });
  }
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
        // Read file as base64 to preserve binary data (GIFs, videos, etc.)
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await FileSystem.StorageAccessFramework.createFileAsync(
          directoryUri,
          filename,
          mimetype,
        )
          .then(async (fileUri) => {
            // Write base64 data back - this preserves binary format for GIFs and videos
            await FileSystem.writeAsStringAsync(fileUri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
          })
          .catch(async (e) => {
            console.log('error', e);
            // If the stored URI is no longer valid, clear it and fall back to sharing
            await AsyncStorage.removeItem(STORAGE_DIRECTORY_URI_KEY);
            shareFile(uri, mimetype);
          });
      } else {
        shareFile(uri, mimetype);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      shareFile(uri, mimetype);
    } finally {
      askingForPermissions = false;
    }
  } else {
    // iOS - share with UTI
    shareFile(uri, mimetype);
  }
};
