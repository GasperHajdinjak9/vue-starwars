<template>
    <div>
        <h1>Card</h1>
    </div>
</template>

<script lang="ts">

    export default {
        name: 'Card',

        mounted() {
            fetch('https://swapi.dev/api/')
            .then((res) => res.json())
            .then(data => console.log(data))
        }
    }


    
</script>

<style scoped>

</style>