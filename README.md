# Hive Keychain for Mobile

React Native wallet for the Hive Blockchain

# Install

- `npm i`
- Create `.env.json` at root containing `{}`. You can optionally add `ACCOUNT` and `KEY` parameters to save some time when testing adding a new account.
- `mv android/gradle.properties.example android/gradle.properties`

# Run in dev environment

## Android:

`npm run android`

## iOS:

`npm run ios`

# Test production

## Android:

Bundle : `npm run android-bundle`
Test Production Release : `npm run android-release`

## iOS:

Coming soon

## Troubleshooting

- SHA1 error : `watchman watch-del-all && npm run clean`
