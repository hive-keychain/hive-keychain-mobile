import URL from 'url-parse';

export const urlTransformer = (url: string) => {
  const isHttps = url && url.toLowerCase().substr(0, 6) === 'https:';
  const urlObj = new URL(url);
  const hostname = urlObj.hostname.toLowerCase().replace(/^www\./, '');
  const pathname = urlObj.pathname === '/' ? '' : urlObj.pathname;
  return {...urlObj, hostname, isHttps, pathname};
};
