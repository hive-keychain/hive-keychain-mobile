export interface HiveTxTransactionTest {
  expiration: string;
  extensions: any[];
  operations: any[];
  ref_block_num: number;
  ref_block_prefix: number;
}

export interface HiveTxSignedTransactionTest extends HiveTxTransactionTest {
  signatures: string[];
}
