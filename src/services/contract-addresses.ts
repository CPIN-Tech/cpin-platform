import { ref, type Ref, watchEffect } from "vue";
import { currentChainId, isSupportedChain } from "../wagmi-config";

const contractAddresses: {[index: number]: {
    cpinToken: `0x${string}`,
    cdataToken: `0x${string}`,
    cwattToken: `0x${string}`,
    cpinVirtualPanel: `0x${string}`,
    cpinBuyPanel: `0x${string}`,
    cpinSppStaking: `0x${string}`,
    cpinConverter: `0x${string}`,
    usdtToken: `0x${string}`,
    usdcToken: `0x${string}`,
}} = {
    137: {
        cpinToken: '0x808Fd888E4476dD4e19B12225367bb0F69370E32',
        cdataToken: '0x0000000000000000000000000000000000000000',
        cwattToken: '0x0000000000000000000000000000000000000000',
        cpinVirtualPanel: '0x0000000000000000000000000000000000000000',
        cpinBuyPanel: '0x0000000000000000000000000000000000000000',
        cpinSppStaking: '0x0000000000000000000000000000000000000000',
        cpinConverter: '0x0000000000000000000000000000000000000000',
        usdtToken:'0x0000000000000000000000000000000000000000',
        usdcToken: '0x0000000000000000000000000000000000000000'
    },
    80_002: {
        cpinToken: '0x48360bC0f79C31e7e7e52ac45C9D9c4806BcF29c',
        cdataToken: '0x4e16BA1b34F0beF40ea1EfF7d3e6bef88514B3c6',
        cwattToken: '0x4cD13a8c4c9184ed0422C180b988287f1527AdB9',
        cpinVirtualPanel: '0x7c36B59D76Db32c4251066f4A24890Ee7d8E8BeC',
        cpinBuyPanel: '0xD83819a26C3ed3192E0d03af7C8AF3c85f312C40',
        cpinSppStaking: '0xDE2550d0AE8B05924b19b6f18E60935a147f76FC',
        cpinConverter: '0x88a3216b27668b70ECe4e29BaDA7A57939818ab2',
        usdtToken:'0x5D19b364df25EBF6954296028B851BE38CB1f1a7',
        usdcToken: '0x5D19b364df25EBF6954296028B851BE38CB1f1a7'
    },
}

export const cpinTokenAddress: Ref<`0x${string}` | null> = ref(null);
export const cdataTokenAddress: Ref<`0x${string}` | null> = ref(null);
export const cwattTokenAddress: Ref<`0x${string}` | null> = ref(null);
export const cpinVirtualPanelAddress: Ref<`0x${string}` | null> = ref(null);
export const cpinBuyPanelAddress: Ref<`0x${string}` | null> = ref(null);
export const cpinSppStakingAddress: Ref<`0x${string}` | null> = ref(null);
export const cpinConverterAddress: Ref<`0x${string}` | null> = ref(null);
export const usdtTokenAddress: Ref<`0x${string}` | null> = ref(null);
export const usdcTokenAddress: Ref<`0x${string}` | null> = ref(null);

watchEffect(() => {
    const chainId = currentChainId.value;
    if (chainId && isSupportedChain.value) {
        cpinTokenAddress.value = contractAddresses[chainId].cpinToken;
        cdataTokenAddress.value = contractAddresses[chainId].cdataToken;
        cwattTokenAddress.value = contractAddresses[chainId].cwattToken;
        cpinVirtualPanelAddress.value = contractAddresses[chainId].cpinVirtualPanel;
        cpinBuyPanelAddress.value = contractAddresses[chainId].cpinBuyPanel;
        cpinSppStakingAddress.value = contractAddresses[chainId].cpinSppStaking;
        cpinConverterAddress.value = contractAddresses[chainId].cpinConverter;
        usdtTokenAddress.value = contractAddresses[chainId].usdtToken;
        usdcTokenAddress.value = contractAddresses[chainId].usdcToken;
    } else {
        cpinTokenAddress.value = null;
        cdataTokenAddress.value = null;
        cwattTokenAddress.value = null;
        cpinVirtualPanelAddress.value = null;
        cpinBuyPanelAddress.value = null;
        cpinSppStakingAddress.value = null;
        cpinConverterAddress.value = null;
        usdtTokenAddress.value = null;
        usdcTokenAddress.value =  null;
    }
});