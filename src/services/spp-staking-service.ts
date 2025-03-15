/* eslint-disable no-undef */
import { ref, computed } from 'vue';
import { config, currentAccount } from '@/wagmi-config';
import { handleTransaction, handleTxExcepton } from '@/utils/transaction-helpers';
import { createLoadingContext } from '@/services/loading-dialog-service';
import * as DialogService from '@/services/dialogService';
import sppDatas from '@/data/spp.json';
import cpinSppStakingAbi from '../abis/cpin-spp-staking.json';
import cpinVirtualPanelAbi from '../abis/cpin-virtual-panel.json';
import { cpinVirtualPanelAddress, cpinSppStakingAddress } from './contract-addresses';
import { panelList } from '@/services/panel-data-service';

import { readContract, writeContract, watchAccount } from '@wagmi/core';
import { maxUint256, encodeFunctionData, encodeAbiParameters } from 'viem';

export interface SppInfo {
  id: string;
  name: string;
  desc: string;
  country: string;
  city: string;
  status: string;
  sppCode: string;
  installedPower: string;
  monthlyProduction: string;
  location: string;
  moduleCount: number;
  maxCapacity: number;
  images: string[];
}

const cache: Record<string, any> = {};

export function useSppStakingService(sppId: string) {
  if (cache[`stake_${sppId}`]) {
    // cache[`stake_${tokenSymbol}`].loadData();
    return cache[`stake_${sppId}`];
  }
  const sppIdN = Number(sppId);

  const isLoading = ref(false);
  const error = ref(null);
  const info = ref<SppInfo | null>(null);
  const stakedCapacity = ref<number>(0);
  const apr = ref<number>(0);

  const userStakedCapacity = computed(() => {
    return panelList.value
      .filter((p) => p.status == 'staked' && Number(p.sppId) == sppIdN)
      .reduce((acc, curr) => acc + curr.capacity, 0);
  });
  const userEarnedCDATA = computed(() => {
    return panelList.value
      .filter((p) => p.status == 'staked' && Number(p.sppId) == sppIdN)
      .reduce((acc, curr) => acc + curr.earnedCDATA, 0n);
  });
  const userEarnedCWATT = computed(() => {
    return panelList.value
      .filter((p) => p.status == 'staked' && Number(p.sppId) == sppIdN)
      .reduce((acc, curr) => acc + curr.earnedCWATT, 0n);
  });

  async function loadData() {
    if (!isLoading.value) {
      isLoading.value = true;
      apr.value = sppIdN == 1 ? 27.3 : sppIdN == 2 ? 19.8 : sppIdN == 13 ? 6.6 : 0;
      info.value = sppDatas.find((s) => s.id == sppId) || null;
      stakedCapacity.value = Number(await getSppData(sppIdN));
      isLoading.value = false;
    }
  }

  loadData();
  watchAccount(config, {
    onChange() {
      setTimeout(() => {
        isLoading.value = false;
        loadData();
      }, 10);
    },
  });

  async function getSppData(sppId: number): Promise<bigint> {
    if (cpinSppStakingAddress.value) {
      const result = await readContract(config, {
        address: cpinSppStakingAddress.value,
        abi: cpinSppStakingAbi,
        functionName: 'sppDatas',
        args: [BigInt(sppId)],
      });
      // console.log({result})
      // @ts-ignore
      return result[0];
    }
    return Promise.resolve(0n);
  }

  async function stake(tokenId: bigint) {
    if (
      currentAccount.value == null ||
      cpinVirtualPanelAddress.value == null ||
      cpinSppStakingAddress.value == null
    ) {
      return false;
    }
    let result = null;
    const loadingContext = createLoadingContext(
      'Waiting for confirmation...',
      `Please confirm staking virtual panel.`,
    );
    try {
      const data = encodeAbiParameters([{ name: 'sppId', type: 'uint256' }], [BigInt(sppIdN)]);

      result = await handleTransaction(
        writeContract(config, {
          address: cpinVirtualPanelAddress.value,
          abi: cpinVirtualPanelAbi,
          functionName: 'safeTransferFrom',
          args: [currentAccount.value, cpinSppStakingAddress.value, tokenId, data],
        }),
        loadingContext,
      );
    } catch (e) {
      result = null;
      if ((await handleTxExcepton(e)) === false) {
        DialogService.error('Stake operation failed. Please try again later.');
      }
    } finally {
      loadingContext.destroy();
      loadData();
    }
    return result;
  }

  async function unstake(tokenId: bigint) {
    if (currentAccount.value == null || cpinSppStakingAddress.value == null) {
      return false;
    }
    let result = null;
    const loadingContext = createLoadingContext(
      'Waiting for confirmation...',
      `Please confirm unstaking virtual panel.`,
    );
    try {
      result = await handleTransaction(
        writeContract(config, {
          address: cpinSppStakingAddress.value,
          abi: cpinSppStakingAbi,
          functionName: 'withdrawToken',
          args: [tokenId, currentAccount.value, ''],
        }),
        loadingContext,
      );
    } catch (e) {
      result = null;
      if ((await handleTxExcepton(e)) === false) {
        DialogService.error('Unstake operation failed. Please try again later.');
      }
    } finally {
      loadingContext.destroy();
      loadData();
    }
    return result;
  }

  async function claim() {
    if (currentAccount.value == null || cpinSppStakingAddress.value == null) {
      return false;
    }

    let result = null;
    const loadingContext = createLoadingContext(
      'Waiting for confirmation...',
      `Please confirm claiming rewards.`,
    );
    try {
      const panels = panelList.value.filter(
        (p) => p.status == 'staked' && Number(p.sppId) == sppIdN,
      );

      if (panels.length == 0) {
        throw new Error('No panels');
      }

      const calldatas = panels.map((panel) => {
        return encodeFunctionData({
          abi: cpinSppStakingAbi,
          functionName: 'collectReward',
          args: [panel.id],
        });
      });

      result = await handleTransaction(
        writeContract(config, {
          address: cpinSppStakingAddress.value,
          abi: cpinSppStakingAbi,
          functionName: 'multicall',
          args: [calldatas],
        }),
        loadingContext,
      );
    } catch (e) {
      result = null;
      if ((await handleTxExcepton(e)) === false) {
        DialogService.error('Claim operation failed. Please try again later.');
      }
    } finally {
      loadingContext.destroy();
      loadData();
    }
    return result;
  }

  const service = {
    isLoading,
    error,
    info,
    stakedCapacity,
    userStakedCapacity,
    apr,
    userEarnedCDATA,
    userEarnedCWATT,
    loadData,
    stake,
    unstake,
    claim,
  };
  cache[`stake_${sppId}`] = service;
  return service;
}
