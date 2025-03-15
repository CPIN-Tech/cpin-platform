<template>
  <div class="proposal-card text-sm">
    <div class="header">
      <h3 class="text-lg font-extrabold">Proposal {{ proposal.number }}</h3>
      <n-tag v-if="proposal.succeeded" type="success">Succeeded</n-tag>
      <n-tag v-else type="error">Failed</n-tag>
    </div>
    <div class="content mb-3 mt-2">
      <div class="flex justify-between items-center">
        <strong>Proposed by:</strong>
        <span>{{ proposal.proposedBy }}</span>
      </div>
      <div class="flex justify-between items-center">
        <strong>For Votes:</strong>
        {{ proposal.forVotes }}
      </div>
      <div class="flex justify-between items-center">
        <strong>Against Votes:</strong>
        {{ proposal.againstVotes }}
      </div>
    </div>
    <n-button disabled>Voting Ended</n-button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { NTag, NButton } from 'naive-ui';

const props = defineProps({
  proposal: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.proposal-card {
  background-color: #2c2c3c;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content div {
  margin-bottom: 5px;
}
</style>
