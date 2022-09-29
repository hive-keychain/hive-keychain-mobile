import * as BridgeModule from 'components/bridge';

export default {
  encodeMemo: (error: boolean, value: string | Error) => {
    if (error) {
      jest.spyOn(BridgeModule, 'encodeMemo').mockRejectedValue(value);
    } else {
      jest.spyOn(BridgeModule, 'encodeMemo').mockResolvedValue(value as string);
    }
  },
  signBuffer: (error: boolean, value: string | Error) => {
    if (error) {
      jest.spyOn(BridgeModule, 'signBuffer').mockRejectedValue(value);
    } else {
      jest.spyOn(BridgeModule, 'signBuffer').mockResolvedValue(value as string);
    }
  },
};
