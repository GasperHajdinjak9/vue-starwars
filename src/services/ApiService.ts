import axios from 'axios';

export class ApiService {
  public static async fetchCharacters(): Promise<any> {
    return await axios.get('https://swapi.dev/api/people/');
  }
}
