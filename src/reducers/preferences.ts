import {ActionPayload} from 'actions/interfaces';
import {ADD_PREFERENCE, REMOVE_PREFERENCE} from 'actions/types';
import {PreferencePayload, UserPreference} from './preferences.types';

const preferences = (
  state: UserPreference[] = [],
  {type, payload}: ActionPayload<PreferencePayload>,
): UserPreference[] => {
  switch (type) {
    case ADD_PREFERENCE:
      const {username, domain, request} = payload;
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
    case REMOVE_PREFERENCE: {
      const {username, domain, request} = payload;
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
          console.log(copyState);
        }
      }
      return copyState;
    }
    default:
      return state;
  }
};
export default preferences;
