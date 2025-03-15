<template>
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal">
      <div class="modal-header">
        <span class="modal-title">{{ title }}</span>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>
      <div class="modal-body">
        <n-carousel show-arrow>
          <img
            class="carousel-img"
            src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg"
          />
          <img
            class="carousel-img"
            src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg"
          />
          <img
            class="carousel-img"
            src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg"
          />
          <img
            class="carousel-img"
            src="https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg"
          />
        </n-carousel>
        <div class="modal-content">
          <h2>{{ title }}</h2>
          <p>{{ description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { NCarousel } from 'naive-ui';

const props = defineProps({
  showModal: Boolean,
  title: String,
  description: String,
});

const emit = defineEmits(['update:show']);

function closeModal() {
  emit('update:show', false);
}
</script>

<style lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #26282d;
  border-radius: 8px;
  padding: 20px;
  width: 600px;
  max-width: 90%;

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #26282d;
    padding: 16px;

    .modal-title {
      font-weight: bold;
    }

    .close-button {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
    }
  }

  .modal-body {
    margin-top: 20px;
    padding: 16px;

    .modal-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;

      h2 {
        font-size: 24px;
        font-weight: bold;
        margin-top: 20px;
      }

      p {
        font-size: 16px;
        text-align: center;
      }
    }
  }

  .carousel-img {
    width: 100%;
    height: 240px;
    object-fit: cover;
  }
}
</style>
