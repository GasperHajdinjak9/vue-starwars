import { DatabaseType } from "../enums/databseTypes";
import { addToDB, fetchFromDB, setupDB } from "./DBService";
import {
  addToLocalStorage,
  fetchFromLocalStorage,
} from "./LocalStorageService";
import type { EditableCharacter } from "../interfaces/Character";

export const setupStorage = async (
  databaseType: DatabaseType
): Promise<void> => {
  if (databaseType === DatabaseType.INDEXED_DB) {
    await setupDB();
  }
};

export const saveCharacter = async (
  character: EditableCharacter,
  databaseType: DatabaseType
): Promise<void> => {
  if (databaseType === DatabaseType.INDEXED_DB) {
    await addToDB(character);
  } else {
    const characters =
      fetchFromLocalStorage<EditableCharacter[]>("characters") || [];
    const index = characters.findIndex((c) => c.id === character.id);
    if (index !== -1) {
      characters[index] = character;
    } else {
      characters.push(character);
    }
    addToLocalStorage("characters", characters);
  }
};

export const fetchCharacters = async (
  databaseType: DatabaseType
): Promise<EditableCharacter[]> => {
  if (databaseType === DatabaseType.INDEXED_DB) {
    return await fetchFromDB();
  } else {
    return fetchFromLocalStorage<EditableCharacter[]>("characters") || [];
  }
};
