<template>
  <div :class="['custom-card', cardWrap ? 'bordered' : '']" :style="contentStyle">
    <div class="card-wrap flex gap-4" :class="{ 'flex-col': vertical }">
      <!-- <div class="icon-box" v-if="$slots.icon">
        <div class="icon">
          <slot name="icon"></slot>
        </div>
      </div> -->
      <div class="info flex flex-col grow">
        <div class="header flex items-center justify-between gap-2">
          <div class="title grow">
            {{ title || randomTitle }}
          </div>
          <Percentage v-if="percentage && percentageProps" v-bind="percentageProps"></Percentage>
        </div>
        <div class="value">{{ valueString }}</div>

        <!-- Conditional Rendering Based on Props -->
        <div class="additional-info flex gap-4" v-if="claimableCWATT || claimableCDATA">
          <div class="info" v-if="claimableCWATT">Claimable:&nbsp;CWATT: {{ claimableCWATT }}</div>
          <div class="info" v-if="claimableCDATA">
            <div class="only-mobile-claimable">Claimable: &nbsp;</div>
            CDATA: {{ claimableCDATA }}
          </div>
        </div>

        <!-- Slot for Buttons -->
        <slot name="buttons"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { faker } from '@faker-js/faker';
import { toRefs, computed, ref } from 'vue';
import Percentage, { type PercentageProps } from '@/components/common/Percentage.vue';

const props = defineProps<{
  title: string;
  val?: number;
  valString?: string;
  currency?: string;
  cardWrap?: boolean;
  vertical?: boolean;
  percentage?: boolean;
  percentageProps?: PercentageProps;
  claimableCWATT?: string;
  claimableCDATA?: string;
}>();
const {
  title,
  val,
  valString,
  currency,
  percentage,
  percentageProps,
  cardWrap,
  vertical,
  claimableCWATT,
  claimableCDATA,
} = toRefs(props);

const randomTitle = ref(faker.commerce.department());

const contentStyle = computed(() =>
  cardWrap.value ? '' : 'padding:0;background-color:transparent',
);

const valueString = computed(() => {
  if (valString?.value) {
    return valString.value;
  }

  const value = val?.value;

  if (!value) return '';

  if (currency?.value) {
    return new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' }).format(value);
  } else {
    return new Intl.NumberFormat('en-EN').format(value);
  }
});
</script>

<style scoped lang="scss">
.custom-card {
  background-color: #26282d;
  padding: 16px;
  border-radius: 8px;
}

.bordered {
  border: 1px solid #444;
}

.card-wrap {
  height: 100%;
  width: 100%;
  overflow: hidden;

  .info {
    overflow: hidden;
    .header {
      overflow: hidden;
      margin-bottom: 6px;
      white-space: nowrap;

      .title {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font-weight: normal !important;
      }
    }
    .value {
      font-family: var(--font-family-display);
      font-size: 26px;
      font-weight: bold;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .additional-info {
      margin-top: 14px;
    }

    @media (max-width: 600px) {
      .additional-info {
        flex-direction: column;
        .info {
          display: flex;
        }
      }
      .value {
        font-size: 22px;
      }
    }
    @media (min-width: 600px) {
      .only-mobile-claimable {
        display: none;
      }
    }
  }
}
</style>
