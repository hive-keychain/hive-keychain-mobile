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
			name: 'WV_INFO',
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
				name: 'WV_INFO',
				data: {
					url: location.href,
					icon: __getFavicon(),
					name: __getName()
				}
			}
		))
	},2000);
`;

export const BRIDGE_WV_INFO = `
	(function () {
		${getWebviewInfo}
	})();
`;
