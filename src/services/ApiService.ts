import axios from 'axios';
import { useQuery } from "@tanstack/vue-query";

export class ApiService {
  public static async fetchCharacters() {
    return await axios.get('https://swapi.dev/api/people/');
  }
}
