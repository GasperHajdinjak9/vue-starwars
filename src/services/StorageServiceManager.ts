// StorageServiceManager.ts

import { DatabaseType } from '../enums/databseTypes';
import * as DBService from './DBService';
import * as LocalStorageService from './LocalStorageService';
import type { EditableCharacter } from '../interfaces/Character';

export const setupStorage = async (databaseType: DatabaseType): Promise<void> => {
  if (databaseType === DatabaseType.INDEXED_DB) {
    await DBService.setupDB();
  }
};

export const saveCharacter = async (character: EditableCharacter, databaseType: DatabaseType): Promise<void> => {
  if (databaseType === DatabaseType.INDEXED_DB) {
    await DBService.addToDB(character);
  } else {
    LocalStorageService.addToLocalStorage('characters', character);
  }
};

export const fetchCharacters = async (databaseType: DatabaseType): Promise<EditableCharacter[]> => {
  if (databaseType === DatabaseType.INDEXED_DB) {
    return DBService.fetchFromDB();
  } else {
    return LocalStorageService.fetchFromLocalStorage('characters') || [];
  }
};
