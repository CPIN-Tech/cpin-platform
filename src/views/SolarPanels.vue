<template>
  <div class="page">
    <div class="page-header">
      <div class="cards-container">
        <div class="cardcombo-4">
          <CardCombo4
            v-if="isLoading"
            :title="'My Solar Panels : ...'"
            valString=""
            percentage
            cardWrap
            iconBox
            :claimableCWATT="'Claimable CWATT : ...'"
            :claimableCDATA="'Claimable CDATA : ...'"
          >
            <template #icon>
              <CardComboIcon :iconName="UsersIcon" boxed></CardComboIcon>
            </template>
            <template #buttons>
              <n-button :style="{ marginTop: '12px' }" text-color="#fff" color="rgb(0, 178, 123)">
                Claim
              </n-button>
            </template>
          </CardCombo4>
          <CardCombo4
            v-else
            :title="'My Solar Panels : ' + userTotalCapacity"
            valString=""
            percentage
            cardWrap
            iconBox
            :claimableCWATT="formatAmount(userTotalEarnedCWATT)"
            :claimableCDATA="formatAmount(userTotalEarnedCDATA)"
          >
            <template #icon>
              <CardComboIcon :iconName="UsersIcon" boxed></CardComboIcon>
            </template>
            <template #buttons>
              <n-button
                @click="claimAll"
                :style="{ marginTop: '12px' }"
                text-color="#fff"
                color="rgb(0, 178, 123)"
              >
                Claim All
              </n-button>
            </template>
          </CardCombo4>
        </div>

        <div class="cardcombo-4">
          <CardCombo4 title="Buy Solar Panel" valString="" percentage cardWrap iconBox isWide>
            <template #icon>
              <CardComboIcon :iconName="UsersIcon" boxed></CardComboIcon>
            </template>
            <template #buttons>
              <div class="decrease-margin m-6"></div>
              <n-button @click="isBuyingModalVisible = true">Buy Panel</n-button>
            </template>
          </CardCombo4>
        </div>

        <div class="cardcombo-4">
          <CardCombo4 title="Stake Panels" valString="" percentage cardWrap iconBox isWide>
            <template #icon>
              <CardComboIcon :iconName="UsersIcon" boxed></CardComboIcon>
            </template>
            <template #buttons>
              <div class="decrease-margin m-6"></div>
              <n-button
                text-color="#fff"
                color="rgb(0, 178, 123)"
                @click="isSelectSPPVisible = true"
              >
                Stake
              </n-button>
            </template>
          </CardCombo4>
          <SelectSPPModal v-model="isSelectSPPVisible" @close="isSelectSPPVisible = false" />
        </div>
      </div>
      <!-- <div class="links">
        <a
          href="https://www.naiveui.com/en-US/light/components/table"
          target="_blank"
          alt="docs"
          rel="nofollow noopener noreferrer"
        >
          <Icon :name="ExternalIcon" :size="16" />
          docs
        </a>
      </div> -->
    </div>

    <div class="components-list">
      <CardCodeExample title="CPIN">
        <n-scrollbar x-scrollable style="width: 100%">
          <VirtualPanelList class="table-min-width" :bordered="false" />
        </n-scrollbar>
      </CardCodeExample>
    </div>

    <BuyingModal v-model="isBuyingModalVisible" @update:modelValue="refreshPanelData" />
  </div>
</template>

<script lang="ts" setup>
import { NScrollbar, NButton } from 'naive-ui';
const UsersIcon = 'carbon:solar-panel';
import VirtualPanelList from '@/components/tables/VirtualPanelList.vue';
import CardCodeExample from '@/components/cards/CardCodeExample.vue';
import CardCombo4 from '@/components/cards/combo/CardCombo4.vue';
import CardComboIcon from '@/components/cards/combo/CardComboIcon.vue';
import { ref } from 'vue';
import BuyingModal from '@/components/BuyingModal.vue'; // Import BuyingModal
import SelectSPPModal from '@/components/SelectSPPModal.vue'; // Import BuyPanel
import {
  refreshData as refreshPanelData,
  isLoading,
  userTotalCapacity,
  userTotalEarnedCDATA,
  userTotalEarnedCWATT,
  claimAll,
} from '../services/panel-data-service';
import { formatAmount } from '@/utils/formatters';

const isBuyingModalVisible = ref(false); // Control BuyingModal visibility
const isSelectSPPVisible = ref(false); // Control BuyPanel visibility
</script>

<style scoped lang="scss">
.cards-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  align-items: stretch;
}

.cardcombo-4 {
  flex: 1;
  display: flex;
  min-width: 0;
}

.cardcombo-4 > * {
  flex: 1;
}

// .n-button {
//   margin: 0 auto;
//   width: 50%;
// }

@media (min-width: 1024px) {
  .cards-container {
    gap: 20px;
  }

  .cardcombo-4 {
    flex-basis: calc(33.3333% - 20px);
    max-width: calc(33.3333% - 20px);
  }
}

@media (max-width: 1024px) {
  .cards-container {
    flex-direction: column;
  }

  .cardcombo-4 {
    max-width: 100%;
  }
}

@media (max-width: 600px) {
  .decrease-margin {
    margin: 8px;
  }
}

.page-header {
  margin-bottom: 20px;
}
</style>
