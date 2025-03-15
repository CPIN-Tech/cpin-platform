<template>
  <div class="max-w-md mx-auto mb-5 p-4 bg-[#2C2C3C] rounded-3xl">
    <div class="flex justify-center items-center mb-4 pr-8">
      <img
        :src="iconSrc"
        :style="{ width, height }"
        alt="Stake Icon"
        class="mr-2 align-middle rounded-full"
      />
      <h2 class="text-white font-sans text-xl">{{ title }}</h2>
    </div>
    <div class="flex justify-center mb-4 gap-2">
      <n-button
        strong
        secondary
        type="primary"
        class="bg-[#3f51b5] text-white px-4 py-2 rounded-lg"
        @click="onStake"
      >
        Stake
      </n-button>
      <n-button
        strong
        secondary
        type="primary"
        class="bg-[#3f51b5] text-white px-4 py-2 rounded-lg"
        @click="onUnstake"
      >
        Unstake
      </n-button>
    </div>
    <div class="relative w-full max-w-md">
      <input
        type="number"
        v-model="amount"
        placeholder="0.0"
        class="text-white bg-[#14161A] outline-none px-4 py-2 text-lg w-full rounded-lg pr-16"
      />
      <!-- <div class="mt-5 text-center mb-4">
        <h4 class="text-white font-sans text-lg">{{ rewardsText }}</h4>
      </div> -->
      <button
        class="absolute right-2 top-0.5 h-10 bg-[#3B364F] text-white px-4 py-2 rounded-lg"
        @click="onMax"
      >
        MAX
      </button>
    </div>
    <div class="flex justify-center font-bold items-center mb-4 mt-4 h-24 bg-[#6C7284] rounded-3xl">
      CPIN Stake Coming Soon
    </div>
    <w3m-button class="connect-wallet flex justify-center px-4 py-2 w-full mt-5" />
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import { NButton } from 'naive-ui';

const props = defineProps({
  title: {
    type: String,
    default: 'CPIN Stake',
  },
  iconSrc: {
    type: String,
    default: '/images/avatar-64.jpg',
  },
  width: {
    type: String,
    default: '64px',
  },
  height: {
    type: String,
    default: '64px',
  },
  onStake: {
    type: Function,
    default: () => {},
  },
  onUnstake: {
    type: Function,
    default: () => {},
  },
  onMax: {
    type: Function,
    default: () => {},
  },
});

const amount = ref('');
</script>

<style scoped>
/* Arrows in number inputs are hidden by the following CSS */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield; /* Firefox */
}
</style>
