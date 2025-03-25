<template>
  <div class="max-w-md mx-auto bg-[#2C2C3C] p-6 rounded-3xl shadow-lg">
    <!-- Header -->
    <h2 class="text-white text-lg font-semibold mb-4">{{ title }}</h2>

    <!-- Conversion Section -->
    <div class="space-y-4">
      <!-- Dropdown for selecting token -->
      <div class="relative bg-[#14161A] p-3 rounded-3xl">
        <div class="flex items-center justify-between mb-4">
          <div
            class="flex items-center bg-[#6C7284] bg-opacity-40 rounded-lg cursor-pointer"
            @click="toggleDropdown"
          >
            <img
              :src="currentIcon"
              alt="Old Token Icon"
              class="w-6 h-6 mr-2 rounded-full bg-white"
            />
            <span class="text-white">
              {{ currentToken }}
            </span>
            <Icon :name="arrowDown" :size="24" class="text-white mb-1"></Icon>
          </div>

          <div class="text-white text-sm">Balance: {{ formattedBalance }}</div>
        </div>
        <input
          type="number"
          v-model="oldTokenAmount"
          placeholder="0.0"
          class="bg-transparent text-white text-left outline-none w-full"
        />
        <!-- Dropdown Menu -->
        <div
          v-if="dropdownOpen"
          class="absolute z-10 left-0 right-0 mt-2 bg-[#6C7284] rounded-lg shadow-lg"
        >
          <div
            class="flex items-center p-2 cursor-pointer hover:bg-[#3c3c4e]"
            v-for="token in availableTokens"
            :key="token.name"
            @click="selectToken(token)"
          >
            <img :src="token.icon" alt="" class="w-6 h-6 mr-2 rounded-full bg-white p-[2px]" />
            <span class="text-white">{{ token.name }}</span>
          </div>
        </div>
      </div>

      <div class="text-center text-white">
        <Icon :name="arrowDownConvert" :size="24" class="text-white"></Icon>
      </div>

      <div class="bg-[#14161A] p-3 rounded-3xl">
        <div class="flex items-center mb-4">
          <img :src="newTokenIcon" alt="New Token Icon" class="w-6 h-6 mr-2 rounded-full" />
          <span class="text-white">{{ newTokenName }}</span>
        </div>
        <input
          type="number"
          v-model="newTokenAmount"
          placeholder="0.0"
          class="bg-transparent text-white text-left outline-none w-full"
        />
      </div>
    </div>

    <div class="pt-10">
      <div v-if="!isConnected" class="w-full">
        <button class="select-button" @click="connectWallet">Connect Wallet</button>
      </div>
      <div v-else-if="!isSupportedChain" class="w-full">
        <button class="select-button" @click="switchNetwork">Switch to Peaq</button>
      </div>
      <div v-else-if="isApproveNeeded" class="w-full">
        <button class="select-button" @click="onApproveClick">Approve {{ currentToken }}</button>
      </div>
      <div v-else>
        <button class="select-button" @click="onConvertClick">Convert</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue';
import Icon from '@/components/common/Icon.vue';

import {
  selectedInputBalance,
  selectedInputCurrency,
  inputAmount,
  outputAmount,
  isApproveNeeded,
  approve,
  convert,
} from '@/services/cpin-convert-service';

import { isConnected, isSupportedChain, walletModal } from '@/wagmi-config';

const arrowDown = 'carbon:chevron-down';
const arrowDownConvert = 'carbon:arrow-down';

const props = defineProps({
  title: {
    type: String,
    default: 'Convert to CPIN',
  },
  oldTokenName: {
    type: String,
    default: 'CDATA',
  },
  newTokenName: {
    type: String,
    default: 'CPIN',
  },
  oldTokenIcon: {
    type: String,
    default: '/images/cpin-logo.png',
  },
  newTokenIcon: {
    type: String,
    default: '/images/cpin-logo.png',
  },
});

const oldTokenAmount = inputAmount;
const newTokenAmount = computed(() => outputAmount.value);

const dropdownOpen = ref(false);
const currentToken = ref(props.oldTokenName);
const currentIcon = ref(props.oldTokenIcon);

const tokens = [
  { name: 'CDATA', icon: '/images/electricity.png' },
  { name: 'CWATT', icon: '/images/electricity.png' },
];

const availableTokens = computed(() => {
  return tokens.filter((token) => token.name !== currentToken.value);
});

const formattedBalance = computed(() => {
  return (Number(selectedInputBalance.value) / 1e18).toFixed(4);
});

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function selectToken(token) {
  currentToken.value = token.name;
  currentIcon.value = token.icon;
  dropdownOpen.value = false;
  selectedInputCurrency.value = token.name;
}

function connectWallet() {
  walletModal.open();
}

function switchNetwork() {
  walletModal.open({
    view: 'Networks',
  });
}

async function onApproveClick() {
  await approve();
}

async function onConvertClick() {
  const result = await convert();
  if (result) {
    inputAmount.value = 0;
    window.location.reload();
  }
}
</script>

<style lang="scss" scoped>
.select-button {
  background-color: #01913a;
  color: #fff;
  border: none;
  padding: 8px;
  width: 100%;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #0056b3;
  }
}

input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield; /* Firefox */
}

::placeholder {
  color: #8d8d9d;
  font-size: 18px;
}
</style>
