import dotenv from 'dotenv';
import base from './app.json';
dotenv.config();
export default ({config}) => ({
  ...config,
  expo: {
    name: 'Hive Keychain',
    slug: 'hive-keychain',

    version: base.expo.version,
    orientation: 'portrait',
    icon: './src/assets/images/icons/ios_launcher.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    backgroundColor: '#212838',
    assetBundlePatterns: ['src/assets/fonts/*'],
    owner: 'stoodkev',
    extra: {
      eas: {
        projectId: 'cad28c24-8bb3-48a4-802b-282ba38d6fab',
      },
    },
    splash: {
      image: './src/assets/images/icons/splashscreen.png',
      resizeMode: 'contain',
      backgroundColor: '#212838',
    },
    ios: {
      ...base.expo.ios,
      bundleIdentifier: 'com.stoodkev.mobileKeychain',
      supportsTablet: false,
      teamId: process.env.APPLE_TEAM_ID,
      id: process.env.APPLE_ID,
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'We need your location to load maps.',
        ITSAppUsesNonExemptEncryption: false,
        UISupportedInterfaceOrientations: [
          'UIInterfaceOrientationPortrait',
          'UIInterfaceOrientationLandscapeLeft',
          'UIInterfaceOrientationLandscapeRight',
        ],
        CFBundleURLTypes: [
          {
            CFBundleTypeRole: 'Editor',
            CFBundleURLName: 'has',
            CFBundleURLSchemes: ['has', 'hive'],
          },
        ],
      },
      googleServicesFile: process.env.GOOGLE_SERVICES_PLIST,
    },
    android: {
      ...base.expo.android,
      package:
        process.env.APP_VARIANT !== 'prod'
          ? 'com.mobilekeychain.dev'
          : 'com.mobilekeychain',
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      permissions: [
        'android.permission.CAMERA',
        'ACCESS_FINE_LOCATION',
        'ACCESS_COARSE_LOCATION',
      ],
      softwareKeyboardLayoutMode: 'pan',
      adaptiveIcon: {
        resizeMode: 'contain',
        foregroundImage: './src/assets/images/icons/android_launcher.png',
        backgroundColor: '#000000',
      },
      edgeToEdgeEnabled: true,
      intentFilters: [
        {
          action: 'VIEW',
          data: [
            {scheme: 'http'},
            {scheme: 'https'},
            {scheme: 'has'},
            {scheme: 'hive'},
            {scheme: 'keychain'},
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    plugins: [
      'expo-localization',
      [
        './widgets/plugin/withAndroidWidget.js',
        {
          android: {
            distPlaceholder: 'com.mobilekeychain',
            src: 'widgets/android',
          },
        },
      ],
      [
        'expo-camera',
        {
          cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera',
        },
      ],
      [
        'expo-font',
        {
          fonts: [
            './src/assets/fonts/Poppins-Italic.ttf',
            './src/assets/fonts/Poppins-SemiBold.ttf',
            './src/assets/fonts/Poppins-Regular.ttf',
            './src/assets/fonts/Poppins-Medium.ttf',
            './src/assets/fonts/Poppins-Bold.ttf',
            './src/assets/fonts/Poppins-Black.ttf',
            './src/assets/fonts/JosefinSans-Bold.ttf',
            './src/assets/fonts/JosefinSans-Regular.ttf',
            './src/assets/fonts/JosefinSans-Medium.ttf',
          ],
        },
      ],
      [
        'expo-build-properties',
        {
          ios: {useFrameworks: 'static'},
        },
      ],
      '@react-native-firebase/app',
      '@react-native-firebase/crashlytics',
      [
        'expo-secure-store',
        {
          configureAndroidBackup: true,
          faceIDPermission: 'Enable biometrics login in $(PRODUCT_NAME)',
        },
      ],
    ],
  },
});
