<template>
  <div class="page">
    <div class="main-grid gap-5">
      <!-- main col -->
      <div class="main-col">
        <div class="flex flex-col gap-5 h-full">
          <!-- big chart -->
          <div class="flex main-chart-wrap">
            <CardCombo3 class="h-full"></CardCombo3>
          </div>
          <SolarPanelInfo class="just-desktop" />
        </div>
      </div>

      <!-- side col -->
      <div class="side-col">
        <div class="flex flex-col gap-5 h-full">
          <!-- tiny chart -->
          <div class="flex">
            <CardCombo1
              title="Panels"
              class="h-full !text-white"
              :style="`background-color: ${chartBg}`"
              chartColor="#ffffff"
            >
              <template #icon>
                <CardComboIcon :iconName="PanelIcon" boxed color="white"></CardComboIcon>
              </template>
            </CardCombo1>
          </div>

          <!-- three cards -->
          <div class="flex gap-2">
            <CardCombo2 title="Green Energy" centered class="basis-1/2">
              <template #icon>
                <CardComboIcon
                  :iconName="EnergyIcon"
                  boxed
                  :boxSize="50"
                  :color="style['--secondary-color']"
                ></CardComboIcon>
              </template>
            </CardCombo2>
            <CardCombo2 title="Impact CO2" centered class="basis-1/2">
              <template #icon>
                <CardComboIcon
                  :iconName="EnergyRenewableIcon"
                  boxed
                  :boxSize="50"
                  :color="style['--secondary-color']"
                ></CardComboIcon>
              </template>
            </CardCombo2>
            <CardCombo2 title="Climate Heroes" centered class="basis-1/2">
              <template #icon>
                <CardComboIcon
                  :iconName="SessionsIcon"
                  boxed
                  :boxSize="50"
                  :color="style['--secondary-color']"
                ></CardComboIcon>
              </template>
            </CardCombo2>
          </div>

          <div class="flex">
            <SolarPanelInfo class="just-mobile" />
          </div>

          <!-- map -->
          <div class="flex">
            <CardExtra7
              title="Top countries"
              :segmented="{
                content: true,
              }"
            />
          </div>

          <!-- timeline -->
          <div class="grow timeline-wrap">
            <CardExtra5
              long
              lazy
              hideImage
              title="Platform Actions "
              class="h-full overflow-hidden"
              :segmented="{
                content: true,
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DemoChart from '@/components/charts/DemoApex.vue';
import DemoList from '@/components/list/List.vue';
import { useThemeStore } from '@/stores/theme';
import { computed } from 'vue';
import CardCombo1 from '@/components/cards/combo/CardCombo1.vue';
import CardCombo2 from '@/components/cards/combo/CardCombo2.vue';
import CardCombo3 from '@/components/cards/combo/CardCombo3.vue';
import CardCombo4 from '@/components/cards/combo/CardCombo4.vue';
import CardComboIcon from '@/components/cards/combo/CardComboIcon.vue';
import CardWrapper from '@/components/cards/CardWrapper.vue';
import CardActions from '@/components/cards/CardActions.vue';
import CardExtra5 from '@/components/cards/extra/CardExtra5.vue';
import CardExtra7 from '@/components/cards/extra/CardExtra7.vue';
import SolarPanelInfo from '@/components/SolarPanelInfo.vue';

const SessionsIcon = 'carbon:user-multiple';
const UsersIcon = 'carbon:user';
const ReportsIcon = 'carbon:report';
const ErrorIcon = 'carbon:debug';
const ViewsIcon = 'carbon:view';
const ActivityIcon = 'carbon:activity';
const UploadsIcon = 'carbon:cloud-upload';
const PanelIcon = 'carbon:solar-panel';
const EnergyIcon = 'carbon:lightning';
const EnergyRenewableIcon = 'carbon:energy-renewable';

const themeStore = useThemeStore();

const style = computed<{ [key: string]: any }>(() => themeStore.style);
const textSecondaryColor = computed<string>(() => style.value['--fg-secondary-color']);

const chartBg = computed<string>(() =>
  themeStore.isThemeDark ? style.value['--secondary1-color'] : style.value['--secondary1-color'],
);
</script>

<style lang="scss" scoped>
.page {
  .main-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(1, 1fr);
    grid-template-areas: 'main main side';

    @media (max-width: 1200px) {
      display: flex;
      flex-direction: column;

      .timeline-wrap {
        min-height: 400px;
        display: flex;
        flex-direction: column;

        .n-card {
          flex-grow: 1;
        }
      }
    }
  }

  .main-col {
    grid-area: main;
    container-type: inline-size;

    .main-chart-wrap {
      height: 450px;
    }

    .four-cards-wrap {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      grid-template-rows: repeat(1, minmax(0, 1fr));

      @container (max-width: 1000px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: repeat(2, minmax(0, 1fr));
      }

      @container (max-width: 460px) {
        grid-template-columns: repeat(1, minmax(0, 1fr));
        grid-template-rows: repeat(4, minmax(0, 1fr));
      }
    }

    @media (max-width: 768px) {
      .just-desktop {
        display: none;
      }
    }
  }

  .solar-panel-info {
    flex-grow: 1;
    width: 100%;

    @media (max-width: 768px) {
      width: 100%;
      flex-grow: 1;
    }
  }
  .side-col {
    grid-area: side;

    .flex {
      width: 100%;
    }

    @media (min-width: 768px) {
      .just-mobile {
        display: none;
      }
    }
  }
}
</style>
