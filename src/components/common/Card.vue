<template>
  <div class="card m-4">
    <div class="card__image-container">
      <slot name="image"></slot>
      <div class="card__text">
        <slot name="header"></slot>
        <slot name="content"></slot>
        <slot name="footer">
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Card',
});
</script>

<style scoped lang="scss">
.card{
  max-height: 500px;
  .card__image-container {
    position: relative;
    width: 250px;
    :deep(img) {
      border-radius: 10px;
}
    .card__text {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      color: white;
      padding: 10px;
    }
  }
}
</style>