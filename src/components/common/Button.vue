<template>
  <button :class="buttonClass" >
    <slot></slot>
  </button>
</template>


<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    type: {
      type: String as PropType<'primary' | 'secondary'>,
      required: false,
      default: 'primary',
    },
  },
  setup(props) {
    const buttonClass = props.type === 'primary' 
      ? 'bg-yellow-400 hover:bg-yellow-500 rounded-md p-2 px-4 text-black font-extrabold mr-2'
      : 'bg-green-400 hover:bg-green-500 rounded-md p-2 px-4 text-black font-extrabold';

    return { buttonClass };
  },
});
</script>
