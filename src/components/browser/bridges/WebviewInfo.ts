import {ProviderEvent} from 'src/enums/provider-event.enum';

const getWebviewInfo = `
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
		return title ? title.content : document.title
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

	setInterval(()=>{
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
	
	// (function() {
	// let lastScrollPosition=0;
    // function handleScroll() {
    //     const isAtTop = window.scrollY === 0;
	// 	const showNavigationBar = lastScrollPosition >= window.scrollY;		
    //     window.ReactNativeWebView.postMessage(JSON.stringify({ name: '${ProviderEvent.SCROLL}', isAtTop, showNavigationBar }));
    //   	lastScrollPosition = window.scrollY;
	// 	}
    //   window.addEventListener('scroll', handleScroll);
    //   handleScroll();
    // })();

	(function () {
  let lastTouchY = 0;
  let windowScrollPosition=0;
  let parentScrollPosition=0;
  let scrollCheckTimer=null;
  let lastScrollTop = -1;

   window.addEventListener('scroll', ()=>{
    windowScrollPosition = window.scrollY;
	let canScrollUp = windowScrollPosition > 0 || parentScrollPosition > 0;
   
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ name: '${ProviderEvent.SCROLL}', isAtTop: !canScrollUp})
    );
   });

  window.addEventListener('touchstart', function (e) {
    lastTouchY = e.touches[0].clientY;
  });

  window.addEventListener('touchend', function (e) {
    const currentY = e.changedTouches[0].clientY;
    const deltaY = currentY - lastTouchY;
    lastTouchY = currentY;

    const el = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    const scrollableParent = findScrollableParent(el);
    parentScrollPosition = scrollableParent?.scrollTop;
    let canScrollUp = windowScrollPosition > 0 || parentScrollPosition > 0;
    if(scrollableParent){
		scrollCheckTimer = setInterval(() => {
			const currentScrollTop = scrollableParent.scrollTop;
			if (currentScrollTop === lastScrollTop) {
				clearInterval(scrollCheckTimer);
				scrollCheckTimer = null;
				const canScrollUp = currentScrollTop > 0 || parentScrollPosition > 0;
				window.ReactNativeWebView?.postMessage(JSON.stringify({ name: '${ProviderEvent.SCROLL}', isAtTop: !canScrollUp}));
			}
			lastScrollTop = currentScrollTop;
		}, 100);
	} 
    window.ReactNativeWebView.postMessage(
      JSON.stringify({ name: '${ProviderEvent.SCROLL}', isAtTop: !canScrollUp, showNavigationBar: deltaY > 0,el:windowScrollPosition,scrollableParent:parentScrollPosition})
    );
  });

  function findScrollableParent(el) {
    while (el) {
      const style = window.getComputedStyle(el);
      const overflowY = style.overflowY;
      const canScroll = el.scrollHeight > el.clientHeight;

      if (canScroll && (overflowY === 'auto' || overflowY === 'scroll')) {
        return el;
      }
      el = el.parentElement;
    }
    return null;
  }
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
      isFlutterCanvasApp: isFlutterCanvasApp || !!flutterDiv
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
