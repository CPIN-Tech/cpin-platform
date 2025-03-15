<template>
  <slot />
</template>

<script setup>
import { useMessage, useNotification, useDialog } from 'naive-ui';
import { useGlobalActions } from '@/composables/useGlobalActions';

const message = useMessage();
const dialog = useDialog();
const notification = useNotification();

useGlobalActions().init({ message, notification, dialog });
</script>
