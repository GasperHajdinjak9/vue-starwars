export interface Character {
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

export interface EditableCharacter extends Character {
    isEditing?: boolean;
    [key: string]: any;
}

export interface Images {
    [key: string]: string;
}