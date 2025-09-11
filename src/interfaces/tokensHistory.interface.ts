export type TokenFilterTransactionTypes = {
  [key: string]: boolean;
};

export type TokenHistoryFilter = {
  filterValue: string;
  inSelected: boolean;
  outSelected: boolean;
  selectedTransactionTypes: TokenFilterTransactionTypes;
};
