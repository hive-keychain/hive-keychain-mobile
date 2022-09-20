import { store } from "store";

export default {
    dispatch: {
        WithNoImplementation:   store.dispatch = jest.fn(),
    },
};