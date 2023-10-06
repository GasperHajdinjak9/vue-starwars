<template>
    <nav class="navbar">
        <a href="" class="navbar__link">Upcoming</a>
        <a href="" class="navbar__link">Legacy</a>
        <img src="../assets/star-wars-logo.png" alt="" class="navbar__logo w-40 h-15">
        <a href="" class="navbar__link">Merch</a>
        <a href="" class="navbar__link">About</a>

    </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'


export default defineComponent({
    setup() {


        return {}
    }
})
</script>

<style scoped lang="scss">
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    max-height: 80px;
    background-color: transparent;
}

.navbar__link {
    color: white;
    text-decoration: none;
    margin: 0 10px;

    &:hover {
        text-decoration: underline;
    }
}

.navbar__logo {
    font-size: 24px;
    font-weight: bold;
    color: gold;
}

</style>