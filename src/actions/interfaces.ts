export interface actionPayload<T> {
  type: string;
  payload: T;
}

export interface lastAccount {
  has: boolean;
  name?: string;
}

export type nullableString = string | null;

export interface auth {
  mk: nullableString;
}

export interface settings {
  rpc: string;
}
