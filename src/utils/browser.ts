import URL from 'url-parse';

export const urlTransformer = (url: string) => {
  const isHttps = url && url.toLowerCase().substr(0, 6) === 'https:';
  const urlObj = new URL(url);
  const hostname = urlObj.hostname.toLowerCase().replace(/^www\./, '');
  return {hostname, isHttps};
};
