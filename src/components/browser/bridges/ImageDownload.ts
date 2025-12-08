export const IMAGE_DOWNLOAD_SCRIPT = `
 const style = document.createElement('style');
    style.innerHTML = \`
      img, a, * {
        -webkit-touch-callout: none !important;
        -webkit-user-select: none !important;
        user-select: none !important;
      }
    \`;
    document.head.appendChild(style);
    
(function() {
  if (window.imageDownloadInitialized) {
    return true;
  }
  window.imageDownloadInitialized = true;

  let longPressTimer = null;
  let longPressTarget = null;
  const LONG_PRESS_DURATION = 500; // milliseconds
  const MOVE_THRESHOLD = 10; // pixels

  function getMediaElement(target) {
    // Check for images
    if (target.tagName === 'IMG') {
      return target;
    }
    const img = target.closest('img');
    if (img) {
      return img;
    }
    
    // Check for videos
    if (target.tagName === 'VIDEO') {
      return target;
    }
    const video = target.closest('video');
    if (video) {
      return video;
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
    const media = getMediaElement(e.target);
    
    if (media) {
      // Handle both images and videos
      const mediaUrl = media.src || media.currentSrc || media.dataset.src || 
                       (media.tagName === 'VIDEO' ? (media.currentSrc || media.src) : null) ||
                       (media.isBackground ? media.src : null);
      
      if (mediaUrl) {
        longPressTarget = {media, startX: e.touches[0].clientX, startY: e.touches[0].clientY};
        longPressTimer = setTimeout(() => {
          handleLongPress(media, mediaUrl);
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

  function handleLongPress(media, mediaUrl) {
    if (!mediaUrl) {
      // Handle both images and videos
      if (media.tagName === 'VIDEO') {
        mediaUrl = media.currentSrc || media.src || media.dataset.src;
      } else {
        mediaUrl = media.src || media.currentSrc || media.dataset.src;
      }
    }
    
    if (mediaUrl) {
      // Resolve relative URLs to absolute URLs
      let absoluteUrl = mediaUrl;
      try {
        if (mediaUrl.startsWith('//')) {
          absoluteUrl = window.location.protocol + mediaUrl;
        } else if (mediaUrl.startsWith('/')) {
          absoluteUrl = window.location.origin + mediaUrl;
        } else if (!mediaUrl.startsWith('http://') && !mediaUrl.startsWith('https://') && !mediaUrl.startsWith('data:')) {
          absoluteUrl = new URL(mediaUrl, window.location.href).href;
        }
      } catch (e) {
        console.error('Error resolving media URL:', e);
        // Use original URL if resolution fails
        absoluteUrl = mediaUrl;
      }

      // Send message to React Native
      if (window.ReactNativeWebView) {
        try {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            name: 'IMAGE_DOWNLOAD',
            imageUrl: absoluteUrl,
            alt: (media.alt || media.getAttribute('alt') || media.getAttribute('title') || ''),
          }));
        } catch (e) {
          console.error('Error sending media download message:', e);
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
    const media = getMediaElement(e.target);
    
    if (media) {
      let mediaUrl = null;
      if (media.tagName === 'VIDEO') {
        mediaUrl = media.currentSrc || media.src || media.dataset.src;
      } else {
        mediaUrl = media.src || media.currentSrc || media.dataset.src;
      }
      
      if (mediaUrl) {
        e.preventDefault();
        handleLongPress(media, mediaUrl);
      }
    }
  }, true);

  true; // Return true to indicate script executed successfully
})();
`;
