import {Token} from './tokens.interface';

export enum ConfirmationDataTag {
  AMOUNT = 'amount',
  BALANCE = 'balance',
  USERNAME = 'username',
  OPERATION_TYPE = 'operation_type',
  COLLAPSIBLE = 'COLLAPSIBLE',
  REQUEST_USERNAME = 'REQUEST_USERNAME',
  SWAP = 'SWAP',
}
export type ConfirmationData = {
  title: string;
  value: string;
  tag?: ConfirmationDataTag;
  currency?: string;
  currentBalance?: string;
  amount?: string;
  finalBalance?: string;
  tokenInfo?: Token;
  hidden?: string;
  startToken?: string;
  endToken?: string;
  estimateValue?: number;
  slippage?: number;
};
