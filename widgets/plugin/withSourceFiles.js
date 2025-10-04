const {AndroidConfig, withDangerousMod} = require('@expo/config-plugins');
const fs = require('fs-extra');
const path = require('path');

const withSourceFiles = (config, options) => {
  return withDangerousMod(config, [
    'android',
    async (newConfig) => {
      const {modRequest} = newConfig;

      const projectRoot = modRequest.projectRoot;
      const platformRoot = modRequest.platformProjectRoot;
      const widgetFolderPath = path.join(projectRoot, options.android.src);
      const packageName = AndroidConfig.Package.getPackage(config);

      if (!packageName) {
        throw new Error(
          `ExpoWidgets:: app.(ts/json) must provide a value for android.package.`,
        );
      }

      copyResourceFiles(widgetFolderPath, platformRoot);

      const sourceFiles = copySourceFiles(
        widgetFolderPath,
        platformRoot,
        packageName,
      );

      modifySourceFiles(
        options.android.distPlaceholder,
        sourceFiles,
        packageName,
      );

      return newConfig;
    },
  ]);
};

function copyResourceFiles(widgetFolderPath, platformRoot) {
  const resourcesFolder = path.join(widgetFolderPath, 'res');
  const destinationFolder = path.join(platformRoot, 'app/src/main/res');

  if (!fs.existsSync(resourcesFolder)) {
    console.debug(
      `No resource "res" folder found in the widget source directory ${widgetFolderPath}. No resource files copied over.`,
    );
    return;
  }

  // console.debug(
  //   `Copying resources from ${resourcesFolder} to ${destinationFolder}`,
  // );

  safeCopy(resourcesFolder, destinationFolder);
}

function safeCopy(sourcePath, destinationPath) {
  try {
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath);
    }

    fs.copySync(sourcePath, destinationPath);
  } catch (e) {
    console.warn(e);
  }
}
function getSourceFileDestinationFolder(
  packageName,
  widgetFolderPath,
  platformRoot,
) {
  const packageNameAsPath = packageName?.replace(/\./g, '/');

  return path.join(platformRoot, 'app/src/main/java', packageNameAsPath);
}

function copySourceFiles(widgetFolderPath, platformRoot, packageName) {
  const originalSourceFolder = path.join(
    widgetFolderPath,
    'java/com/mobilekeychain',
  );
  const destinationFolder = getSourceFileDestinationFolder(
    packageName,
    widgetFolderPath,
    platformRoot,
  );

  if (!fs.existsSync(destinationFolder)) {
    fs.mkdirSync(destinationFolder);
  }

  // console.debug(
  //   `Copying source files from ${originalSourceFolder} to ${destinationFolder}`,
  // );

  const paths = fs.readdirSync(originalSourceFolder);

  const sourceFiles = [];

  for (const relativePath of paths) {
    const sourcePath = path.join(originalSourceFolder, relativePath);
    const destinationPath = path.join(destinationFolder, relativePath);

    if (fs.lstatSync(sourcePath).isDirectory()) {
      // If src is a directory it will copy everything inside of this directory, not the entire directory itself
      fs.emptyDirSync(destinationPath);
    }

    const file = path.basename(relativePath);

    if (file === 'Module.kt') {
      console.debug('Module file skipped during source file copy.');
      continue;
    }

    // console.debug(`Copying file ${sourcePath} to ${destinationPath}`);
    fs.copySync(sourcePath, destinationPath);
    sourceFiles.push(destinationPath);
  }

  return sourceFiles;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceAll(source, find, replace) {
  return source.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function modifySourceFiles(distPlaceholder, sourceFiles, packageName) {
  if (!distPlaceholder?.length) {
    console.debug(
      'No distPlaceholder set. Modification of source files not required.',
    );
    return;
  } else if (sourceFiles.length == 0) {
    console.debug('No source files provided for modification.');
    return;
  }

  // console.debug(
  //   `Modifying source files with placeholder ${distPlaceholder} to package ${packageName}`,
  // );

  const packageSearchStr = `package ${distPlaceholder}`;
  const packageReplaceStr = `package ${packageName}`;

  const importSearchStr = `import ${distPlaceholder}`;
  const importReplaceStr = `import ${packageName}`;

  for (const filePath of sourceFiles) {
    const contents = fs.readFileSync(filePath, {encoding: 'utf-8'});
    // console.debug(contents);

    const withModulesFixed = replaceAll(
      contents,
      packageSearchStr,
      packageReplaceStr,
    );
    const withImportsFixed = replaceAll(
      withModulesFixed,
      importSearchStr,
      importReplaceStr,
    );

    fs.writeFileSync(filePath, withImportsFixed);
  }
}

module.exports = {withSourceFiles};
