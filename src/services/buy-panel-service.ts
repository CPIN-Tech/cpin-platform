import { computed, ref, watchEffect } from 'vue';
import { maxUint256 } from 'viem';
import { createLoadingContext, loadingContexes } from './loading-dialog-service';
import { readContract, writeContract } from '@wagmi/core';
import { config, currentAccount } from '../wagmi-config';
import buyPanelAbi from '@/abis/cpin-buy-panel.json';
import erc20Abi from '@/abis/erc20.json';
import pMemoize from '@/utils/promiseMemoize';
import ExpiryMap from 'expiry-map';
import {
  cpinBuyPanelAddress,
  cpinTokenAddress,
  usdcTokenAddress,
  usdtTokenAddress,
  peaqTokenAddress,
} from './contract-addresses';
import { handleTransaction, handleTxExcepton } from '@/utils/transaction-helpers';
import * as DialogService from '@/services/dialogService';

type CurrencyType = 'USDT' | 'USDC' | 'CPIN' | 'PEAQ';

const price = ref(0n);
export const selectedCapacity = ref(1);
export const selectedCurrency = ref<CurrencyType>('PEAQ');
export const isApproveNeeded = ref(false);

const currencyAddress = computed(() => {
  switch (selectedCurrency.value) {
    case 'CPIN':
      return cpinTokenAddress.value;
    case 'PEAQ':
      return peaqTokenAddress.value;
    case 'USDT':
      return usdtTokenAddress.value;
    case 'USDC':
      return usdcTokenAddress.value;
  }
  return null;
});
export const totalPrice = computed<bigint>(() => {
  return BigInt(selectedCapacity.value) * price.value;
});

/////// Price Fetch //////////
function _fetchPrice(currAddr: `0x${string}`, buyPanelAddr: `0x${string}`) {
  return readContract(config, {
    address: buyPanelAddr,
    abi: buyPanelAbi,
    functionName: 'prices',
    args: [currAddr],
  }) as Promise<bigint>;
}
const fetchPrice = pMemoize(_fetchPrice);

watchEffect(async (onCleanup) => {
  let active = true;
  onCleanup(() => (active = false));

  if (currencyAddress.value && cpinBuyPanelAddress.value) {
    let result = await fetchPrice(currencyAddress.value, cpinBuyPanelAddress.value);
    if (currencyAddress.value == peaqTokenAddress.value) {
      result = result * 100n;
    }
    if (currencyAddress.value == usdtTokenAddress.value || currencyAddress.value == usdcTokenAddress.value) {
      result = result * 10n**12n;
    }
    if (active) {
      price.value = result;
    }
  }
});
// -----------------------------

//////// Approwe Check /////////
function _fetchAllowance(tokenAddr: `0x${string}`, owner: `0x${string}`, spender: `0x${string}`) {
  return readContract(config, {
    address: tokenAddr,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [owner, spender],
  }) as Promise<bigint>;
}
const fetchAllowance = pMemoize(_fetchAllowance, {
  cache: new ExpiryMap(5000),
});

watchEffect(async (onCleanup) => {
  let active = true;
  onCleanup(() => (active = false));

  isApproveNeeded.value = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _l = loadingContexes.length;

  if (
    currencyAddress.value &&
    currentAccount.value &&
    cpinBuyPanelAddress.value &&
    totalPrice.value
  ) {
    const result = await fetchAllowance(
      currencyAddress.value,
      currentAccount.value,
      cpinBuyPanelAddress.value,
    );
    if (active) {
      if (result >= totalPrice.value) {
        isApproveNeeded.value = false;
      } else {
        isApproveNeeded.value = true;
      }
    }
  }
});
// -------------------------------------

export async function approve() {
  if (currencyAddress.value == null || cpinBuyPanelAddress.value == null) {
    return false;
  }
  let result = null;
  const loadingContext = createLoadingContext(
    'Waiting for confirmation...',
    `Please confirm that you give permission to Cpin for using ${selectedCurrency.value} token.`,
  );
  try {
    result = await handleTransaction(
      writeContract(config, {
        address: currencyAddress.value,
        abi: erc20Abi,
        functionName: 'approve',
        args: [cpinBuyPanelAddress.value, maxUint256],
      }),
      loadingContext,
    );
  } catch (e) {
    if ((await handleTxExcepton(e)) === false) {
      DialogService.error('Approve failed. Please try again later.');
    }
    result = null;
  } finally {
    loadingContext.destroy();
  }
  return result;
}

export async function buy() {
  if (
    currencyAddress.value == null ||
    cpinBuyPanelAddress.value == null ||
    selectedCapacity.value < 1
  ) {
    return false;
  }
  let result = null;
  const loadingContext = createLoadingContext(
    'Waiting for confirmation...',
    `Please confirm buying virtual panel.`,
  );
  // console.log([currencyAddress.value, selectedCapacity.value]);
  try {
    result = await handleTransaction(
      writeContract(config, {
        address: cpinBuyPanelAddress.value,
        abi: buyPanelAbi,
        functionName: 'buyPanel',
        args: [currencyAddress.value, selectedCapacity.value],
      }),
      loadingContext,
    );
  } catch (e) {
    if ((await handleTxExcepton(e)) === false) {
      DialogService.error('Buy operation failed. Please try again later.');
    }
  } finally {
    loadingContext.destroy();
  }
  return result;
}
