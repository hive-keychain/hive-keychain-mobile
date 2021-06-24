export interface DomainPreference {
  domain: string;
  whitelisted_requests: string[];
}

export interface UserPreference {
  username: string;
  domains: DomainPreference[];
}

export interface PreferencePayload {
  username: string;
  domain: string;
  request: string;
}
