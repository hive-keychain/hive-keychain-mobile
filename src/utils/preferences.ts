import {UserPreference} from 'reducers/preferences.types';

export const addPreferenceToState = (
  state: UserPreference[],
  username: string,
  domain: string,
  request: string,
) => {
  const userPref = state.find((u) => u.username === username);
  if (!userPref) {
    return [
      ...state,
      {username, domains: [{domain, whitelisted_requests: [request]}]},
    ];
  } else {
    const domainPref = userPref.domains.find((d) => d.domain === domain);
    if (domainPref) {
      if (!domainPref.whitelisted_requests.find((r) => r === request))
        return [
          ...state.filter((u) => u.username !== username),
          {
            username,
            domains: [
              ...userPref.domains.filter((d) => d.domain !== domain),
              {
                domain,
                whitelisted_requests: [
                  ...domainPref.whitelisted_requests,
                  request,
                ],
              },
            ],
          },
        ];
    } else {
      return [
        ...state.filter((u) => u.username !== username),
        {
          username,
          domains: [
            ...userPref.domains,
            {domain, whitelisted_requests: [request]},
          ],
        },
      ];
    }
  }
  return state;
};

export const removePreferenceFromState = (
  state: UserPreference[],
  username: string,
  domain: string,
  request: string,
) => {
  let copyState = [...state];
  const user = copyState.find((u) => u.username === username);
  if (!user) return state;
  const dom = user.domains.find((d) => d.domain === domain);
  if (!dom) return state;
  dom.whitelisted_requests = dom.whitelisted_requests.filter(
    (r) => r !== request,
  );
  if (!dom.whitelisted_requests.length) {
    user.domains = user.domains.filter((d) => d.domain !== domain);
    if (!user.domains.length) {
      copyState = copyState.filter((u) => u.username !== username);
    }
  }
  return copyState;
};

export const hasPreference = (
  preferences: UserPreference[],
  username: string,
  domain: string,
  type: string,
) => {
  try {
    return preferences
      .find((p) => p.username === username)
      .domains.find((d) => d.domain === domain)
      .whitelisted_requests.includes(type);
  } catch (e) {
    return false;
  }
};
