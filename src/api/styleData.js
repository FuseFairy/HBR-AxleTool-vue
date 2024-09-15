import axios from 'axios';

export async function fetchStyleOptions(characterName, team) {
  try {
    const response = await axios.get(`/src/assets/char_data/${team}.json`);
    const data = response.data;
    console.log(data)

    const characterData = data[characterName];

    if (!characterData || !characterData.style) {
      throw new Error('Character data or styles not found');
    }
    
    const englishName = characterData["english name"]
    const styles = characterData.style;

    return Object.entries(styles).map(([name, icon]) => ({
      value: name,
      name: name,
      icon: `/src/assets/char_images/${team}/${englishName}/${icon}.webp`,
    }));
  } catch (error) {
    console.error('Error fetching style options:', error);
    return [];
  }
}
