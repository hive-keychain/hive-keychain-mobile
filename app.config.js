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
      splash: {
        image: './src/assets/new_UI/keychain_logo_powered_dark_theme.png',
        resizeMode: 'contain',
        backgroundColor: '#212838',
      },
      ios: {
        bundleIdentifier: 'com.mobilekeychain',
        supportsTablet: true,
        googleServicesFile: './google-services.json',
      },
      android: {
        package:
          process.env.APP_VARIANT !== 'prod'
            ? 'com.mobilekeychain.dev.expo'
            : 'com.mobilekeychain',
        googleServicesFile: './google-services.json',
        permissions: ['android.permission.CAMERA'],
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
        'expo-camera',
        {
          cameraPermission: 'Allow $(PRODUCT_NAME) to access your camera',
        },
      ],
    },
  },
});
