import {ProviderEvent} from 'src/enums/providerEvent.enum';

const getWebviewInfo = `
	// Clear any existing intervals and event listeners
	if (window._keychainInfoInterval) {
		clearInterval(window._keychainInfoInterval);
	}
	
	// Remove existing event listeners if they exist
	if (window._keychainScrollHandler) {
		window.removeEventListener('scroll', window._keychainScrollHandler);
	}
	if (window._keychainTouchStartHandler) {
		window.removeEventListener('touchstart', window._keychainTouchStartHandler);
	}
	if (window._keychainTouchEndHandler) {
		window.removeEventListener('touchend', window._keychainTouchEndHandler);
	}
	
	const __getFavicon = function(){
		let favicon = undefined;
		const nodeList = document.getElementsByTagName("link");
		for (let i = 0; i < nodeList.length; i++)
		{
			const rel = nodeList[i].getAttribute("rel")
			if (rel === "icon" || rel === "shortcut icon")
			{
				favicon = nodeList[i]
				break;
			}
		}
		return favicon && favicon.href
	}
	const __getName=function(){
		const siteName = document.querySelector('head > meta[property="og:site_name"]');
		const title= siteName || document.querySelector('head > meta[name="title"]');
		return title ? title.content : document.title.length>0?document.title:document.domain;
	}
	window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(
		{
			name: '${ProviderEvent.INFO}',
			data: {
				url: location.href,
				icon: __getFavicon(),
				name: __getName()
			}
		}
	))

	window._keychainInfoInterval = setInterval(()=>{
		window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(
			{
				name: '${ProviderEvent.INFO}',
				data: {
					url: location.href,
					icon: __getFavicon(),
					name: __getName()
				}
			}
		))
	},2000);
	

  (function () {
  let lastTouchY = 0;
  let windowScrollY = 0;
  const iframeScrollY = {};
  let parentScrollY = 0;
  let lastGlobalScrollY = 0;
  let scrollDirection = 'none';

  const ProviderEvent = { SCROLL: 'SCROLL' };

  function getDeepestScrollableParentScroll(doc = document) {
    let maxScroll = 0;
    const allElements = doc.querySelectorAll('*');
    for (const el of allElements) {
      const style = doc.defaultView.getComputedStyle(el);
      if ((style.overflowY === 'auto' || style.overflowY === 'scroll') &&
          el.scrollHeight > el.clientHeight) {
        maxScroll = Math.max(maxScroll, el.scrollTop);
      }
    }
    return maxScroll;
  }

  function getGlobalCanScrollUp() {
    const anyIframeScrolled = Object.values(iframeScrollY).some(y => y > 0);
    return windowScrollY > 0 || parentScrollY > 0 || anyIframeScrolled;
  }

  function getGlobalScrollY() {
    return Math.max(windowScrollY, parentScrollY, ...Object.values(iframeScrollY));
  }

  function postScrollStatus(extra = {}) {
    const globalY = getGlobalScrollY();

    // Update scroll direction if scrolling happened
    if (globalY > lastGlobalScrollY) {
      scrollDirection = 'down';
    } else if (globalY < lastGlobalScrollY) {
      scrollDirection = 'up';
    }

    const isAtTop = !getGlobalCanScrollUp();
    const showNavigationBar = scrollDirection === 'up';

    lastGlobalScrollY = globalY;

    window.ReactNativeWebView?.postMessage(JSON.stringify({
      name: '${ProviderEvent.SCROLL}',
      isAtTop,
      showNavigationBar,
      scrollTop: globalY,
      ...extra
    }));
  }

  // ===== MAIN WINDOW SCROLL/TAP =====
  window._keychainScrollHandler = () => {
    windowScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    postScrollStatus({ source: 'main' });
  };
  
  window._keychainTouchStartHandler = function (e) {
    lastTouchY = e.touches[0].clientY;
  };
  
  window._keychainTouchEndHandler = function (e) {
    const deltaY = e.changedTouches[0].clientY - lastTouchY;
    lastTouchY = e.changedTouches[0].clientY;

    windowScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    parentScrollY = getDeepestScrollableParentScroll();

    postScrollStatus({
      source: 'main',
      showNavigationBar: deltaY > 0,
    });
  };

  window.addEventListener('scroll', window._keychainScrollHandler, { passive: true });
  window.addEventListener('touchstart', window._keychainTouchStartHandler);
  window.addEventListener('touchend', window._keychainTouchEndHandler);

  // ===== IFRAME SUPPORT =====
  function injectIframeListeners(iframe, index) {
    try {
      const iframeWin = iframe.contentWindow;
      const iframeDoc = iframe.contentDocument;
      if (!iframeWin || !iframeDoc) return;

      iframeScrollY[index] = 0;

      iframeWin.addEventListener('scroll', () => {
        iframeScrollY[index] = iframeWin.scrollY || iframeDoc.documentElement.scrollTop || 0;
        postScrollStatus({ source: 'iframe-' + index });
      }, { passive: true });

      iframeWin.addEventListener('touchstart', (e) => {
        lastTouchY = e.touches[0].clientY;
      });

      iframeWin.addEventListener('touchend', (e) => {
        const deltaY = e.changedTouches[0].clientY - lastTouchY;
        lastTouchY = e.changedTouches[0].clientY;

        iframeScrollY[index] = iframeWin.scrollY || iframeDoc.documentElement.scrollTop || 0;
        getDeepestScrollableParentScroll(iframeDoc);

        postScrollStatus({
          source: 'iframe-' + index,
          showNavigationBar: deltaY > 0,
        });
      });
    } catch (e) {
      // silently ignore cross-origin iframes
    }
  }

  function observeIframes() {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach((iframe, idx) => injectIframeListeners(iframe, idx));
  }

  function ensureIframeHooks() {
    observeIframes();
    // Use a longer timeout to prevent excessive recursion
    setTimeout(ensureIframeHooks, 1000);
  }

  ensureIframeHooks();
})();

(function() {
  try {
    const canvasElements = document.getElementsByTagName('canvas');
    const isFlutterCanvasApp =
      canvasElements.length > 0 &&
      [...canvasElements].some(canvas => {
        const width = canvas.width;
        const height = canvas.height;
        const style = window.getComputedStyle(canvas);
        const hasFlutterStyle = style.position === 'absolute' || style.position === 'fixed';
        return width > 0 && height > 0 && hasFlutterStyle;
      });

    const flutterDiv = document.querySelector('flt-glass-pane, flt-scene-host, flt-scene');

    window.ReactNativeWebView?.postMessage(JSON.stringify({
      name: '${ProviderEvent.FLUTTER_CHECK}',
      isFlutterCanvasApp: isFlutterCanvasApp || !!flutterDiv,
      domain: document.domain
    }));
  } catch (err) {
  }
})();
`;

export const BRIDGE_WV_INFO = `
	(function () {
		${getWebviewInfo}
	})();
`;
