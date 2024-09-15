import axios from 'axios';

export async function fetchCharacterOptions(team) {
  try {
    const response = await axios.get(`/src/assets/char_data/${team}.json`);
    const data = response.data;

    return Object.entries(data).map(([name, info]) => ({
      value: name,
      name: name,
      icon: `/src/assets/char_images/${team}/${info["english name"]}/icon.webp`,
    }));
  } catch (error) {
    console.error('Error fetching character options:', error);
    return [];
  }
}
