export interface CreateDataAccountOnBoarding {
  name: string;
  publicKeys: {
    owner: string;
    active: string;
    posting: string;
    memo: string;
  };
}
