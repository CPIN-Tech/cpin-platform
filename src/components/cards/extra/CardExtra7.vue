<template>
  <n-card
    ref="card"
    contentStyle="
    display: flex;
    flex-direction: column;
    justify-content: center;
"
  >
    <n-spin :show="loading">
      <div style="height: 250px; width: calc(100% - 4px); margin: 0 auto; overflow: hidden">
        <vuevectormap
          v-if="!loading"
          ref="map"
          map="world"
          width="100%"
          height="100%"
          :options="options"
          @loaded="loaded"
          @regionTooltipShow="regionTooltipShow"
        ></vuevectormap>
      </div>
    </n-spin>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NSpin } from 'naive-ui';

import { computed, ref, watchEffect, watch } from 'vue';
import { useResizeObserver, useWindowSize } from '@vueuse/core';
import { useThemeStore } from '@/stores/theme';

const themeStore = useThemeStore();

const style = computed<{ [key: string]: any }>(() => themeStore.style);

function getOption() {
  return {
    map: 'world_merc',
    showTooltip: false,
    bindTouchEvents: false,
    zoomButtons: false,
    zoomOnScroll: false,
    regionStyle: { initial: { fill: style.value['--bg-body'] } },
    markers: [
      // { name: 'Japan', coords: [36.48491549755618, 138.57517718545] },
      { name: 'Canada', coords: [56.1304, -106.3468] },
      {
        name: 'Brazil',
        coords: [-14.235, -51.9253],
        style: { fill: style.value['--secondary3-color'] },
      },
      // {
      //   name: 'Norway',
      //   coords: [60.472024, 8.468946],
      //   style: { fill: style.value['--secondary3-color'] },
      // },
      {
        name: 'Serbia',
        coords: [44.0165, 21.0059],
        style: { fill: style.value['--secondary2-color'] },
      },
      {
        name: 'Kenya',
        coords: [-1.2921, 36.8219],
      },
      {
        name: 'China',
        coords: [35.8617, 104.1954],
        style: { fill: style.value['--secondary3-color'] },
      },
    ],
    lines: [
      { from: 'Brazil', to: 'Canada' },
      { from: 'Canada', to: 'Kenya' },
      { from: 'China', to: 'Brazil' },
      { from: 'Serbia', to: 'Brazil' },

      { from: 'Serbia', to: 'Kenya' },
      { from: 'Kenya', to: 'China' },
    ],
    markerStyle: {
      initial: { fill: style.value['--primary-color'] },
      selected: { fill: style.value['--secondary1-color'] },
    },
    markerLabelStyle: {
      initial: {
        fontFamily: style.value['--font-family'],
        fontSize: 13,
        fill: style.value['--fg-color'],
      },
    },
    lineStyle: {
      strokeDasharray: '6 3 6',
      animation: true,
    },
    labels: {
      markers: {
        render(marker: any) {
          return marker.name;
        },
      },
    },
  };
}

const options = ref(getOption());
const loading = ref(true);
const card = ref(null);
const loadingTimer = ref<NodeJS.Timeout | null>(null);
const { width } = useWindowSize();

function loaded(map: any) {
  useResizeObserver(card, () => {
    map.updateSize();
  });
}
function refresh() {
  loading.value = true;
  if (loadingTimer.value) {
    clearTimeout(loadingTimer.value);
  }
  loadingTimer.value = setTimeout(() => {
    loading.value = false;
  }, 1500);
  options.value = getOption();
}
function regionTooltipShow(_: any, tooltip: any) {
  tooltip.css({ backgroundColor: style.value['--primary-color'] });
}

watch(width, () => {
  refresh();
});

watchEffect(() => {
  refresh();
});
</script>
