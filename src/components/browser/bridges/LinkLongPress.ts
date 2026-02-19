import {ProviderEvent} from 'src/enums/providerEvent.enum';

export const LINK_LONG_PRESS_SCRIPT = `
(function() {
  if (window.linkLongPressInitialized) {
    return true;
  }
  window.linkLongPressInitialized = true;

  const style = document.createElement('style');
  style.innerHTML = \`
    a, a * {
      -webkit-touch-callout: none !important;
      -webkit-user-select: none !important;
      user-select: none !important;
    }
  \`;
  const attachStyle = () => {
    const styleHost = document.head || document.documentElement;
    if (!styleHost || style.parentNode) {
      return;
    }
    styleHost.appendChild(style);
  };
  attachStyle();
  if (!style.parentNode) {
    document.addEventListener('DOMContentLoaded', attachStyle, {once: true});
  }

  let longPressTimer = null;
  let longPressTarget = null;
  let suppressClickUntil = 0;

  const LONG_PRESS_DURATION = 500;
  const MOVE_THRESHOLD = 10;
  const SUPPRESS_CLICK_DURATION = 750;

  function getTargetElement(target) {
    if (!target) return null;
    if (target.nodeType === Node.TEXT_NODE) {
      return target.parentElement;
    }
    return target;
  }

  function hasMediaParent(target) {
    return !!target.closest('img, video');
  }

  function getAnchor(target) {
    if (!target || typeof target.closest !== 'function') {
      return null;
    }
    if (hasMediaParent(target)) {
      return null;
    }
    return target.closest('a[href]');
  }

  function resolveLinkUrl(anchor) {
    const href = anchor.getAttribute('href') || anchor.href;
    if (!href || href.startsWith('javascript:')) {
      return '';
    }
    try {
      return new URL(href, window.location.href).href;
    } catch (error) {
      return '';
    }
  }

  function postLinkLongPress(linkUrl, x, y) {
    if (!window.ReactNativeWebView || !linkUrl) {
      return;
    }
    try {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        name: '${ProviderEvent.LINK_LONG_PRESS}',
        linkUrl,
        x,
        y,
      }));
    } catch (error) {
      console.error('Error sending link long press message:', error);
    }
  }

  function clearLongPressState() {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    longPressTarget = null;
  }

  function triggerLinkLongPress(anchor, x, y) {
    const resolvedUrl = resolveLinkUrl(anchor);
    if (!resolvedUrl) {
      clearLongPressState();
      return;
    }
    suppressClickUntil = Date.now() + SUPPRESS_CLICK_DURATION;
    postLinkLongPress(resolvedUrl, x, y);
    clearLongPressState();
  }

  function onTouchStart(event) {
    if (event.touches.length !== 1) {
      clearLongPressState();
      return;
    }
    const element = getTargetElement(event.target);
    if (!element) {
      clearLongPressState();
      return;
    }
    const anchor = getAnchor(element);
    if (!anchor) {
      clearLongPressState();
      return;
    }
    const touch = event.touches[0];
    clearLongPressState();
    longPressTarget = {
      anchor,
      startX: touch.clientX,
      startY: touch.clientY,
      x: touch.clientX,
      y: touch.clientY,
    };
    longPressTimer = setTimeout(() => {
      if (!longPressTarget) {
        return;
      }
      triggerLinkLongPress(
        longPressTarget.anchor,
        longPressTarget.x,
        longPressTarget.y,
      );
    }, LONG_PRESS_DURATION);
  }

  function onTouchMove(event) {
    if (!longPressTimer || !longPressTarget || event.touches.length !== 1) {
      return;
    }
    const touch = event.touches[0];
    const deltaX = Math.abs(touch.clientX - longPressTarget.startX);
    const deltaY = Math.abs(touch.clientY - longPressTarget.startY);
    if (deltaX > MOVE_THRESHOLD || deltaY > MOVE_THRESHOLD) {
      clearLongPressState();
    } else {
      longPressTarget.x = touch.clientX;
      longPressTarget.y = touch.clientY;
    }
  }

  function onTouchEnd() {
    clearLongPressState();
  }

  function onContextMenu(event) {
    const element = getTargetElement(event.target);
    if (!element) {
      return;
    }
    const anchor = getAnchor(element);
    if (!anchor) {
      return;
    }
    event.preventDefault();
    triggerLinkLongPress(anchor, event.clientX, event.clientY);
  }

  function onClick(event) {
    if (Date.now() > suppressClickUntil) {
      return;
    }
    const element = getTargetElement(event.target);
    if (!element) {
      return;
    }
    const anchor = getAnchor(element);
    if (!anchor) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
  }

  document.addEventListener('touchstart', onTouchStart, {
    capture: true,
    passive: true,
  });
  document.addEventListener('touchmove', onTouchMove, {
    capture: true,
    passive: true,
  });
  document.addEventListener('touchend', onTouchEnd, {
    capture: true,
    passive: true,
  });
  document.addEventListener('touchcancel', onTouchEnd, {
    capture: true,
    passive: true,
  });
  document.addEventListener('contextmenu', onContextMenu, true);
  document.addEventListener('click', onClick, true);

  true;
})();
`;
