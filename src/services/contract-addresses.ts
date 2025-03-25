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
    peaqToken: `0x${string}`,
    usdtToken: `0x${string}`,
    usdcToken: `0x${string}`,
}} = {
    3338: {
        cpinToken: '0x06E3cB6b9D0B4089eFF7431AB496362591183E83',
        cdataToken: '0xa65Dab5831898d9A63De0e67FCf68a34D19102bC',
        cwattToken: '0x3556aA434Bdcf429D59183d65B6cf036722Ac259',
        cpinVirtualPanel: '0xa85c10190943BBc46dDE84024f9070e54987fa52',
        cpinBuyPanel: '0x0A493a73860DBC93f6CDE70D83799c296b9ad79D',
        cpinSppStaking: '0x5D19b364df25EBF6954296028B851BE38CB1f1a7',
        cpinConverter: '0x22f1F42A0e7f47E3544e573C6B885658abEaF52d',
        peaqToken: '0x0000000000000000000000000000000000000809',
        usdtToken:'0xd8cF92E9B6Fae6B32f795AcB11Edd50E8dD6Ff4d',
        usdcToken: '0xbbA60da06c2c5424f03f7434542280FCAd453d10'
    },
    9990: {
        cpinToken: '0x808Fd888E4476dD4e19B12225367bb0F69370E32',
        cdataToken: '0x0000000000000000000000000000000000000000',
        cwattToken: '0x0000000000000000000000000000000000000000',
        cpinVirtualPanel: '0x0000000000000000000000000000000000000000',
        cpinBuyPanel: '0x0000000000000000000000000000000000000000',
        cpinSppStaking: '0x0000000000000000000000000000000000000000',
        cpinConverter: '0x0000000000000000000000000000000000000000',
        peaqToken: '0x0000000000000000000000000000000000000809',
        usdtToken:'0x0000000000000000000000000000000000000000',
        usdcToken: '0x0000000000000000000000000000000000000000'
    },
}

export const cpinTokenAddress: Ref<`0x${string}` | null> = ref(null);
export const cdataTokenAddress: Ref<`0x${string}` | null> = ref(null);
export const cwattTokenAddress: Ref<`0x${string}` | null> = ref(null);
export const cpinVirtualPanelAddress: Ref<`0x${string}` | null> = ref(null);
export const cpinBuyPanelAddress: Ref<`0x${string}` | null> = ref(null);
export const cpinSppStakingAddress: Ref<`0x${string}` | null> = ref(null);
export const cpinConverterAddress: Ref<`0x${string}` | null> = ref(null);
export const peaqTokenAddress: Ref<`0x${string}` | null> = ref(null);
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
        peaqTokenAddress.value = contractAddresses[chainId].peaqToken;
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
        peaqTokenAddress.value = null;
        usdtTokenAddress.value = null;
        usdcTokenAddress.value =  null;
    }
});