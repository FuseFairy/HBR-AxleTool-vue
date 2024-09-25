import axios from 'axios';
import { getAssetsFile } from './util';

export async function fetchCharacterOptions(team) {
  try {
    const response = await axios.get(getAssetsFile(`char_data/${team}.json`));
    const data = response.data;
    console.log(team);
    return Object.entries(data).map(([name, info]) => ({
      value: name,
      name: name,
      icon: `char_images/${team}/${info["english name"]}/icon.webp`,
    }));
  } catch (error) {
    console.error('Error fetching character options:', error);
    return [];
  }
}
