<script lang="ts">
import Card from './components/Card.vue'
import Navbar from './components/Navbar.vue'

export default {
    name: 'App',
    components: {
        Card,
        Navbar
    }
}

</script>

<template>
    <Navbar />
    <Card />
</template>

<style scoped></style>
