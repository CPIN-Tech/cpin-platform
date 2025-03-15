<template>
  <div v-if="show" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <header>
        <n-input-number v-model:value="inputValue" clearable />

        <div class="button-group">
          <n-button class="!px-6" size="small" @click="setValue(5)">5</n-button>
          <n-button class="!px-6" size="small" @click="setValue(10)">10</n-button>
          <n-button class="!px-6" size="small" @click="setValue(20)">20</n-button>
          <n-button class="!px-6" size="small" @click="setValue(30)">30</n-button>
          <n-button class="!px-6" size="small" @click="setValue(50)">50</n-button>
        </div>
      </header>

      <section>
        <h3 class="pt-2">Currency</h3>
        <div class="currency-list">
          <div
            v-for="currency in currencies"
            :key="currency.name"
            :class="['currency-item', { selected: selectedCurrency === currency.name }]"
            @click="selectCurrency(currency.name)"
          >
            <div class="currency-info">
              <span class="currency-name">{{ currency.amount }} {{ currency.name }}</span>
              <n-icon v-if="selectedCurrency === currency.name">
                <Icon :name="CheckIcon" size="large" />
              </n-icon>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <button @click="closeModal">Kapat</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';
import { NInputNumber, NButton, NIcon } from 'naive-ui';
import Icon from '@/components/common/Icon.vue';

const CheckIcon = 'carbon:checkmark';

const props = defineProps({
  show: Boolean,
});

const inputValue = ref(0);
const selectedCurrency = ref(null);

const currencies = [
  { name: 'USDT', amount: 5 },
  { name: 'USDC', amount: 5 },
  { name: 'CPIN', amount: 5 },
];

const emit = defineEmits(['close']);

const closeModal = () => {
  selectedCurrency.value = null;
  emit('close');
};

const setValue = (value) => {
  inputValue.value = value;
};

const selectCurrency = (currencyName) => {
  selectedCurrency.value = currencyName;
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #26282d;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.currency-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.currency-item {
  border: 1px solid white;
  border-radius: 10px;
  padding: 10px 20px 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
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
