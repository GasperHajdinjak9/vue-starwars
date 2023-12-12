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
    //select database
    const databaseType = ref(DatabaseType.INDEXED_DB)

    // query client, data is not fetched instantly
    const queryClient = useQueryClient();
    const { isLoading, data } = useQuery({
      queryKey: ['fetchData'],
      queryFn: ApiService.fetchCharacters,
      enabled: false
    });

    //replacingg underscores in filed names
    const formatFieldName = (fieldName) => {
      return fieldName
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    const saveCharacter = async (character: EditableCharacter) => {
      await StorageServiceManager.saveCharacter(character, databaseType.value);
      // on every save the editing state is restored and original state is removed
      character.isEditing = false;
      delete character.originalState;
      toast.success("Successfully saved");
    };

    onMounted(async () => {
      try {
        await StorageServiceManager.setupStorage(databaseType.value);

        let charactersData = await StorageServiceManager.fetchCharacters(databaseType.value);

        charactersData = charactersData.map(character => ({
          ...character,
          isEditing: false,
          originalState: undefined
        }));

        //if cahracters are in selected storage use them, if not fetch from API
        if (charactersData.length > 0) {
          characters.value = charactersData;
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
              imageURL: characterImageMap[character.name],
              originalState: undefined
            }));

          characters.value = apiCharacters;

          for (const character of apiCharacters) {
            await StorageServiceManager.saveCharacter(character, databaseType.value);
          }
        }
      } catch (error) {
        toast.error("Something went wrong", error);
      }
    });

    return {
      characters,
      toggleEditing,
      editableFields,
      saveCharacter,
      isLoading,
      formatFieldName
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
              <strong>{{ formatFieldName(field) }}:</strong>
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
