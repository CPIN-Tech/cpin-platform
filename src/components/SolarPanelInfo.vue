<template>
  <div class="solar-panel-info border-2 border-[#ffffff0d]">
    <!-- <img src="/images/solar-panel-header.jpg" alt="Solar Panel" class="panel-photo" /> -->
    <div class="solar-panel-title pb-4 border-b-[1px] border-[#ffffff0d]">Recent Actions</div>
    <ul class="panel-list">
      <li v-for="(item, index) in panelData.slice(0, 8)" :key="index" class="panel-item">
        <CardComboIcon :iconName="PanelIcon" boxed class="icon-style" />
        <div class="panel-details">
          <div class="name">{{ item.name }}</div>
          <div class="date">{{ elapsedTime(item.date) }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import CardComboIcon from '@/components/cards/combo/CardComboIcon.vue';

interface PanelData {
  id: string;
  name: string;
  category: string;
  photo: string;
  price: string;
  stock: {
    name: string;
    type: string;
  };
  orders: number;
  percentage: number;
  date: string;
}

const panelData = ref<PanelData[]>([]);
const PanelIcon = 'carbon:solar-panel';

onMounted(async () => {
  const data = await import('@/data/data.json');
  panelData.value = data.default;
});

// function elapsedTime(dateString: string): string {
//   const today = new Date();
//   const past = new Date(dateString);
//   const diffTime = Math.abs(today.getTime() - past.getTime());
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//   const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
//   return `${diffDays} days ${diffHours} hrs ${diffMinutes} mins ago`;
// }

function elapsedTime(dateString: string): string {
  const today = new Date();
  const past = new Date(dateString);
  const diffTime = Math.abs(today.getTime() - past.getTime());

  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

  let result = '';

  if (diffDays > 0) {
    result += `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  }

  if (diffHours > 0) {
    if (result) result += ' ';
    result += `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  }

  if (diffMinutes > 0) {
    if (result) result += ' ';
    result += `${diffMinutes} min${diffMinutes > 1 ? 's' : ''} ago`;
  }

  if (!result) {
    result = 'just now';
  }

  return result;
}
</script>

<style lang="scss" scoped>
.solar-panel-info {
  display: flex;
  flex-direction: column;
  // align-items: center;
  background-color: #26282d;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.solar-panel-title {
  text-align: left !important;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
}

.panel-photo {
  width: 100%;
  height: auto;
  border-radius: 8px;
  opacity: 0.8;
}

.panel-list {
  list-style: none;
  padding: 0;
  width: 100%;
}

.panel-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 2px solid #ffffff0d;

  &:last-child {
    border-bottom: none;
  }
}

.icon-style {
  flex-shrink: 0; // Prevents icon from shrinking
}

.panel-details {
  flex-grow: 1; // Allows details to take up remaining space
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.name,
.date {
  font-size: 16px;
}

.date {
  color: #666;
}
</style>
