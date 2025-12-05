export const IMAGE_DOWNLOAD_SCRIPT = `
(function() {
  if (window.imageDownloadInitialized) {
    return true;
  }
  window.imageDownloadInitialized = true;

  let longPressTimer = null;
  let longPressTarget = null;
  const LONG_PRESS_DURATION = 500; // milliseconds
  const MOVE_THRESHOLD = 10; // pixels

  function getImageElement(target) {
    if (target.tagName === 'IMG') {
      return target;
    }
    // Check if target is inside an image
    const img = target.closest('img');
    if (img) {
      return img;
    }
    // Check if target has background image
    const style = window.getComputedStyle(target);
    const bgImage = style.backgroundImage;
    if (bgImage && bgImage !== 'none' && bgImage !== 'initial') {
      // Try to extract URL from background-image
      const urlMatch = bgImage.match(/url\\(['"]?([^'"]+)['"]?\\)/);
      if (urlMatch && urlMatch[1]) {
        return {src: urlMatch[1], isBackground: true};
      }
    }
    return null;
  }

  function handleTouchStart(e) {
    const img = getImageElement(e.target);
    
    if (img) {
      const imageUrl = img.src || img.currentSrc || img.dataset.src || (img.isBackground ? img.src : null);
      
      if (imageUrl) {
        longPressTarget = {img, startX: e.touches[0].clientX, startY: e.touches[0].clientY};
        longPressTimer = setTimeout(() => {
          handleLongPress(img, imageUrl);
        }, LONG_PRESS_DURATION);
      }
    }
  }

  function handleTouchEnd(e) {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    longPressTarget = null;
  }

  function handleTouchMove(e) {
    if (longPressTimer && longPressTarget) {
      const deltaX = Math.abs(e.touches[0].clientX - longPressTarget.startX);
      const deltaY = Math.abs(e.touches[0].clientY - longPressTarget.startY);
      
      // Cancel long press if user moves finger significantly
      if (deltaX > MOVE_THRESHOLD || deltaY > MOVE_THRESHOLD) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
        longPressTarget = null;
      }
    }
  }

  function handleLongPress(img, imageUrl) {
    if (!imageUrl) {
      imageUrl = img.src || img.currentSrc || img.dataset.src;
    }
    
    if (imageUrl) {
      // Resolve relative URLs to absolute URLs
      let absoluteUrl = imageUrl;
      try {
        if (imageUrl.startsWith('//')) {
          absoluteUrl = window.location.protocol + imageUrl;
        } else if (imageUrl.startsWith('/')) {
          absoluteUrl = window.location.origin + imageUrl;
        } else if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://') && !imageUrl.startsWith('data:')) {
          absoluteUrl = new URL(imageUrl, window.location.href).href;
        }
      } catch (e) {
        console.error('Error resolving image URL:', e);
        // Use original URL if resolution fails
        absoluteUrl = imageUrl;
      }

      // Send message to React Native
      if (window.ReactNativeWebView) {
        try {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            name: 'IMAGE_DOWNLOAD',
            imageUrl: absoluteUrl,
            alt: (img.alt || img.getAttribute('alt') || ''),
          }));
        } catch (e) {
          console.error('Error sending image download message:', e);
        }
      }
    }
    
    // Clear the timer
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    longPressTarget = null;
  }

  // Add event listeners with capture phase to catch events early
  document.addEventListener('touchstart', handleTouchStart, {capture: true, passive: true});
  document.addEventListener('touchend', handleTouchEnd, {capture: true, passive: true});
  document.addEventListener('touchmove', handleTouchMove, {capture: true, passive: true});
  document.addEventListener('touchcancel', handleTouchEnd, {capture: true, passive: true});

  // Also handle contextmenu (right-click) for desktop-like behavior
  document.addEventListener('contextmenu', function(e) {
    const img = getImageElement(e.target);
    
    if (img && (img.src || img.currentSrc || img.dataset.src)) {
      e.preventDefault();
      const imageUrl = img.src || img.currentSrc || img.dataset.src;
      handleLongPress(img, imageUrl);
    }
  }, true);

  true; // Return true to indicate script executed successfully
})();
`;
