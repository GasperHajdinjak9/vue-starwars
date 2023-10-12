<template>
    <Loading v-if="isLoading" />
    <div v-else class="card-container flex flex-wrap justify-center pt-[80px]">
        <div v-for="character in characters" :key="character.id"
            class="card-container__card m-4 w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
            <div class="c-card__image-container">
                <img :src="images[character.originalName as keyof typeof images]"
                    class="c-card__image w-full h-[420px] sm:h-auto" :alt="character.name + ' Image'" />
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

                    <div class="flex justify-center mt-4">
                        <button @click="character.isEditing ? saveEdits(character) : startEditing(character)"
                            class="bg-yellow-400 hover:bg-yellow-500 rounded-md p-2 px-4 text-black font-extrabold">
                            {{ character.isEditing ? 'Save' : 'Edit' }}
                        </button>
                        <button v-if="character.isEditing" @click="cancelEditing(character)"
                            class="bg-red-400 hover:bg-red-500 rounded-md p-2 px-4 ml-1 text-white font-extrabold">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
///////* IMPORTS */////////
import axios from 'axios'

import { defineComponent, ref, onMounted } from 'vue';
import { openDB } from 'idb';

import Loading from '../components/Loading.vue'

import obiWanKenobiImg from '../assets/obi-wan.png';
import darthVaderImg from '../assets/darth-vader.png';
import R2D2Img from '../assets/r2-d2.png';
////////* /IMPORTS */////////

///////* DEFINED OBJECTS *///////
interface Character {
    id?: number;
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
    [key: string]: any;
}

interface Images {
    [key: string]: string;
}

const images = ref<Images>({
    'Obi-Wan Kenobi': obiWanKenobiImg,
    'Darth Vader': darthVaderImg,
    'R2-D2': R2D2Img,
});

///////* DEFINED OBJECTS *///////

export default defineComponent({
    name: 'Card',
    components: {
        Loading
    },

    setup() {
        const characters = ref<EditableCharacter[]>([]);
        const isLoading = ref(true);

        ///////////* INDEX DB *//////////////
        let db: any;
        let objectStore = null;

        async function setupDB() {
            try {
                db = await openDB('character', 10, { //ustvari nov databse z imenom 'characters' + verzija 
                    upgrade(db, oldVersion, newVersion, transaction) {
                        console.log('upgraded from', oldVersion, 'to', newVersion)

                        if (!db.objectStoreNames.contains('characters')) {

                            objectStore = db.createObjectStore('characters', {
                                keyPath: 'id',
                                autoIncrement: true
                            })
                        }
                    }
                })
            } catch (error) {
                console.error(error)
            }
        }

        function prepareForDB(character: EditableCharacter): any {
            const clonedCharacter = JSON.parse(JSON.stringify(character, (key, value) => {
                if (typeof value === 'symbol' || typeof value === 'function' || value === undefined) {
                    return; // Return undefined to exclude this from the serialized JSON
                }
                return value;
            }));
            return clonedCharacter;
        }

        async function addToDB(character: EditableCharacter) {
            try {
                const tx = db.transaction('characters', 'readwrite');
                const store = tx.objectStore('characters');
                const characterForDB = prepareForDB(character);
                await store.put(characterForDB);
                console.log(characterForDB);

                await tx.done;
                console.log("Transaction completed successfully.");
            } catch (error) {
                console.error('Error storing character:', error);
            }
        }

        async function fetchFromDB(): Promise<EditableCharacter[]> {
            try {
                const tx = db.transaction('characters', 'readonly');
                const store = tx.objectStore('characters');
                const allCharacters = await store.getAll();
                return allCharacters;
            } catch (error) {
                console.error('Error fetching characters from DB:', error);
                return [];
            }
        }

        setupDB().catch(err => console.warn(err));

        ///////////* /INDEX DB *///////////

        //////////* EDITING FUNCTIONALITIES *//////////

        const originalCharacters = ref<EditableCharacter[]>([]);

        const startEditing = (character: EditableCharacter) => {
            character.isEditing = true;
        };

        const cancelEditing = (character: EditableCharacter) => {
            character.isEditing = false;
        };

        const saveEdits = (character: EditableCharacter) => {
            character.isEditing = false;
            addToDB(character);

            // odkomentiraj glede na kater browser storage želiš uporabit
            // localStorage.setItem("data", JSON.stringify(characters.value)) // store to local storage
        };

        //////////* /EDITING FUNCTIONALITIES *//////////

        //////////* DATA FETCHING *///////////
        let uniqueId = 1;
        const fetchCharacters = async () => {
            try {
                isLoading.value = true;
                const response = await axios.get('https://swapi.dev/api/people/');
                const selectedCharacters = ['R2-D2', 'Darth Vader', 'Obi-Wan Kenobi',];
                characters.value = response.data.results
                    .filter((char: EditableCharacter) => selectedCharacters.includes(char.name))
                    .map((char: EditableCharacter) => ({ ...char, isEditing: false, originalName: char.name, id: uniqueId++, }));
                isLoading.value = false;

            } catch (err) {
                isLoading.value = false;
                console.log(err);
            }
        }
        //////////* /DATA FETCHING *///////////

        ///////////* FETCH INDEXDB *//////////

        onMounted(async () => {
            const dbData = await fetchFromDB();
            if (dbData && dbData.length > 0) {
                characters.value = dbData;
                isLoading.value = false;
            } else {
                fetchCharacters();
            }
        });

        //////////* /FETCH INDEXDB *//////////

        //////////* FETCH LOCAL STORAGE *//////////
        // const storedData = JSON.parse(localStorage.getItem("data") || '[]');

        // if (storedData.length > 0) {
        //     characters.value = storedData;
        //     isLoading.value = false;
        // } else {
        //     onMounted(fetchCharacters);
        // }
        //////////* /FETCH LOCAL STORAGE *//////////

        return {
            characters,
            images,
            startEditing,
            cancelEditing,
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
        z-index: 10;
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