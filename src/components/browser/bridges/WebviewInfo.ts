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
	
	(function() {
	let lastScrollPosition=0;
    function handleScroll() {
        const isAtTop = window.scrollY === 0;
		const showNavigationBar = lastScrollPosition >= window.scrollY;		
        window.ReactNativeWebView.postMessage(JSON.stringify({ name: '${ProviderEvent.SCROLL}', isAtTop, showNavigationBar }));
      	lastScrollPosition = window.scrollY;
		}
      window.addEventListener('scroll', handleScroll);
      handleScroll();
    })();
`;

export const BRIDGE_WV_INFO = `
	(function () {
		${getWebviewInfo}
	})();
`;
