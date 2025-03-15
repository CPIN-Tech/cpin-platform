<template>
  <div class="pricing-option">
    <div class="info">
      <img :src="imageSource" :alt="currency" />
      <label :for="currency">{{ amount }} {{ currency.toUpperCase() }}</label>
    </div>
    <n-radio :checked="modelValue === currency" :value="currency" @update:checked="handleChange" />
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { NRadio } from 'naive-ui';

const props = defineProps({
  currency: {
    type: String,
    required: true,
  },
  imageSource: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  modelValue: {
    type: [String, Number, Boolean],
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const handleChange = (checked) => {
  if (checked) {
    emit('update:modelValue', props.currency);
  }
};
</script>

<style lang="scss">
.pricing-option {
  display: flex;
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 10px;
  background-color: #fff;

  input[type='radio'] {
    margin-left: 100px;
  }

  .info {
    display: flex;

    align-items: center;
  } 

  img {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }

  label {
    font-size: 16px;
    color: #333;
  }
}
</style>
