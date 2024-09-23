import axios from 'axios';

export async function fetchPassiveSkillOptions(characterName, team) {
  try {
    const response = await axios.get(`/src/assets/char_data/${team}.json`);
    const data = response.data;
    const characterData = data[characterName];

    if (!characterData || !characterData.style) {
      throw new Error('Character data or styles not found');
    }

    const passiveSkills = characterData['passive skill'] || [];
    return passiveSkills;

  } catch (error) {
    console.error('Error fetching skill options:', error);
    return [];
  }
}
