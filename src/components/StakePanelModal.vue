<template>
  <n-modal v-model:show="show" class="!max-w-[600px]" preset="card" title="Solar Panels">
    <n-space class="mb-5" vertical v-if="isLoading">
      <n-skeleton height="40px" width="100%" />
      <n-skeleton height="40px" width="100%" />
      <n-skeleton height="40px" width="100%" />
      <n-skeleton height="40px" width="100%" />
    </n-space>
    <n-alert v-else-if="panelList.length == 0" title="No Panels" type="default">
      <template #icon>
        <n-icon>
          <Icon name="carbon:information" />
        </n-icon>
      </template>
      You don't have any solar panels, please buy one.
    </n-alert>
    <table v-else class="table-auto w-full border-collapse">
      <thead>
        <tr>
          <th class="text-left p-2 border-b">Panel</th>
          <th class="text-left p-2 border-b">Capacity</th>
          <th class="text-left p-2 border-b">Status</th>
          <th class="text-left p-2 border-b"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(panel, index) in panels.slice(0, 20)" :key="index" class="border-b">
          <td class="text-left p-2">{{ panel.name }}</td>
          <td class="text-left p-2">{{ panel.capacity }}</td>
          <td class="text-left p-2">
            <n-tag :type="panel.status === 'staked' ? 'success' : 'default'" size="small">
              {{ panel.status == 'staked' ? 'Staked' : 'Not Staked' }}
            </n-tag>
          </td>
          <td class="p-2">
            <n-button
              v-if="panel.status === 'unstaked'"
              @click="onStakeClicked(panel.id)"
              secondary
              type="success"
              size="small"
            >
              Stake
            </n-button>
            <n-button
              v-else
              @click="onUnstakeClicked(panel.id)"
              secondary
              type="warning"
              size="small"
            >
              Unstake
            </n-button>
          </td>
        </tr>
      </tbody>
    </table>
  </n-modal>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue';
import { NButton, NTag, NModal, NSpace, NAlert, NSkeleton, NIcon } from 'naive-ui';
import { panelList, refreshData, isLoading } from '@/services/panel-data-service';
import { useSppStakingService } from '@/services/spp-staking-service';
import Icon from './common/Icon.vue';

const props = defineProps({
  sppId: {
    type: Number,
    required: true,
  },
});
const show = defineModel<boolean>();

const sppService = useSppStakingService(props.sppId.toString());

refreshData();
const panels = computed(() => {
  return panelList.value.filter(
    (p) => p.status == 'unstaked' || Number(p.sppId) == Number(props.sppId),
  );
});

async function onStakeClicked(tokenId: bigint) {
  const result = await sppService.stake(tokenId);
  if (result) {
    refreshData();
  }
}
async function onUnstakeClicked(tokenId: bigint) {
  const result = await sppService.unstake(tokenId);
  if (result) {
    refreshData();
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  width: 60%;
  height: 60%;
  background-color: #26282d;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

h2 {
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  font-weight: bold;
}

td,
th {
  padding: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
