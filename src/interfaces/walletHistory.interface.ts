export type FilterTransactionTypes = {
  [key: string]: boolean;
};

export type WalletHistoryFilter = {
  filterValue: string;
  inSelected: boolean;
  outSelected: boolean;
  selectedTransactionTypes: FilterTransactionTypes;
};
