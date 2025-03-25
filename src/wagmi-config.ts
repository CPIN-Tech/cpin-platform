import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';
import { ref, type Ref } from 'vue';
import { defineChain, type Chain } from 'viem';
import { getAccount } from '@wagmi/core';

const projectId = '282a820d00f00807442d69396bd86ae9';

export const peaq = /*#__PURE__*/ defineChain({
  id: 3338,
  name: 'Peaq',
  nativeCurrency: {
    decimals: 18,
    name: 'peaq',
    symbol: 'PEAQ',
  },
  rpcUrls: {
    default: {
      http: [
        'https://evm.peaq.network',
        'https://peaq.api.onfinality.io/public',
        'https://peaq-rpc.dwellir.com',
        'https://peaq-rpc.publicnode.com',
      ],
      webSocket: [
        'wss://peaq.api.onfinality.io/public',
        'wss://peaq-rpc.publicnode.com',
        'wss://peaq-rpc.dwellir.com',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Subscan',
      url: 'https://peaq.subscan.io',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 3566354,
    },
  },
})

const metadata = {
  name: 'CPIN App',
  description: '',
  url: 'https://app.cpin.tech',
  icons: ['https://www.cpin.tech/images/homepage-6/homepage_logo.png'],
};
export const supportedChains: Chain[] = [peaq] as const;
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
  chainImages: {
    3338: 'https://s2.coinmarketcap.com/static/img/coins/64x64/14588.png',
  },
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
