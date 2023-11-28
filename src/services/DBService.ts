import { openDB } from "idb";
import type { EditableCharacter } from "../interfaces/Character";

let db: IDBDatabase<unknown>;

async function setupDB() {
  try {
    db = await openDB("character", 10, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("characters")) {
          db.createObjectStore("characters", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      },
    });
  } catch (error) {
    console.error(error);
  }
}

function prepareForDB(character: EditableCharacter): EditableCharacter {
  return JSON.parse(JSON.stringify(character));
}

async function addToDB(character: EditableCharacter) {
  try {
    const tx = db.transaction('characters', 'readwrite');
    const store = tx.objectStore('characters');
    const characterForDB = prepareForDB(character);
    await store.put(characterForDB);
    await tx.done;
  } catch (error) {
    console.error('Error storing character:', error);
  }
}

async function fetchFromDB(): Promise<EditableCharacter[]> {
  try {
    const tx = db.transaction('characters', 'readwrite');
    const store = tx.objectStore('characters');
    return await store.getAll();
  } catch (error) {
    console.error('Error fetching characters from DB:', error);
    return [];
  }
}

// Initialize the database
setupDB().catch(err => console.warn(err));

export {
  setupDB,
  addToDB,
  fetchFromDB
};
