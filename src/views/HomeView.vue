<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

import Card from '../components/common/Card.vue';
import Loading from '../components/Loading.vue'
import Button from '../components/common/Button.vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import { characterImageMap } from '../utils/CharacterImages';
import { EditableCharacter } from '../interfaces/Character';
import { ApiService } from '../services/ApiService';
import { SpecificCharacters } from '../enums/CharacterNames';
import { editableFields } from '../utils/editableFields';
import { toggleEditing } from '../services/EditServices';

import { addToDB, fetchFromDB, setupDB } from '../services/DBService';

export default defineComponent({
  name: 'HomeView',
  components: {
    Card,
    Button,
    Loading
  },
  setup() {
    const characters = ref([]);
    const isLoading = ref(true);

    const saveCharacter = async (character: EditableCharacter) => {
      await addToDB(character);
      character.isEditing = false
      delete character.originalState;
      toast.success("Uspešno shranjeno");
    };

    onMounted(async () => {
      try {
        isLoading.value = true;
        await setupDB();
        const dbCharacters = await fetchFromDB();

        if (dbCharacters.length > 0) {
          // Use characters from DB if available
          characters.value = dbCharacters;
        } else {
          // Fetch characters from API if DB is empty
          const response = await ApiService.fetchCharacters();
          const apiCharacters = response.data.results
            .filter(character => SpecificCharacters.includes(character.name))
            .map((character, index) => ({
              ...character,
              id: index,
              isEditing: false,
              imageURL: characterImageMap[character.name]
            }));

          characters.value = apiCharacters;

          // Save all characters to DB
          apiCharacters.forEach(async (character) => {
            await addToDB(character);
          });
        }
        isLoading.value = false;
      } catch (error) {
        console.error('Error fetching characters:', error);
        isLoading.value = false;
        toast.error("Nekaj je šlo narobe", error);
      }
    });

    return {
      characters,
      toggleEditing,
      editableFields,
      saveCharacter,
      isLoading,
    };
  }
});
</script>

<template>
  <main>
    <Loading v-if="isLoading" />
    <div v-else class="flex flex-row flex-wrap justify-center">
      <Card v-for="(character, id) in characters" :key="character.id" :character="character">
        <template v-slot:image>
          <img :src="character.imageURL" alt="Character Image" />
        </template>

        <template v-slot:content class="flex justify-center align-center">
          <div class="flex flex-col items-center pb-10">
            <div v-for="field in editableFields" :key="field" class="my-2 flex flex-col justify-center w-full">
              <strong>{{ field }}:</strong> 
              <span v-if="!character.isEditing">{{ character[field] }}</span>
              <input v-else type="text" v-model="character[field]" class="border rounded px-2 bg-gray-100 text-black" />
            </div> 
          </div>
        </template>

        <template v-slot:footer>
          <div class="flex align-center justify-center">
            <Button @click="(event) => { event.stopPropagation(); toggleEditing(character); }">
              {{ character.isEditing ? 'Cancel' : 'Edit' }}
            </Button>
            <Button type="secondary" @click="() => saveCharacter(character)">
              Save
            </Button>
          </div>
        </template>
      </Card>
    </div>
  </main>
</template>
