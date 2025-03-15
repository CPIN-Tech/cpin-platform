<template>
  <div class="box-grid">
    <div
      v-for="n in green"
      :key="n"
      class="box green-box"
      :style="{ width: `${boxWidth}px`, height: `${boxHeight}px` }"
    ></div>
    <div
      v-for="n in blue"
      :key="n"
      class="box blue-box"
      :style="{ width: `${boxWidth}px`, height: `${boxHeight}px` }"
    ></div>
    <div
      v-for="n in grey"
      :key="n"
      class="box gray-box"
      :style="{ width: `${boxWidth}px`, height: `${boxHeight}px` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { isMobile } from '@/utils';

const props = defineProps({
  greenCount: {
    type: Number,
    required: true,
  },
  blueCount: {
    type: Number,
    required: true,
  },
  greyCount: {
    type: Number,
    required: true,
  },
});

const divider = computed(() => {
  const total = (props.greenCount || 0) + (props.blueCount || 0) + (props.greyCount || 0);
  // console.log('props', props)
  if (total <= 300) {
    return 1;
  }
  if (isMobile()) {
    return total / 300;
  } else {
    return total / 600;
  }
});

const green = computed(() => Math.ceil((props.greenCount || 0) / divider.value));
const blue = computed(() => Math.ceil((props.blueCount || 0) / divider.value));
const grey = computed(() => Math.ceil((props.greyCount || 0) / divider.value));

const boxWidth = 12;
const boxHeight = 12;
</script>

<style lang="scss">
// .box-grid {
//   display: grid;
//   grid-template-columns: repeat(80, 1fr);
//   gap: 2px;
//   width: auto;
//   height: auto;
// }

.box-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  width: 100%;
}

.box {
  width: 12px;
  height: 12px;
  border-radius: 2px;
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
