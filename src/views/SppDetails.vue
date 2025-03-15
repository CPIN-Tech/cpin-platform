<template>
  <div class="max-w-[1024px] mx-auto">
    <div class="flex items-center px-4 pb-12">
      <div class="w-12 h-12 mr-20 flex items-center justify-center">
        <CardComboIcon :iconName="PanelIcon" boxed :boxSize="42" class="icon-style" />
      </div>

      <div>
        <h1 class="text-xl font-semibold">{{ sppService.info.value.name }}</h1>
        <p class="text-gray-500">
          {{ sppService.info.value.city }} / {{ sppService.info.value.country }}
        </p>
      </div>
    </div>

    <div class="border border-gray-600 p-4 mb-6 rounded-[6px]">
      <div class="flex justify-between items-center mb-4">
        <span class="text-lg font-semibold">
          <strong>{{ emptyCapacity }}</strong>
          empty slot /
          <small>{{ sppService.info.value.maxCapacity }}</small>
          slots
        </span>
        <n-button text-color="white" secondary type="primary" @click="isModalVisible = true">
          Stake Panels
        </n-button>

        <StakePanelModal
          v-if="sppService.info.value.status == 'active'"
          v-model="isModalVisible"
          :sppId="Number(sppId)"
        />
      </div>

      <!-- DetailsDefragTable.vue  -->
      <DetailsDefragTable
        :greenCount="sppService.userStakedCapacity.value"
        :blueCount="otherStakedCapacity"
        :greyCount="emptyCapacity"
      />

      <div class="hidden md:flex w-full md:w-3/5 flex-wrap content-start">
        <div class="w-[33%] max-h-[90px] py-2 md:py-5 flex flex-col justify-between">
          <h4 class="font-semibold text-gray-400">Claimable</h4>
          <p class="text-white">{{ formatAmount(sppService.userEarnedCDATA.value) }} CDATA</p>
        </div>
        <div class="w-[33%] max-h-[90px] py-2 md:py-5 flex flex-col justify-between">
          <h4 class="font-semibold text-gray-400">Claimable</h4>
          <p class="text-white">{{ formatAmount(sppService.userEarnedCWATT.value) }} CWATT</p>
        </div>
        <div class="w-[33%] max-h-[90px] pt-4 md:py-5 flex flex-col justify-between">
          <n-button
            @click="onClaimClicked"
            v-if="sppService.userEarnedCWATT.value > 0n"
            text-color="white"
            type="default"
          >
            Claim All
          </n-button>
        </div>
      </div>

      <div class="md:hidden w-full flex flex-wrap content-start mt-3">
        <div class="w-[54%] max-h-[90px] py-2 md:py-5 flex flex-col justify-between">
          <h4 class="font-semibold text-gray-400">You Have Earned</h4>
          <p class="text-white">{{ formatAmount(sppService.userEarnedCDATA.value) }} CDATA</p>
          <p class="text-white">{{ formatAmount(sppService.userEarnedCWATT.value) }} CWATT</p>
        </div>
        <div class="w-[46%] max-h-[90px] pt-4 md:py-5 flex flex-col justify-between">
          <n-button v-if="sppService.userEarnedCWATT.value > 0n" text-color="white" type="default">
            Claim All
          </n-button>
        </div>
      </div>
    </div>
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">About this plant</h2>
      <p class="text-white-700">
        {{ sppService.info.value.desc }}
      </p>
    </div>

    <div class="flex flex-col-reverse md:flex-row gap-8">
      <div class="w-full md:w-3/5 flex flex-col items-center">
        <div class="w-full relative pt-[75%] mb-4">
          <img :src="selectedImage" alt="Main Image" class="w-full absolute top-0 h-full" />
        </div>
        <div class="flex gap-2">
          <div class="w-[25%]" v-for="(image, index) in sppService.info.value.images" :key="index">
            <img
              :src="image"
              alt="Small Image"
              class="w-full h-full flex-1 cursor-pointer"
              @click="selectImage(image)"
            />
          </div>
        </div>
      </div>

      <div class="w-full md:w-2/5 flex flex-wrap content-start">
        <div class="w-[50%] max-h-[90px] py-2 md:py-5 flex flex-col justify-between">
          <h4 class="font-semibold text-gray-400">Plant Status</h4>
          <p class="text-white">
            {{ sppService.info.value.status == 'active' ? 'Active' : 'Inactive' }}
          </p>
        </div>
        <div class="w-[50%] max-h-[90px] py-2 md:py-5 flex flex-col justify-between">
          <h4 class="font-semibold text-gray-400">SPP Code</h4>
          <p class="text-white">{{ sppService.info.value.sppCode }}</p>
        </div>
        <div class="w-[50%] max-h-[90px] py-2 md:py-5 flex flex-col justify-between">
          <h4 class="font-semibold text-gray-400">Installed Power</h4>
          <p class="text-white">{{ sppService.info.value.installedPower }}</p>
        </div>
        <div class="w-[50%] max-h-[90px] py-2 md:py-5 flex flex-col justify-between">
          <h4 class="font-semibold text-gray-400">Expected Monthly Production</h4>
          <p class="text-white">{{ sppService.info.value.monthlyProduction }}</p>
        </div>
        <div class="w-[50%] max-h-[90px] py-2 md:py-5 flex flex-col justify-between">
          <h4 class="font-semibold text-gray-400">Location</h4>
          <p class="text-white">
            {{ sppService.info.value.city }} / {{ sppService.info.value.country }}
          </p>
        </div>
        <div class="w-[50%] max-h-[90px] py-2 md:py-5 flex flex-col justify-between">
          <h4 class="font-semibold text-gray-400">Photovoltaic modules</h4>
          <p class="text-white">{{ sppService.info.value.moduleCount }} pieces</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import Icon from '@/components/common/Icon.vue';
import DetailsDefragTable from '@/components/details/DetailsDefragTable.vue';
import { NButton } from 'naive-ui';
import StakePanelModal from '@/components/StakePanelModal.vue';
import CardComboIcon from '@/components/cards/combo/CardComboIcon.vue';
import { useSppStakingService } from '@/services/spp-staking-service';
import { refreshData } from '@/services/panel-data-service';
import { formatAmount } from '@/utils/formatters';
refreshData();

const route = useRoute();
const sppId = route.params.id;
const sppService = useSppStakingService(sppId);

const emptyCapacity = computed(() => {
  const val = sppService.info.value.maxCapacity - Number(sppService.stakedCapacity.value);
  return val > 0 ? val : 0;
});
const otherStakedCapacity = computed(() => {
  const val = Number(sppService.stakedCapacity.value) - sppService.userStakedCapacity.value;
  return val > 0 ? val : 0;
});

const isModalVisible = ref(false);

const PanelIcon = 'carbon:solar-panel';

const selectedImage = ref(sppService.info.value.images[0] || '');

function selectImage(image) {
  selectedImage.value = image;
}

function onClaimClicked() {
  sppService.claim();
}
</script>

<style scoped>
.border {
  border-width: 2px;
}

img {
  border-radius: 8px;
}
</style>
