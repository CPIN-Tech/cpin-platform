import { waitForTransactionReceipt, type WriteContractReturnType } from '@wagmi/core';
import { type LoadingContext } from '@/services/loading-dialog-service';
import { config } from '../wagmi-config';
import { errorToast } from '@/services/dialogService';

export async function handleTransaction(
  txData: Promise<WriteContractReturnType>,
  loadingContext: LoadingContext,
) {
  const tx = await txData;
  // console.log('txxxx', tx)
  loadingContext.setTitle('Transaction Pending...');
  loadingContext.setDescription(
    'Transaction has been submitted. Waiting for blockchain confirmation.',
  );
  return waitForTransactionReceipt(config, { hash: tx, confirmations: 2 });
}

export async function handleTxExcepton(error: any) {
  // console.log('errrr', error);
  // console.log({ error });
  const shortMesg = error.shortMessage.toLowerCase() as string;
  if (shortMesg.includes('user denied') || shortMesg.includes('user rejected')) {
    errorToast('You have rejected the action');
    return true;
  }
  return false;
}
