export interface BroadcastTestsSuccessResponse {
  id: number;
  jsonrpc: string;
  result: {
    tx_id: string;
    status: string;
  };
}

export interface BroadcastTestsErrorResponse {
  error: object;
}
