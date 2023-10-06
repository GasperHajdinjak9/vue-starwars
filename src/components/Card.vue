<template>
    <div class="card-container flex flex-wrap justify-center">
        <div v-for="character in characters" :key="character.name" class="card-container__card m-4 w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
            <div class="c-card__image-container">
                <img :src="images[character.name]" class="c-card__image w-full h-auto" :alt="character.name + ' Image'" />
                <div class="c-card__text absolute bottom-0 left-0 w-full text-white p-2">
                    <p>Name: {{ character.name }}</p>
                    <p>Height: {{ character.height }}</p>
                    <p>Mass: {{ character.mass }}</p>
                    <p>Hair Color: {{ character.hair_color }}</p>
                    <p>Skin color: {{ character.skin_color }}</p>
                    <p>Birth year: {{ character.birth_year }}</p>
                    <p>Gender: {{ character.gender }}</p>
                </div>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import * as Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

import obiWanKenobiImg from '../assets/obi-wan.png';
import darthVaderImg from '../assets/darth-vader.png';
import R2D2Img from '../assets/r2-d2.png';


interface Character {
    name: string,
    height: string,
    mass: string,
    hair_color: string,
    skin_color: string,
    birth_year: string,
    gender: string,
}

export default {
    name: 'Card',
    data(): { characters: Character[], images: { [key: string]: string } } {
        return {
            characters: [],
            images: {
                'Obi-Wan Kenobi': obiWanKenobiImg,
                'Darth Vader': darthVaderImg,
                'R2-D2': R2D2Img
            }
        }
    },

    mounted() {
        axios.get('https://swapi.dev/api/people/')
            .then(response => {
                const selectedCharacters = ['R2-D2', 'Darth Vader', 'Obi-Wan Kenobi',]
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

<style scoped lang="scss">
.c-card {
    &__image-container {
        position: relative;
    }

    &__image {
        width: 100%;
        display: block;
        border-radius: 10px;
    }

    &__text {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%; 
        color: white;
        padding: 10px; 
    }
}

.card-container {
    display: flex;
    justify-content: center;
    align-items: center;

}
</style>