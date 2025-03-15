import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';
import { ref, type Ref } from 'vue';
import { polygon, polygonAmoy, type Chain } from 'viem/chains';
import { getAccount } from '@wagmi/core';

const projectId = '282a820d00f00807442d69396bd86ae9';

const metadata = {
  name: 'CPIN App',
  description: '',
  url: 'https://app.cpin.tech',
  icons: ['https://www.cpin.tech/images/homepage-6/homepage_logo.png'],
};
export const supportedChains: Chain[] = [polygonAmoy] as const;
export const config = defaultWagmiConfig({
  chains: supportedChains as [Chain, ...Chain[]],
  projectId,
  metadata,
});

export const walletModal = createWeb3Modal({
  wagmiConfig: config,
  projectId: projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: false,
  themeMode: 'dark',
});

export const currentAccount: Ref<`0x${string}` | null> = ref(null);
export const currentChainId: Ref<number | null> = ref(null);
export const isConnected: Ref<boolean> = ref(false);
export const isSupportedChain: Ref<boolean> = ref(false);

walletModal.subscribeState((newState) => {
  // console.log('subscribeState');
  // console.log(newState);
  refreshData();
});

walletModal.subscribeEvents((e) => {
  // console.log('subscribeEvents');
  // console.log(e);
  refreshData();
});

walletModal.subscribeWalletInfo((info) => {
  // console.log('subscribeWalletInfo');
  // console.log(info);
  refreshData();
});

function refreshData() {
  const account = getAccount(config);
  // console.log('refreshData', account);
  if (account && account.chainId) {
    currentChainId.value = account.chainId;
    isConnected.value = true;
    if (supportedChains.find((c) => c.id == account.chainId)) {
      isSupportedChain.value = true;
    } else {
      isSupportedChain.value = false;
    }
  } else {
    currentChainId.value = null;
    isConnected.value = false;
    isSupportedChain.value = false;
  }
  if (account && account.address) {
    currentAccount.value = account.address;
  } else {
    currentAccount.value = null;
  }
}
