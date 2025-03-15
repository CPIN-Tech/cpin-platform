<template>
  <n-modal v-model:show="visible" class="!max-w-[600px]" title="Buy Panel">
    <n-card title="CPIN SPP Facilities" contentClass="!p-2" headerClass="">
      <template #cover>
        <img src="/images/solar-panel-header.jpg" />
      </template>
      <div class="modal-body">
        <n-scrollbar x-scrollable style="width: 100%">
          <table>
            <thead>
              <tr>
                <th>Facility</th>
                <th>Location</th>
                <th>Staked / Capacity</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ item.city }} / {{ item.country }}</td>
                <td>{{ item.stakedCapacity }} / {{ item.maxCapacity }}</td>
                <!-- <td>{{ item.apr }}%</td> -->
                <td>
                  <div class="flex">
                    <div>
                      <n-button @click="goToDetails(item)">Details</n-button>
                    </div>
                    <!-- <div>
                    <CardComboIcon
                      :iconName="InformationIcon"
                      boxed
                      @click="openInfoModal(item)"
                      bgColor="transparent"
                    ></CardComboIcon>
                  </div> -->
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </n-scrollbar>
      </div>

      <FacilityInfoModal
        :showModal="isInfoModalVisible"
        :title="infoTitle"
        :description="infoDescription"
        @update:show="isInfoModalVisible = $event"
      />
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import sppDatas from '@/data/spp.json';
import FacilityInfoModal from '@/components/FacilityInfoModal.vue';
import { NButton, NModal, NCard, NScrollbar } from 'naive-ui';
import { useRouter } from 'vue-router';
import { type SppInfo } from '@/services/spp-staking-service';

const router = useRouter();

const visible = defineModel<boolean>();

interface ExtraData {
  id: string;
  stakedCapacity: number;
  apr: number;
}
const extraDatas: ExtraData[] = [
  {
    id: '1',
    stakedCapacity: 120,
    apr: 7.3,
  },
  {
    id: '2',
    stakedCapacity: 12,
    apr: 7.8,
  },
  {
    id: '3',
    stakedCapacity: 3,
    apr: 6.6,
  },
  {
    id: '4',
    stakedCapacity: 0,
    apr: 0,
  },
  {
    id: '5',
    stakedCapacity: 0,
    apr: 0,
  },
];

const isInfoModalVisible = ref(false);
const selectedProduct = ref(null);
const infoTitle = ref('');
const infoDescription = ref('');
const items = ref<(SppInfo & ExtraData)[]>([]);
// const InformationIcon = 'carbon:information';

onMounted(() => {
  items.value = sppDatas.map((s) => ({
    ...s,
    ...extraDatas.find((e) => e.id == s.id)!,
  }));
});

// const openInfoModal = (item) => {
//   infoTitle.value = `Information about ${item.facility}`;
//   infoDescription.value = `Detailed information about ${item.facility} located in ${item.location}.`;
//   isInfoModalVisible.value = true;
// };

const goToDetails = (item: SppInfo) => {
  router.push('/spp-details/' + item.id);
};
</script>

<style lang="scss" scoped>
.modal-body {
  table {
    width: 100%;
    border-collapse: collapse;

    th {
      font-size: 16px;
      font-weight: bolder;
      color: #4caf50;
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #eaeaea;
    }
    td {
      font-size: 14px;
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #eaeaea;
      white-space: nowrap;
    }

    // th {
    //   background-color: #f9f9f9;
    // }
  }

  button {
    padding: 8px 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: #45a049;
    }
    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
}
</style>
