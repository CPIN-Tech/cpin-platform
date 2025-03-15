<template>
  <Provider>
    <component :is="layoutComponent" :class="[`theme-${themeName}`, `layout-${layout}`, themeName]">
      <RouterView v-slot="{ Component }">
        <transition :name="`router-${routerTransition}`" mode="out-in" appear>
          <component
            :is="Component"
            :key="forceRefresh"
            :class="[`theme-${themeName}`, `layout-${layout}`, themeName]"
          />
        </transition>
      </RouterView>
    </component>

    <SplashScreen :loading="loading" />
    <SearchDialog v-if="isLogged" />

    <div class="loading-box-overlay" v-if="loadingContexes.length > 0">
      <div class="loading-box">
        <div class="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div class="loading-box-title" v-if="loadingContexes[0].title">
          {{ loadingContexes[0].title }}
        </div>
        <div
          class="loading-box-description"
          v-if="loadingContexes[0].description"
        >
          {{ loadingContexes[0].description }}
        </div>
      </div>
    </div>
  </Provider>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, ref, type Component } from 'vue';
import { useMainStore } from '@/stores/main';
import { useAuthStore } from '@/stores/auth';
import { useThemeStore } from '@/stores/theme';
import VerticalNav from '@/app-layouts/VerticalNav/index.vue';
import HorizontalNav from '@/app-layouts/HorizontalNav/index.vue';
import Blank from '@/app-layouts/Blank/index.vue';
import Provider from '@/app-layouts/common/Provider.vue';
import SplashScreen from '@/app-layouts/common/SplashScreen.vue';
import SearchDialog from '@/components/common/SearchDialog.vue';
import { Layout, RouterTransition, type ThemeName } from '@/types/theme.d';
import { type RouteLocationNormalized, useRouter, useRoute } from 'vue-router';
import '@/assets/scss/index.scss';
import { config } from './wagmi-config';
import { reconnect } from '@wagmi/core';
import { loadingContexes } from "@/services/loading-dialog-service";

reconnect(config);

const router = useRouter();
const loading = ref(true);

const layoutComponents = {
  VerticalNav,
  HorizontalNav,
  Blank,
};

const themeStore = useThemeStore();
const mainStore = useMainStore();
const authStore = useAuthStore();

const forceLayout = ref<Layout | null>(null);
const forceRefresh = computed<number>(() => mainStore.forceRefresh);
const layout = computed<Layout>(() => themeStore.layout);
const layoutComponent = computed<Component>(
  () => layoutComponents[forceLayout.value || layout.value],
);
const routerTransition = computed<RouterTransition>(() => themeStore.routerTransition);
const themeName = computed<ThemeName>(() => themeStore.themeName);
const isLogged = computed(() => authStore.isLogged);

function checkForcedLayout(route: RouteLocationNormalized) {
  if (route.meta?.forceLayout) {
    forceLayout.value = route.meta.forceLayout;
  } else {
    forceLayout.value = null;
  }
}

router.beforeEach((route) => {
  checkForcedLayout(route);
});

onBeforeMount(() => {
  checkForcedLayout(useRoute());

  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>

<style scoped>
/* loading icon css start */
.loading-box-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loading-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #222222;
  border-radius: 8px;
  padding: 40px;
  max-width: 520px;
}

.loading-box-title {
  color: #dddddd;
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  margin-top: 32px;
  text-align: center;
  min-width: 150px;
}

.loading-box-description {
  color: #cccccc;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  margin-top: 12px;
  text-align: center;
  min-width: 200px;
}

.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #00E19B;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #00E19B transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
/* loading icon css end */
</style>
