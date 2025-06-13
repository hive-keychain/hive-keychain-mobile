const {getDefaultConfig} = require('metro-config');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const watchFolders = process.env.METRO_WATCH_FOLDERS
  ? process.env.METRO_WATCH_FOLDERS.split(',').map((folder) =>
      path.resolve(__dirname, folder.trim()),
    )
  : [];
module.exports = (async () => {
  const {
    resolver: {sourceExts, assetExts},
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },
    watchFolders,
  };
})();
