<!-- <template>
  <div class="max-w-3xl mx-auto p-4">
    <div class="flex justify-center mb-6 space-x-4">
      <button
        @click="selectedComponent = 'stake'"
        :class="selectedComponent === 'stake' ? activeButtonClass : buttonClass"
      >
        Stake
      </button>
      <button
        @click="selectedComponent = 'convert'"
        :class="selectedComponent === 'convert' ? activeButtonClass : buttonClass"
      >
        Convert
      </button>
      <button
        @click="selectedComponent = 'both'"
        :class="selectedComponent === 'both' ? activeButtonClass : buttonClass"
      >
        Both of Them
      </button>
    </div>

    <div>
      <div>
        <StakeComponent :iconSrc="'/images/cpin-logo.png'" v-if="selectedComponent === 'stake'" />
      </div>

      <TransactionsConvert v-if="selectedComponent === 'convert'" />
      <div
        v-if="selectedComponent === 'both'"
        class="flex space-x-4 flex-col md:flex-row justify-between space-y-4 md:space-y-0"
      >
        <StakeComponent :iconSrc="'/images/cpin-logo.png'" class="w-full md:w-1/2" />
        <div class="border-4 border-indigo-200"></div>
        <TransactionsConvert class="w-full md:w-1/2" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import StakeComponent from '@/components/Transactions/StakeComponent.vue';
import TransactionsConvert from '@/components/Transactions/TransactionsConvert.vue';

const selectedComponent = ref('stake');

const buttonClass = 'bg-gray-800 text-white px-4 py-2 rounded-lg';
const activeButtonClass = 'bg-[#3f51b5] text-white px-4 py-2 rounded-lg';
</script>

<style scoped></style> -->

<!-- <template>
  <div class="box-grid">
    <div v-for="box in boxes" :key="box.id" :class="box.color" class="box"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const greenCount = 200;
const blueCount = 150;
const totalBoxes = 600; // Toplam kutu sayısı

const boxes = ref(
  Array.from({ length: totalBoxes }, (_, i) => {
    if (i < greenCount) {
      return { id: i + 1, color: 'green-box' };
    } else if (i < greenCount + blueCount) {
      return { id: i + 1, color: 'blue-box' };
    } else {
      return { id: i + 1, color: 'gray-box' };
    }
  }),
);
</script> -->

<template>
  <div class="flex justify-center items-center">
    <n-button @click="isModalOpen = true">Open</n-button>

    <TrialModal :show="isModalOpen" @close="isModalOpen = false" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TrialModal from '@/components/TrialModal.vue';
import { NButton } from 'naive-ui';

const isModalOpen = ref(false);
</script>

<!-- ------------------------------------------------------------------------------------------------ -->

<style lang="scss">
.box-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  width: 100%;
}

.box {
  width: 12px;
  height: 12px;
  border-radius: 4px;
}

.green-box {
  background-color: #2ecc71;
}

.blue-box {
  background-color: #3498db;
}

.gray-box {
  background-color: #6c7284;
}
</style>
