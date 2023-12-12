
import type { EditableCharacter } from '../interfaces/Character';

export const toggleEditing = (character: EditableCharacter) => {
  if (character.isEditing) {
    if (character.originalState) {
      Object.assign(character, character.originalState);
      delete character.originalState; 
    }
    character.isEditing = false;
  } else {
    character.originalState = JSON.parse(JSON.stringify(character));
    character.isEditing = true;
  }
};

