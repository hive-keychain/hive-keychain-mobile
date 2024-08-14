export const DESKTOP_MODE = `
const meta = document.createElement('meta');
let initialScale = 0.4;
const content = 'width=device-width, initial-scale=' + initialScale ;
meta.setAttribute('name', 'viewport');
meta.setAttribute('content', content);
document.getElementsByTagName('head')[0].appendChild(meta);

`;
