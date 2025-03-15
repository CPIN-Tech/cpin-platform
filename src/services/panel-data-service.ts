import { ref, type Ref, watch, computed } from 'vue';
import { readContract, writeContract } from '@wagmi/core';
import { config, currentAccount, currentChainId } from '../wagmi-config';
import cpiVirtualPanelAbi from '../abis/cpin-virtual-panel.json';
import cpinSppStakingAbi from '../abis/cpin-spp-staking.json';
import makeConcurrencyLimited from '../utils/concurrencyLimiter';
import { cpinVirtualPanelAddress, cpinSppStakingAddress } from './contract-addresses';
import { handleTransaction, handleTxExcepton } from '@/utils/transaction-helpers';
import { createLoadingContext } from '@/services/loading-dialog-service';
import * as DialogService from '@/services/dialogService';
import sppDatas from '@/data/spp.json';
import { encodeFunctionData } from 'viem';

export interface VirtualPanel {
  id: bigint;
  name: string;
  sppName: string;
  sppId: bigint;
  capacity: number;
  expireDate: Date;
  earnedCDATA: bigint;
  earnedCWATT: bigint;
  status: 'staked' | 'unstaked' | 'expired';
  series?: { data: number[] }[];
}

export const isLoading: Ref<boolean> = ref(false);
export const panelList: Ref<VirtualPanel[]> = ref([]);
export const userTotalCapacity = computed(() => {
  return panelList.value.reduce((acc, curr) => acc + curr.capacity, 0);
});
export const userStakedCapacity = computed(() => {
  return panelList.value
    .filter((p) => p.status == 'staked')
    .reduce((acc, curr) => acc + curr.capacity, 0);
});
export const userTotalEarnedCDATA = computed(() => {
  return panelList.value.reduce((acc, curr) => acc + curr.earnedCDATA, 0n);
});
export const userTotalEarnedCWATT = computed(() => {
  return panelList.value.reduce((acc, curr) => acc + curr.earnedCWATT, 0n);
});

async function _refreshData() {
  panelList.value = [];

  if (!currentAccount.value || !cpinVirtualPanelAddress.value || !cpinSppStakingAddress.value) {
    return;
  }

  isLoading.value = true;
  try {
    const [balance, stakedBalance] = await Promise.all([
      callPanelContract('balanceOf', [currentAccount.value]),
      callSppStakingContract('balanceOf', [currentAccount.value]),
    ]);

    // token Ids
    const tokenIdPromises: Promise<{ id: bigint; sppId: bigint; status: 'staked' | 'unstaked' }>[] =
      [];
    for (let i = 0; i < balance; i++) {
      const p = callPanelContract('tokenOfOwnerByIndex', [currentAccount.value, i]).then(
        (tokenId) => ({ id: tokenId, sppId: 0n, status: 'unstaked' as const }),
      );
      tokenIdPromises.push(p);
    }
    for (let i = 0; i < stakedBalance; i++) {
      const p = callSppStakingContract('tokenOfOwnerByIndex', [currentAccount.value, i]).then(
        (tokenId) => ({ id: tokenId, sppId: 0n, status: 'staked' as const }),
      );
      tokenIdPromises.push(p);
    }
    const tokenIds = await Promise.all(tokenIdPromises);
    tokenIds.sort((a, b) => {
      return Number(b.id - a.id);
    });
    // ----------

    // add sppId to tokenId info
    const updateSppIdPromises: Promise<void>[] = [];
    for (const tokenId of tokenIds) {
      if (tokenId.status == 'staked') {
        // console.log('updateSppIdPromises', tokenId.id)
        updateSppIdPromises.push(
          callSppStakingContract('tokenIdToSppId', [tokenId.id]).then((sppId) => {
            // console.log('callSppStakingContract', sppId)
            tokenId.sppId = sppId;
          }),
        );
      }
    }
    await Promise.all(updateSppIdPromises);
    // ---------

    // Fetch Panel Info
    const panelInfoPromises: Promise<VirtualPanel>[] = [];
    for (const tokenId of tokenIds) {
      const p = getPanelInfo(tokenId.id, tokenId.status == 'staked', tokenId.sppId);
      panelInfoPromises.push(p);
    }

    const panelInfos = await Promise.all(panelInfoPromises);

    // console.log('panelInfos', panelInfos)
    panelList.value = panelInfos;
  } catch (error) {
    // console.error(error);
    panelList.value = [];
  } finally {
    isLoading.value = false;
  }
}

export const refreshData = makeConcurrencyLimited(_refreshData, {
  concurrency: 1,
});

function callPanelContract(
  funcName: 'balanceOf' | 'tokenOfOwnerByIndex',
  args?: Array<any>,
): Promise<bigint> {
  if (cpinVirtualPanelAddress.value) {
    return readContract(config, {
      address: cpinVirtualPanelAddress.value,
      abi: cpiVirtualPanelAbi,
      functionName: funcName,
      args: args,
    }) as Promise<bigint>;
  }
  return Promise.resolve(0n);
}

function callSppStakingContract(
  funcName: 'balanceOf' | 'tokenOfOwnerByIndex' | 'tokenIdToSppId',
  args?: Array<any>,
): Promise<bigint> {
  // console.log('callSppStakingContract', funcName, args);
  if (cpinSppStakingAddress.value) {
    return readContract(config, {
      address: cpinSppStakingAddress.value,
      abi: cpinSppStakingAbi,
      functionName: funcName,
      args: args,
    }) as Promise<bigint>;
  }
  return Promise.resolve(0n);
}

function generateRandomSeries(): number[] {
  return Array.from({ length: 10 }, () => 10 * (Math.floor(Math.random() * 5) + 1));
}

async function getPanelInfo(
  tokenId: bigint,
  isStaked: boolean,
  sppId?: bigint,
): Promise<VirtualPanel> {
  const info = (await readContract(config, {
    address: cpinVirtualPanelAddress.value!,
    abi: cpiVirtualPanelAbi,
    functionName: 'panelInfos',
    args: [tokenId],
  })) as [bigint, number];

  const capacity = info[0];
  const expireDate = new Date(info[1] * 1000);
  let name = 'Panel #' + (tokenId + 10000n).toString();
  if (capacity > 1n) {
    name = 'Package #' + (tokenId + 10000n).toString();
  }

  let sppName = '';
  let earned = [0n, 0n];
  if (isStaked) {
    const data = sppDatas.find((s) => s.id == sppId?.toString());
    if (data) {
      sppName = data.name || '';
    }
    earned = (await readContract(config, {
      address: cpinSppStakingAddress.value!,
      abi: cpinSppStakingAbi,
      functionName: 'calculateRewardsEarned',
      args: [tokenId, sppId],
    })) as [bigint, bigint];
  }

  return {
    id: tokenId,
    name: name,
    sppName: sppName,
    sppId: sppId ?? 0n,
    capacity: Number(capacity),
    expireDate: expireDate,
    earnedCDATA: earned[0],
    earnedCWATT: earned[1],
    status: isStaked ? 'staked' : 'unstaked',
    series: [
      {
        data: generateRandomSeries(),
      },
    ],
  };
}

watch([currentAccount, currentChainId], refreshData);

export async function claimAll() {
  if (currentAccount.value == null || cpinSppStakingAddress.value == null) {
    return false;
  }

  let result = null;
  const loadingContext = createLoadingContext(
    'Waiting for confirmation...',
    `Please confirm claiming rewards.`,
  );
  try {
    const panels = panelList.value.filter((p) => p.status == 'staked');
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
    refreshData();
  }
  return result;
}
