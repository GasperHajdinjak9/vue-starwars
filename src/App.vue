<script lang="ts">
import { defineComponent } from 'vue';
import HomeView from './views/HomeView.vue';
import Navbar from './components/common/Navbar.vue';

export default defineComponent({
  name: 'App',
  components: {
    HomeView,
    Navbar
  }
});
</script>

<template>
    <div>
        <Navbar />
        <HomeView />
    </div>
</template>
