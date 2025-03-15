<template>
  <div>
    <n-space vertical v-if="isLoading">
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
    <n-table v-else>
      <thead>
        <tr>
          <th>Name</th>
          <th class="!text-right">Panels</th>
          <th class="!text-right">Status</th>
          <th class="!text-right">Staked Facility</th>
          <th class="!text-right">Expire Date</th>
          <th class="!text-center max-w-[400px]">Energy Production</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in panelList" :key="item.id.toString()">
          <td>
            <div class="product flex items-center">
              <div class="hidden sm:flex items-center mr-3">
                <CardComboIcon iconName="carbon:solar-panel" boxed></CardComboIcon>
              </div>
              <div class="break-normal ">
                {{ item.name }}
              </div>
            </div>
          </td>
          <td>
            <div class="!text-right">
              {{ item.capacity.toString() }}
            </div>
          </td>
          <td>
            <div class="status">
              <n-tag :type="getTagType(item)">
                {{ getStatusText(item) }}
              </n-tag>
            </div>
          </td>
          <td>
            <div class="!text-right">
              {{ item.sppName }}
            </div>
          </td>
          <td>
            <div class="date !text-right whitespace-nowrap">
              {{ formatDate(item.expireDate) }}
            </div>
          </td>
          <td class="!pt-0 !pb-0 max-w-[400px] text-center">
            <ApexChart :type="'line'" :series="item.series" :options="chartOptions" height="70" />
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { NTable, NTag, NPagination, NSpace, NAlert, NSkeleton, NIcon } from 'naive-ui';
import dayjs from 'dayjs';
import ApexChart from '@/components/charts/ApexChart.vue';
import CardComboIcon from '@/components/cards/combo/CardComboIcon.vue';
import { isLoading, panelList, refreshData, type VirtualPanel } from '../../services/panel-data-service';
import Icon from '@/components/common/Icon.vue';
import { formatDate } from '@/utils/formatters';

onMounted(() => {
  refreshData();
})

function getTagType(panel: VirtualPanel): 'success' | 'error' | 'default' {
  switch(panel.status) {
    case 'staked': return 'success';
    case 'unstaked': return 'default';
    case 'expired': return 'error';
  }
}
function getStatusText(panel: VirtualPanel): string {
  switch(panel.status) {
    case 'staked': return 'in-use';
    case 'unstaked': return 'not in-use';
    case 'expired': return 'expired';
  }
}


const chartOptions = {
  chart: {
    id: 'simple-line',
    toolbar: {
      show: false,
    },
  },
  stroke: {
    curve: 'straight',
    width: 3,
  },
  xaxis: {
    labels: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      show: false,
    },
  },
  grid: {
    show: false,
  },
  tooltip: {
    enabled: true,
    theme: 'dark',
    x: {
      show: false,
    },
    y: {
      formatter: (value: number) => `${value} kW`,
    },
  },
  markers: {
    size: 0,
  },
  dataLabels: {
    enabled: false,
  },
};
</script>

<style lang="scss" scoped>
.status {
  float: right;
  margin-left: 95px;
}
.date {
  font-size: 14px;
  color: #6b7280;
}
.chart-container {
  display: inline-block;
  width: 80%;
  min-width: 140px;
  max-width: 320px;
  height: 10%;
}
</style>
