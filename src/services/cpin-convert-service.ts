import { computed, ref, watchEffect } from 'vue';
import { maxUint256 } from 'viem';
import { createLoadingContext, loadingContexes } from './loading-dialog-service';
import { readContract, writeContract } from '@wagmi/core';
import { config, currentAccount } from '../wagmi-config';
import cpinConverterAbi from '@/abis/cpin-converter.json';
import erc20Abi from '@/abis/erc20.json';
import pMemoize from '@/utils/promiseMemoize';
import ExpiryMap from 'expiry-map';
import {
  cpinConverterAddress,
  cdataTokenAddress,
  cwattTokenAddress,
} from './contract-addresses';
import { handleTransaction, handleTxExcepton } from '@/utils/transaction-helpers';
import * as DialogService from '@/services/dialogService';
import { parseEther } from 'viem';
import { formatAmount } from '@/utils/formatters';

type CurrencyType = 'CDATA' | 'CWATT';

export const inputAmount = ref<number>(0);
export const selectedInputCurrency = ref<CurrencyType>('CDATA');
export const selectedInputBalance = ref<bigint>(0n);
export const selectedInputExchangeRate = ref<bigint>(0n);
export const isApproveNeeded = ref(false);

export const outputAmount = computed(() => {
  const input = parseEther(inputAmount.value.toString());
  return formatAmount((input * selectedInputExchangeRate.value) / 1_000_000n, 12);
});

const currencyAddress = computed(() => {
  switch (selectedInputCurrency.value) {
    case 'CDATA':
      return cdataTokenAddress.value;
    case 'CWATT':
      return cwattTokenAddress.value;
  }
  return null;
});

/////// exchange rate update //////////
function _fetchExchaingeRates(cpinConverterAddr: `0x${string}`) {
  return Promise.all([
    readContract(config, {
      address: cpinConverterAddr,
      abi: cpinConverterAbi,
      functionName: 'cdataExchangeRate',
      args: [],
    }),
    readContract(config, {
      address: cpinConverterAddr,
      abi: cpinConverterAbi,
      functionName: 'cwattExchangeRate',
      args: [],
    })
  ]) as Promise<[bigint, bigint]>;
}
const fetchExchaingeRates = pMemoize(_fetchExchaingeRates);

watchEffect(async (onCleanup) => {
  let active = true;
  onCleanup(() => (active = false));

  if (selectedInputCurrency.value && cpinConverterAddress.value) {
    const result = await fetchExchaingeRates(cpinConverterAddress.value);
    if (active) {
      selectedInputExchangeRate.value = selectedInputCurrency.value == 'CDATA' ? result[0] : result[1];
    }
  }
});
// -----------------------------

/////// input balance update //////////
function _fetchBalance(currAddr: `0x${string}`, account: `0x${string}`) {
  return readContract(config, {
    address: currAddr,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [account],
  }) as Promise<bigint>;
}
const fetchBalance = pMemoize(_fetchBalance, {
  cache: new ExpiryMap(3000),
});

watchEffect(async (onCleanup) => {
  let active = true;
  onCleanup(() => (active = false));

  if (currencyAddress.value && currentAccount.value) {
    const result = await fetchBalance(currencyAddress.value, currentAccount.value);
    if (active) {
      selectedInputBalance.value = result;
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
    cpinConverterAddress.value &&
    inputAmount.value
  ) {
    const result = await fetchAllowance(
      currencyAddress.value,
      currentAccount.value,
      cpinConverterAddress.value,
    );
    if (active) {
      const input = parseEther(inputAmount.value.toString());
      if (result >= input) {
        isApproveNeeded.value = false;
      } else {
        isApproveNeeded.value = true;
      }
    }
  }
});
// -------------------------------------

export async function approve() {
  if (currencyAddress.value == null || cpinConverterAddress.value == null) {
    return false;
  }
  let result = null;
  const loadingContext = createLoadingContext(
    'Waiting for confirmation...',
    `Please confirm that you give permission to Cpin for using ${selectedInputCurrency.value} token.`,
  );
  try {
    result = await handleTransaction(
      writeContract(config, {
        address: currencyAddress.value,
        abi: erc20Abi,
        functionName: 'approve',
        args: [cpinConverterAddress.value, maxUint256],
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

export async function convert() {
  if (
    selectedInputCurrency.value == null ||
    cpinConverterAddress.value == null ||
    inputAmount.value <= 0
  ) {
    return false;
  }
  let result = null;
  const loadingContext = createLoadingContext(
    'Waiting for confirmation...',
    `Please confirm converting ${selectedInputCurrency.value}`,
  );

  try {
    const input = parseEther(inputAmount.value.toString());
    result = await handleTransaction(
      writeContract(config, {
        address: cpinConverterAddress.value,
        abi: cpinConverterAbi,
        functionName: selectedInputCurrency.value == 'CDATA' ? 'convertCDATA' : 'convertCWATT',
        args: [input],
      }),
      loadingContext,
    );
  } catch (e) {
    if ((await handleTxExcepton(e)) === false) {
      DialogService.error('Conversion failed. Please try again later.');
    }
  } finally {
    loadingContext.destroy();
  }
  return result;
}
