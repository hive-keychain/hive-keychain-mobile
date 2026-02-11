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
  const appNodeModules = path.resolve(__dirname, 'node_modules');

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
    _expoRelativeProjectRoot: __dirname,
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
    nodeModulesPaths: [...(resolver.nodeModulesPaths || []), appNodeModules],
    extraNodeModules: {
      ...(resolver.extraNodeModules || {}),
      'hive-keychain-commons': path.resolve(
        __dirname,
        'node_modules/hive-keychain-commons',
      ),
      bs58: path.resolve(__dirname, 'node_modules/bs58'),
      'crypto-js': path.resolve(__dirname, 'node_modules/crypto-js'),
    },
  };
  config.watchFolders = watchFolders;

  return wrapWithReanimatedMetroConfig(config);
})();
