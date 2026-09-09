const {withAppBuildGradle} = require('expo/config-plugins');

const MARKER = '// hive-keychain: exclude Play phone-number SDKs';

const GRADLE_EXCLUSIONS = `
${MARKER}
configurations.configureEach {
    exclude group: 'com.google.android.gms', module: 'play-services-auth'
    exclude group: 'com.google.android.gms', module: 'play-services-auth-api-phone'
}
`;

/**
 * React Native Firebase's app module always depends on play-services-auth,
 * which pulls in play-services-auth-api-phone (SMS Retriever). Play's SDK
 * Index treats that as phone-number collection even when we never call it.
 */
function withAndroidNoPhoneApis(config) {
  return withAppBuildGradle(config, (mod) => {
    if (!mod.modResults.contents.includes(MARKER)) {
      mod.modResults.contents += GRADLE_EXCLUSIONS;
    }
    return mod;
  });
}

module.exports = withAndroidNoPhoneApis;
