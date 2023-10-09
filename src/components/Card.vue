<template>
    <Loading v-if="isLoading" />
    <div v-else class="card-container flex flex-wrap justify-center">
        <div v-for="character in characters" :key="character.name"
            class="card-container__card m-4 w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
            <div class="c-card__image-container">
                <img :src="images[character.originalName as keyof typeof images]" class="c-card__image w-full h-auto"
                    :alt="character.name + ' Image'" />
                <div class="c-card__text absolute bottom-0 left-0 w-full text-white p-2">
                    <!-- ime -->
                    <div v-if="!character.isEditing">
                        Name: {{ character.name }}
                    </div>
                    <div v-else>
                        Name: <input v-model="character.name"
                            v-bind:class="{ 'bg-transparent border-b-2 border-white text-white placeholder-white::opacity-50 p-1 w-full': character.isEditing }" />
                    </div>
                    <!-- mass -->
                    <div v-if="!character.isEditing">
                        Height: {{ character.height }}
                    </div>
                    <div v-else>
                        Height:<input v-model="character.height"
                            v-bind:class="{ 'bg-transparent border-b-2 border-white text-white placeholder-white::opacity-50 p-1 w-full': character.isEditing }" />
                    </div>
                    <!-- hair -->
                    <div v-if="!character.isEditing">
                        Hair Color: {{ character.hair_color }}
                    </div>
                    <div v-else>
                        Hair Color:<input v-model="character.hair_color"
                            v-bind:class="{ 'bg-transparent border-b-2 border-white text-white placeholder-white::opacity-50 p-1 w-full': character.isEditing }" />
                    </div>
                    <!-- skin -->
                    <div v-if="!character.isEditing">
                        Skin Color: {{ character.skin_color }}
                    </div>
                    <div v-else>
                        Skin Color:<input v-model="character.skin_color"
                            v-bind:class="{ 'bg-transparent border-b-2 border-white text-white placeholder-white::opacity-50 p-1 w-full': character.isEditing }" />
                    </div>
                    <!-- birth -->
                    <div v-if="!character.isEditing">
                        Birth year: {{ character.birth_year }}
                    </div>
                    <div v-else>
                        Birth year:<input v-model="character.birth_year"
                            v-bind:class="{ 'bg-transparent border-b-2 border-white text-white placeholder-white::opacity-50 p-1 w-full': character.isEditing }" />
                    </div>
                    <!-- spol -->
                    <div v-if="!character.isEditing">
                        Gender: {{ character.gender }}
                    </div>
                    <div v-else>
                        Gender:<input v-model="character.gender"
                            v-bind:class="{ 'bg-transparent border-b-2 border-white text-white placeholder-white::opacity-50 p-1 w-full': character.isEditing }" />
                    </div>
                    <button @click="character.isEditing ? saveEdits(character) : startEditing(character)">
                        {{ character.isEditing ? 'Save' : 'Edit' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import * as Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

import { defineComponent, ref, onMounted } from 'vue';
import Loading from '../components/Loading.vue'

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
    originalName: string;
}

interface EditableCharacter extends Character {
    isEditing?: boolean;
}

interface Images {
    [key: string]: string;
}

export default defineComponent({
    name: 'Card',
    components: {
        Loading
    },

    setup() {
        const characters = ref<EditableCharacter[]>([]);
        const isLoading = ref(true);



        const startEditing = (character: EditableCharacter) => {
            character.isEditing = true;
        };

        const saveEdits = (character: EditableCharacter) => {
            character.isEditing = false;
        };





        const images = ref<Images>({
            'Obi-Wan Kenobi': obiWanKenobiImg,
            'Darth Vader': darthVaderImg,
            'R2-D2': R2D2Img,
        });


        const toggleEdit = (character: EditableCharacter) => {
            character.isEditing = !character.isEditing;
        };



        const fetchCharacters = async () => {
            try {
                isLoading.value = true;
                const response = await axios.get('https://swapi.dev/api/people/');
                const selectedCharacters = ['R2-D2', 'Darth Vader', 'Obi-Wan Kenobi',];
                characters.value = response.data.results
                    .filter((char: EditableCharacter) => selectedCharacters.includes(char.name))
                    .map((char: EditableCharacter) => ({ ...char, isEditing: false, originalName: char.name }));
                isLoading.value = false;

            } catch (err) {
                isLoading.value = false;
                console.log(err);
            }
        }

        onMounted(fetchCharacters);

        return {
            characters,
            images,
            toggleEdit,
            startEditing,
            saveEdits,
            isLoading
        }
    },
});



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