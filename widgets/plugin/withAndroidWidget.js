const {
  AndroidConfig,
  withAndroidManifest,
  withAppBuildGradle,
  withDangerousMod,
  withMainApplication,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');
const {withSourceFiles} = require('./withSourceFiles');

function addWidgets(androidManifest) {
  const app = androidManifest.manifest.application[0];

  app.receiver ??= [];
  app.service ??= [];

  // Currency List Widget
  app.receiver.push({
    $: {
      'android:name': '.WidgetCurrencyListProvider',
      'android:exported': 'false',
      'android:label': '@string/widget_currency_list_receiver_label_name',
    },
    'intent-filter': [
      {
        action: [
          {$: {'android:name': 'android.appwidget.action.APPWIDGET_UPDATE'}},
        ],
      },
      {
        action: [
          {
            $: {
              'android:name':
                'com.mobilekeychain.WidgetCurrencyListProvider.ACTION_WIDGET_REFRESH',
            },
          },
        ],
      },
    ],
    'meta-data': [
      {
        $: {
          'android:name': 'android.appwidget.provider',
          'android:resource': '@xml/widget_currency_list',
        },
      },
    ],
  });

  // Account Balance Widget
  app.receiver.push({
    $: {
      'android:name': '.WidgetAccountBalanceListProvider',
      'android:exported': 'false',
      'android:label':
        '@string/widget_account_balance_list_receiver_label_name',
    },
    'intent-filter': [
      {
        action: [
          {$: {'android:name': 'android.appwidget.action.APPWIDGET_UPDATE'}},
        ],
      },
    ],
    'meta-data': [
      {
        $: {
          'android:name': 'android.appwidget.provider',
          'android:resource': '@xml/widget_account_balance_list',
        },
      },
    ],
  });

  // Services
  app.service.push({
    $: {
      'android:name': '.WidgetCurrencyListService',
      'android:permission': 'android.permission.BIND_REMOTEVIEWS',
    },
  });

  app.service.push({
    $: {
      'android:name': '.WidgetAccountBalanceListService',
      'android:permission': 'android.permission.BIND_REMOTEVIEWS',
    },
  });

  return androidManifest;
}

/**
 * Copy only PNG resources & Java into prebuild Android project
 */
function copyWidgetFiles(projectRoot) {
  const src = path.join(projectRoot, './widgets/android');
  const dest = path.join(projectRoot, 'android', 'app', 'src', 'main');

  if (!fs.existsSync(src)) {
    console.warn(
      '⚠️ widget-native folder not found. Skipping widget file copy.',
    );
    return;
  }

  const copyRecursive = (srcDir, destDir) => {
    fs.mkdirSync(destDir, {recursive: true});
    for (const file of fs.readdirSync(srcDir)) {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destDir, file);

      const stat = fs.statSync(srcPath);
      if (stat.isDirectory()) {
        copyRecursive(srcPath, destPath);
      } else if (stat.isFile()) {
        // Only copy PNGs to avoid duplicate WEBPs
        if (
          file.endsWith('.png') ||
          file.endsWith('.java') ||
          file.endsWith('.xml')
        ) {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
  };

  copyRecursive(src, dest);
  console.log('✅ Widget native files copied into android/app/src/main');
}

const withAndroidWidget = (config, options) => {
  // Inject manifest entries
  config = withAndroidManifest(config, (mod) => {
    mod.modResults = addWidgets(mod.modResults);
    return mod;
  });

  // Copy Java + resources **after prebuild**
  // config = withDangerousMod(config, [
  //   'android',
  //   async (config) => {
  //     copyWidgetFiles(config.modRequest.projectRoot);
  //     return config;
  //   },
  // ]);

  config = withAppBuildGradle(config, (gradle) => {
    if (
      !/implementation 'com.android.volley:volley:/.test(
        gradle.modResults.contents,
      )
    ) {
      gradle.modResults.contents = gradle.modResults.contents.replace(
        /dependencies\s*{/,
        "dependencies {\n    implementation 'com.android.volley:volley:1.2.1'",
      );
    }
    return gradle;
  });
  config = withSourceFiles(config, options);

  // Register WidgetBridgePackage in MainApplication.kt so NativeModules.WidgetBridge is available
  config = withMainApplication(config, (mod) => {
    const packageName =
      AndroidConfig.Package.getPackage(config) || 'com.mobilekeychain';
    let contents = mod.modResults.contents;
    const fqcn = `${packageName}.WidgetBridgePackage()`;
    const addLine = `packages.add(${fqcn})`;
    if (!contents.includes('WidgetBridgePackage()')) {
      contents = contents.replace(
        /(\n\s*return packages)/m,
        `\n    ${addLine}\n$1`,
      );
      mod.modResults.contents = contents;
    }
    return mod;
  });

  return config;
};

module.exports = withAndroidWidget;
