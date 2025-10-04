const {getDefaultConfig} = require('@expo/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const watchFolders = process.env.METRO_WATCH_FOLDERS
  ? process.env.METRO_WATCH_FOLDERS.split(',').map((folder) =>
      path.resolve(__dirname, folder.trim()),
    )
  : [];

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const {transformer, resolver} = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
    _expoRelativeProjectRoot: __dirname,
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
  };
  config.watchFolders = watchFolders;

  return wrapWithReanimatedMetroConfig(config);
})();
