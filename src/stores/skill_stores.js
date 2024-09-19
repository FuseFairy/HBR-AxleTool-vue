import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSkillStore = defineStore('skill', () => {
	const skills = ref([]);

	function adjustSkills(rows) {
		const difference = rows - skills.value.length;

		if (difference > 0) {
			const newSkills = Array(difference).fill([
				{ style: null, style_img: null, skill: null, target: null },
				{ style: null, style_img: null, skill: null, target: null },
				{ style: null, style_img: null, skill: null, target: null }
			]);
			skills.value.push(...newSkills);
		} 
		else if (difference < 0) {
			skills.value.splice(rows);
		}
	}

	return {
		skills,
		adjustSkills
	};
});
