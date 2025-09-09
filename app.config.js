export default ({config}) => ({
  ...config,
  expo: {
    expo: {
      name: 'Hive Keychain',
      slug: 'hive-keychain',
      version: '1.0.0',
      orientation: 'portrait',
      icon: './src/assets/ic_launcher-playstore.png',
      userInterfaceStyle: 'light',
      newArchEnabled: true,
      assetBundlePatterns: ['src/assets/fonts/*'],
      splash: {
        image: './src/assets/new_UI/keychain_logo_powered_dark_theme.png',
        resizeMode: 'contain',
        backgroundColor: '#212838',
      },
      ios: {
        bundleIdentifier: 'com.mobilekeychain',
        supportsTablet: true,
        infoPlist: {
          NSLocationWhenInUseUsageDescription:
            'We need your location for maps.',
        },
        // googleServicesFile: './google-services.json',
      },
      android: {
        package:
          process.env.APP_VARIANT !== 'prod'
            ? 'com.mobilekeychain.dev.expo'
            : 'com.mobilekeychain',
        // googleServicesFile: './google-services.json',
        permissions: [
          'android.permission.CAMERA',
          'ACCESS_FINE_LOCATION',
          'ACCESS_COARSE_LOCATION',
        ],
        softwareKeyboardLayoutMode: 'pan',
        adaptiveIcon: {
          resizeMode: 'contain',
          foregroundImage:
            './src/assets/new_UI/keychain_logo_powered_dark_theme.png',
          backgroundColor: '#212838',
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
      ],
    },
  },
});
