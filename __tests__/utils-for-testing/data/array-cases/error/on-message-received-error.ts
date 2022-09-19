import { HAS_PayloadType } from "utils/hiveAuthenticationService/payloads.types";

const cases = [
    {
      description: 'no cmd',
      error: new Error(`invalid payload (cmd)`),
      webSocketEvent: { data: JSON.stringify({prop: '1'})} as WebSocketMessageEvent,
    },
    {
        description: 'cmd as string',
        error: new Error(`invalid payload (cmd)`),
        webSocketEvent: { data: JSON.stringify( { cmd: '1'})} as WebSocketMessageEvent,
    },
    {
        description: 'cmd not string, default switch case',
        error: new Error(`invalid payload (cmd)`),
        webSocketEvent: { data: JSON.stringify({ cmd: {} })} as WebSocketMessageEvent,
    },
  ];

  export default { cases };