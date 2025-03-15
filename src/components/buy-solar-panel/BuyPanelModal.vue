<template>
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal">
      <div class="modal-header">
        <span class="modal-title">Buy Now</span>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <div class="modal-content">
          <p class="modal-amount">9.9 u</p>
          <span>
            <p>Amount</p>
          </span>
          <div class="amount-selector">
            <button class="amount-change" @click="decrement">-</button>
            <input type="number" class="amount-input" v-model="amount" />
            <button class="amount-change" @click="increment">+</button>
          </div>
          <div class="modal-actions">
            <button class="amount-button" @click="setAmount(10)">10</button>
            <button class="amount-button" @click="setAmount(20)">20</button>
            <button class="amount-button" @click="setAmount(30)">30</button>
            <button class="amount-button max" @click="setAmount(product.supply)">MAX</button>
          </div>
          <div class="modal-pricing">
            <PricingOption
              v-for="option in options"
              :key="option.currency"
              :currency="option.currency"
              :imageSource="option.image"
              :amount="option.amount"
              :model-value="selectedCurrency"
              @update:modelValue="updateSelectedCurrency"
            />
          </div>
          <button class="select-button">Select</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { ref } from 'vue';
import PricingOption from '@/components/PricingOption.vue';

const amount = ref(1);

function increment() {
  amount.value++;
}

function decrement() {
  if (amount.value > 1) {
    amount.value--;
  } else {
    amount.value = 1;
  }
}

function setAmount(value) {
  amount.value = value;
}

const props = defineProps({
  showModal: Boolean,
  product: Object,
});

const emit = defineEmits(['update:show']);

function closeModal() {
  emit('update:show', false);
}

const selectedCurrency = ref('usdc');

const options = [
  {
    currency: 'usdc',
    image: '/images/usdc.svg',
    amount: 9.9,
  },
  {
    currency: 'matic',
    image: '/images/matic.svg',
    amount: 9.6532,
  },
  {
    currency: 'usdt',
    image: '/images/usdt.svg',
    amount: 9.9,
  },
];

function updateSelectedCurrency(newCurrency) {
  selectedCurrency.value = newCurrency;
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 320px;

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f6f6f8;

    .modal-title {
      font-weight: bold;
      margin-left: 100px;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
    }
  }

  .modal-body {
    margin-top: 20px;

    .modal-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;

      .modal-amount {
        font-size: 24px;
        font-weight: bold;
      }

      .amount-selector {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 0;

        .amount-change {
          background-color: transparent;
          border: none;
          font-weight: bold;
          font-size: 20px;
          padding: 5px 10px;
          cursor: pointer;
          user-select: none;

          &:focus {
            outline: none;
          }
        }

        .amount-input {
          //pointer-events: none;
          &::-webkit-outer-spin-button,
          &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          width: 50px;
          text-align: center;
          padding: 5px;
          margin: 0 10px;
          border: none;
        }
      }

      .modal-actions {
        display: flex;
        gap: 12px;

        .amount-button {
          background-color: #f6f6f8;
        }
      }

      .modal-pricing {
        width: 100%;
        .pricing-option {
          display: flex;
          align-items: center;
          gap: 10px;

          input {
            order: 2;
            width: 17px;
            height: 17px;
          }

          input#matic {
            margin-left: 120px;
          }

          input#usdt {
            margin-left: 119px;
          }

          input#usdc {
            margin-left: 116px;
          }
        }
      }

      .select-button {
        background-color: #01913a;
        color: #fff;
        border: none;
        padding: 8px 120px;
        border-radius: 15px;
        cursor: pointer;
        transition: background-color 0.3s ease;

        &:hover {
          background-color: #0056b3;
        }
      }
    }
  }
}
</style>
