<template>
  <div class="header-bar flex items-center gap-3">
    <Logo :mini="false" :dark="isDark" class="anim-wrap" />
    <n-scrollbar class="grow" x-scrollable>
      <Navbar :collapsed="false" mode="horizontal"></Navbar>
    </n-scrollbar>
    <div class="wallet-section">
      <w3m-network-button class="only-desktop" />
      <RouterLink to="/settings" class="only-desktop">
        <Icon :name="SettingsIcon" :size="24" class="settings-icon"></Icon>
      </RouterLink>
      <w3m-button />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { NScrollbar } from 'naive-ui';
import Navbar from '@/app-layouts/common/Navbar/index.vue';
import Logo from '@/app-layouts/common/Logo.vue';
import { useThemeStore } from '@/stores/theme';
// router link
import { RouterLink } from 'vue-router';
import Icon from '@/components/common/Icon.vue';

defineOptions({
  name: 'HeaderBar',
});

const SettingsIcon = 'carbon:settings';

const themeStore = useThemeStore();

const isDark = computed<boolean>(() => themeStore.isThemeDark);
</script>

<style lang="scss" scoped>
@import './variables';

.header-bar {
  padding-left: var(--view-padding);
  min-height: var(--header-bar-height);
  height: var(--header-bar-height);
  max-height: var(--header-bar-height);
  background-color: var(--bg-sidebar);

  :deep() {
    .n-scrollbar-rail {
      opacity: 0.15;
    }
    .n-scrollbar-container {
      margin-left: 50px !important;
    }
  }

  .nav {
    padding-top: 10px;
    margin-right: var(--view-padding);
    padding-left: var(--view-padding);
  }

  @media (max-width: $sidebar-bp) {
    display: none;
  }
}

.wallet-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-right: var(--view-padding);
}
</style>
