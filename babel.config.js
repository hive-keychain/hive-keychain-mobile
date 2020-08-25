module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          actions: './src/actions',
          api: './src/api',
          assets: './src/assets',
          components: './src/components',
          locales: './src/locales',
          reducers: './src/reducers',
          screens: './src/screens',
          store: './src/store',
          utils: './src/utils',
        },
        extensions: ['.ios.js', '.android.js', '.js', '.json'],
      },
    ],
  ],
};
