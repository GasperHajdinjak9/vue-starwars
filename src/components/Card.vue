<template>
    <div>
        <h1>Card</h1>
        <div v-for="character in characters" :key="character.name">
            <h2>{{ character.name }}</h2>
            <p>Height: {{ character.height }}</p>
            <p>Gender: {{ character.gender }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import * as Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'


interface Character {
    name: string,
    height: string,
    gender: string,
}

export default {
    name: 'Card',
    data(): { characters: Character[] } {
        return {
            characters: []
        }
    },

    mounted() {
        axios.get('https://swapi.dev/api/people/')
        .then(response => {
            const selectedCharacters = ['R2-D2', 'Darth Vader', 'Obi-Wan Kenobi', ]
            this.characters = response.data.results.filter((char: Character) => 
                selectedCharacters.includes(char.name));
            console.log(this.characters)
        })
        .catch(err => {
            console.log(err);
        });
    }
}



</script>

<style scoped></style>