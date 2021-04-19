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
			}
		}
		return favicon && favicon.href
	}
	window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(
		{
			name: 'WV_INFO',
			data: {
				url: location.href,
				icon: __getFavicon()
			}
		}
	))
`;

export const BRIDGE_WV_INFO = `
	(function () {
		${getWebviewInfo}
	})();
`;
