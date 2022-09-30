export default {
  prototype: {
    send: WebSocket.prototype.send = jest.fn(),
  },
};
