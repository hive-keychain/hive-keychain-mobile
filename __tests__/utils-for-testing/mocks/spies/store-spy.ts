import { store } from "store";

export default {
    dispatch: jest.spyOn(store, 'dispatch'),
};