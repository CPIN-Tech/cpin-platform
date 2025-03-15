<template>
  <div class="card5">
    <div class="card5-header">
      <img src="/images/solar-panel.jpg" alt="Product Image" class="card5-image" />
    </div>
    <div class="card5-body">
      <h3 class="card5-title">{{ product.name }}</h3>
      <p class="card5-supply_bought">{{ product.supply }} Supply / {{ product.bought }} Sold</p>
      <p class="card5-description">{{ product.description }}</p>
      <div class="supply-capacity-item">
        <p class="card5-supply">
          Supply
          <br />
          {{ product.supply }}
        </p>
        <p class="capacity">
          Capacity
          <br />
          {{ product.capacity }}W
        </p>
      </div>
      <!-- <p class="card5-price">Price: {{ product.prices.USDT }}</p> -->
      <button class="card5-button" @click="isModalOpen = true">Buy Now</button>
    </div>
    <BuyPanelModal
      :showModal="isModalOpen"
      :product="product"
      @update:show="isModalOpen = $event"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BuyPanelModal from './BuyPanelModal.vue';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const isModalOpen = ref(false);
</script>

<style lang="scss" scoped>
.card5 {
  display: flex;
  height: 250px;
  background-color: #fff;
  //border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  overflow: hidden;

  .card5-header {
    height: 200px;

    img {
      width: 35%;
      height: 150%;
      object-fit: cover;

      margin-left: 300px;
    }
  }

  .card5-body {
    padding: 10px;
    margin-right: 280px;

    .card5-title {
      font-size: 18px;
      margin-bottom: 10px;
    }

    .card5-supply_bought {
      font-size: 14px;
      font-weight: bold;

      color: #2989f0;
      //margin-bottom: 5px;
      margin-left: 120px;
    }

    .card5-description {
      border-top: 2px dashed #ccc;
      padding-top: 10px;
      font-size: 14px;
      margin-bottom: 10px;
    }

    .supply-capacity-item {
      display: flex;
      justify-content: space-between;

      .card5-supply,
      .capacity {
        text-align: center;
      }
    }

    .card5-supply {
      font-size: 14px;
      margin-bottom: 10px;
    }

    .card5-price {
      border-bottom: 2px dashed #ccc;
      padding-bottom: 10px;
      font-size: 16px;
      font-weight: bold;
    }

    .card5-button {
      background-color: #01913a;
      color: #fff;
      border: none;

      padding: 8px 120px;

      margin-top: 20px;
      margin-left: 60px;
      border-radius: 15px;
      cursor: pointer;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #0056b3;
      }
    }
  }
}
</style>
