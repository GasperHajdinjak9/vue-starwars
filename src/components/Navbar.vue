<template>
    <nav class="navbar">
        <button class="navbar__hamburger" @click="toggleMenu">&#9776;</button> 
        <div class="navbar__links-container" :class="{ 'active': menuOpen }">
            <a href="" class="navbar__link">Upcoming</a>
            <a href="" class="navbar__link">Legacy</a>
            <img src="../assets/star-wars-logo.png" alt="" class="navbar__logo w-40 h-15">
            <a href="" class="navbar__link">Merch</a>
            <a href="" class="navbar__link">About</a>
        </div>
    </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup() {
        const menuOpen = ref(false);

        const toggleMenu = () => {
            menuOpen.value = !menuOpen.value;
        };

        return { menuOpen, toggleMenu }
    }
})
</script>

<style scoped lang="scss">
.navbar {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    max-height: 80px;
    background-color: transparent;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;

    &__hamburger {
        display: none;
        font-size: 30px;
        background-color: transparent;
        border: none;
        color: white;
    }

    &__links-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 50px 0;
        width: 100%;
        max-width: 800px;

        &.active {
            display: flex;
        }
    }
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

@media (max-width: 768px) {
    .navbar {
        justify-content: right;
        z-index: 9999999;
        background-color: #000;
        &__logo {
            display: none;
        } 
    }
    .navbar__links-container {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        background-color: #000;
        width: 100%;
        line-height: 5rem;
        a {
            &:hover {
                background-color: rgb(0, 0, 0, 0.7);
            }
        }
    }
    .navbar__links-container.active {
        display: flex;
    }
    .navbar__hamburger {
        display: block;
    }
}

</style>