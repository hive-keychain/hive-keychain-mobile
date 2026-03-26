export type BrowserTabMessage = {
  name?: string;
  request_id?: number;
  data?: any;
  isAtTop?: boolean;
  isAtTopOfCanvas?: boolean;
  showNavigationBar?: boolean;
  isFlutterCanvasApp?: boolean;
  domain?: string;
  imageUrl?: string;
  linkUrl?: string;
  x?: number;
  y?: number;
  count?: number;
  current?: number;
};

export const parseBrowserTabMessage = (
  rawMessage: string,
): BrowserTabMessage | null => {
  try {
    return JSON.parse(rawMessage) as BrowserTabMessage;
  } catch {
    return null;
  }
};
