<template>
  <n-modal v-model:show="show" class="!max-w-[400px]" preset="card" title="Buy Panel">
    <template #header>
      <div>Buy Virtual Panel</div>
    </template>
    <div>
      <h4>Capacity</h4>
      <div class="my-4">
        <n-input-number v-model:value="selectedCapacity" clearable />

        <div class="button-group">
          <n-button class="!px-6" size="small" @click="setValue(10)">10</n-button>
          <n-button class="!px-6" size="small" @click="setValue(20)">20</n-button>
          <n-button class="!px-6" size="small" @click="setValue(30)">30</n-button>
          <n-button class="!px-6" size="small" @click="setValue(50)">50</n-button>
          <n-button class="!px-6" size="small" @click="setValue(100)">100</n-button>
        </div>
      </div>

      <h4 class="mt-4">Currency</h4>
      <div class="currency-list">
        <div
          v-for="currency in currencies"
          :key="currency.name"
          :class="['currency-item', { selected: selectedCurrency === currency.name }]"
          @click="selectCurrency(currency.name)"
        >
          <div class="currency-info">
            <span class="currency-name">{{ currency.name }}</span>
            <n-icon v-if="selectedCurrency === currency.name">
              <Icon name="carbon:checkmark" size="large" />
            </n-icon>
          </div>
        </div>
      </div>
      <div class="flex mt-5">
        <div>Total price :</div>
        <div class="font-bold pl-5">{{ formatAmount(totalPrice) }} {{ selectedCurrency }}</div>
      </div>
    </div>
    <template #action>
      <div v-if="isConnected == false" class="w-full">
        <button class="select-button" @click="connectWallet">Connect Wallet</button>
      </div>
      <div v-else-if="isSupportedChain == false" class="w-full">
        <button class="select-button" @click="switchNetwork">Switch to Polygon</button>
      </div>
      <div class="w-full" v-else-if="isApproveNeeded">
        <button class="select-button" @click="onApproveClick">
          Approve {{ selectedCurrency }}
        </button>
      </div>
      <div class="w-full" v-else>
        <button class="select-button" @click="onBuyClick">Buy Panel</button>
      </div>
    </template>
  </n-modal>
</template>

<script setup>
import { NModal, NRadio, NFlex, NInputNumber, NButton, NIcon } from 'naive-ui';
import Icon from '@/components/common/Icon.vue';
import { isConnected, isSupportedChain, walletModal } from '../wagmi-config';
import {
  selectedCapacity,
  selectedCurrency,
  totalPrice,
  isApproveNeeded,
  approve,
  buy,
} from '@/services/buy-panel-service';
import { formatAmount } from '@/utils/formatters';

const props = defineProps({
  product: Object,
});
const show = defineModel();

const currencies = [
  { name: 'USDT', amount: 5 },
  { name: 'USDC', amount: 5 },
  { name: 'CPIN', amount: 50 },
];

const selectCurrency = (currencyName) => {
  selectedCurrency.value = currencyName;
};

const setValue = (value) => {
  selectedCapacity.value = value;
};

async function onBuyClick() {
  // console.log('onBuyClick');
  const result = await buy();
  if (result) {
    show.value = false;
  }
}

function onApproveClick() {
  // console.log('onApproveClick');
  approve();
}

function connectWallet() {
  walletModal.open();
}
function switchNetwork() {
  walletModal.open({
    view: 'Networks',
  });
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

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

/* Currency list styles */
.currency-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.currency-item {
  border: 1px solid #888888;
  border-radius: 10px;
  padding: 10px 20px 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: #aaaaaa;
}

.currency-item.selected {
  background-color: rgba(99, 226, 183, 0.16);
  border-color: #268178;
  border-radius: 10px;
  color: #63e2b7;
}

.currency-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.currency-name {
  font-size: 16px;
}
</style>
