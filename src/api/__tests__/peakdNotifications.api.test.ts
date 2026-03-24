import {PeakDNotificationsApi} from '../peakdNotifications.api';
import {BaseApi} from '../base.api';

jest.mock('utils/config.utils', () => ({
  PeakdNotificationsConfig: {baseURL: 'https://notify.peakd.test'},
}));

jest.mock('../base.api', () => ({
  BaseApi: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('PeakDNotificationsApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('get prepends Peakd notifications base URL', async () => {
    (BaseApi.get as jest.Mock).mockResolvedValue({items: []});

    await PeakDNotificationsApi.get('v1/inbox');

    expect(BaseApi.get).toHaveBeenCalledWith(
      'https://notify.peakd.test/v1/inbox',
    );
  });

  it('post prepends Peakd notifications base URL', async () => {
    (BaseApi.post as jest.Mock).mockResolvedValue({ok: true});
    const body = {read: true};

    await PeakDNotificationsApi.post('v1/read', body);

    expect(BaseApi.post).toHaveBeenCalledWith(
      'https://notify.peakd.test/v1/read',
      body,
    );
  });
});
