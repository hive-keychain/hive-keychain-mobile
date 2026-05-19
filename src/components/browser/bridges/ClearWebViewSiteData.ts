export const CLEAR_WEBVIEW_SITE_DATA_RESULT =
  'CLEAR_WEBVIEW_SITE_DATA_RESULT';

export const CLEAR_WEBVIEW_SITE_DATA_SCRIPT = `
(function() {
  var result = {
    localStorage: false,
    sessionStorage: false,
    indexedDB: { supported: false, cleared: 0, errors: 0 },
    caches: { supported: false, cleared: 0, errors: 0 },
    serviceWorkers: { supported: false, cleared: 0, errors: 0 }
  };

  var safePostResult = function() {
    try {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: '${CLEAR_WEBVIEW_SITE_DATA_RESULT}',
          result: result
        }));
      }
    } catch (error) {}
  };

  var settle = function(promise) {
    return Promise.resolve(promise).catch(function() {
      return undefined;
    });
  };

  Promise.resolve()
    .then(function() {
      try {
        if (window.localStorage) {
          window.localStorage.clear();
          result.localStorage = true;
        }
      } catch (error) {}

      try {
        if (window.sessionStorage) {
          window.sessionStorage.clear();
          result.sessionStorage = true;
        }
      } catch (error) {}

      var tasks = [];

      try {
        if (window.indexedDB && typeof window.indexedDB.databases === 'function') {
          result.indexedDB.supported = true;
          tasks.push(
            settle(window.indexedDB.databases()).then(function(databases) {
              if (!Array.isArray(databases)) return;
              return Promise.all(
                databases.map(function(database) {
                  return new Promise(function(resolve) {
                    if (!database || !database.name) {
                      resolve();
                      return;
                    }
                    try {
                      var request = window.indexedDB.deleteDatabase(database.name);
                      request.onsuccess = function() {
                        result.indexedDB.cleared += 1;
                        resolve();
                      };
                      request.onerror = function() {
                        result.indexedDB.errors += 1;
                        resolve();
                      };
                      request.onblocked = function() {
                        result.indexedDB.errors += 1;
                        resolve();
                      };
                    } catch (error) {
                      result.indexedDB.errors += 1;
                      resolve();
                    }
                  });
                })
              );
            })
          );
        }
      } catch (error) {}

      try {
        if (window.caches && typeof window.caches.keys === 'function') {
          result.caches.supported = true;
          tasks.push(
            settle(window.caches.keys()).then(function(cacheNames) {
              if (!Array.isArray(cacheNames)) return;
              return Promise.all(
                cacheNames.map(function(cacheName) {
                  return settle(window.caches.delete(cacheName)).then(function(deleted) {
                    if (deleted) {
                      result.caches.cleared += 1;
                    } else {
                      result.caches.errors += 1;
                    }
                  });
                })
              );
            })
          );
        }
      } catch (error) {}

      try {
        if (
          window.navigator &&
          window.navigator.serviceWorker &&
          typeof window.navigator.serviceWorker.getRegistrations === 'function'
        ) {
          result.serviceWorkers.supported = true;
          tasks.push(
            settle(window.navigator.serviceWorker.getRegistrations()).then(function(registrations) {
              if (!Array.isArray(registrations)) return;
              return Promise.all(
                registrations.map(function(registration) {
                  return settle(registration.unregister()).then(function(unregistered) {
                    if (unregistered) {
                      result.serviceWorkers.cleared += 1;
                    } else {
                      result.serviceWorkers.errors += 1;
                    }
                  });
                })
              );
            })
          );
        }
      } catch (error) {}

      return Promise.all(tasks);
    })
    .then(safePostResult)
    .catch(safePostResult);
})();
true;
`;
