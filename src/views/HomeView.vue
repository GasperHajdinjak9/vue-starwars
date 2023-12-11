<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

import { useQuery, useQueryClient } from "@tanstack/vue-query";

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

import { DatabaseType } from '../enums/databseTypes';
import { addToDB, fetchFromDB, setupDB } from '../services/DBService';
import * as StorageServiceManager from '../services/StorageServiceManager';


export default defineComponent({
  name: 'HomeView',
  components: {
    Card,
    Button,
    Loading
  },
  setup() {
    const characters = ref([]);
    const databaseType = ref(DatabaseType.INDEXED_DB)

    const queryClient = useQueryClient();
    const { isLoading, data } = useQuery({
      queryKey: ['fetchData'],
      queryFn: ApiService.fetchCharacters,
      enabled: false
    });

    const saveCharacter = async (character: EditableCharacter) => {
      await addToDB(character);
      character.isEditing = false
      delete character.originalState;
      toast.success("Uspešno shranjeno");
    };

    const fetchAndStoreCharacters = async () => {
  await StorageServiceManager.setupStorage(databaseType.value);
  const storedCharacters = await StorageServiceManager.fetchCharacters(databaseType.value);

  if (storedCharacters.length > 0) {
    characters.value = storedCharacters;
  } else {
    const response = await ApiService.fetchCharacters();
    const apiCharacters = response.data.results; 

    characters.value = apiCharacters;
    for (const character of apiCharacters) {
      await StorageServiceManager.saveCharacter(character, databaseType.value);
    }
  }
};


    onMounted(async () => {
      try {
        await setupDB();
        const dbCharacters = await fetchFromDB();

        if (dbCharacters.length > 0) {
          characters.value = dbCharacters;
        } else {
          await queryClient.prefetchQuery({
            queryKey: ['fetchData'],
            queryFn: ApiService.fetchCharacters
          });

          const apiCharacters = data.value?.data.results
            .filter(character => SpecificCharacters.includes(character.name))
            .map((character, index) => ({
              ...character,
              id: index,
              isEditing: false,
              imageURL: characterImageMap[character.name]
            }));

          characters.value = apiCharacters;

          apiCharacters.forEach(async (character) => {
            await addToDB(character);
          });
        }
      } catch (error) {
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
    <div v-else class="flex flex-col gap-10 lg:flex-row justify-center items-center w-full">
      <Card v-for="(character, id) in characters" :key="character.id" :character="character">
        <template v-slot:image>
          <img :src="character.imageURL" alt="Character Image" />
        </template>

        <template v-slot:content class="flex flex-col sm:flex-row">
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
