<template>
  <div class="mx-auto bg-[#14161A] p-5 rounded-lg">
    <div class="max-w-5xl mx-auto mb-5 p-4 bg-custom-radial-gradient rounded-lg w-full">
      <h1 class="text-white font-sans text-xl mb-1">Welcome to the Transactions Page</h1>
      <p class="text-white text-sm/[14px] p-1">
        On this page you can stake your CPIN tokens to receive rewards and take part in the
        governance of CPIN. Stake will be introduced soon with governance.
        <br />
        <br />
        You can convert your CDATA and CWATT tokens into CPIN on this page. Be reminded that the
        CPIN ratio of these tokens may vary over time.
      </p>
    </div>

    <!-- Stake and Convert components side by side -->
    <div
      class="flex flex-col md:flex-row justify-center items-sretch md:space-x-4 space-y-4 md:space-y-0"
    >
      <div class="w-full md:w-1/2 max-w-md">
        <TransactionsConvert
          title="Convert to CPIN"
          oldTokenName="CDATA"
          newTokenName="PEAQ"
          oldTokenIcon="/images/open-book.png"
          newTokenIcon="https://s2.coinmarketcap.com/static/img/coins/64x64/14588.png"
          class="h-full"
        />
      </div>
      <div class="w-full md:w-1/2 max-w-md">
        <StakeComponent
          title="CPIN Stake"
          :rewardsText="''"
          :iconSrc="'/images/cpin-logo.png'"
          :width="'72px'"
          :height="'72px'"
          :onStake="handleStake"
          :onUnstake="handleUnstake"
          :onMax="handleMax"
          class="h-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { NButton } from 'naive-ui';
import StakeComponent from '@/components/Transactions/StakeComponent.vue';
import TransactionsConvert from '@/components/Transactions/TransactionsConvert.vue';

const handleStake = () => {
  // console.log('Stake action triggered');
};

const handleUnstake = () => {
  // console.log('Unstake action triggered');
};

const handleMax = () => {
  // console.log('Max button clicked');
};
</script>
