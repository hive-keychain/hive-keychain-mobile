import {translateEscrowHistoryMessage} from '../escrowHistory.utils';

jest.mock('utils/localize', () => ({
  translate: jest.fn((key: string, params?: object) =>
    params ? `${key}:${JSON.stringify(params)}` : key,
  ),
}));

describe('escrowHistory.utils', () => {
  it('translates escrow message with params', () => {
    const {translate} = jest.requireMock('utils/localize');
    const out = translateEscrowHistoryMessage({
      key: 'escrow_funded',
      params: {from: 'a', to: 'b'},
    } as any);

    expect(translate).toHaveBeenCalledWith(
      'components.notifications.escrow_funded',
      {from: 'a', to: 'b'},
    );
    expect(out).toContain('components.notifications.escrow_funded');
  });
});
