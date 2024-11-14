import { useCharStore } from '@/stores/char_stores'
import { useSkillStore } from '@/stores/skill_stores'

export function getUsedSkills() {
  const skillsDictionary = {};
  const charStore = useCharStore();
  const skillStore = useSkillStore();

  Object.values(charStore.selections).forEach((selection) => {
    const style = selection['style'];

    if (style && !skillsDictionary[style]) {
      skillsDictionary[style] = new Set();
    }

    skillStore.skills.forEach(group => {
      group.forEach(skillEntry => {
        if (skillEntry.style === style) {
          const { skill } = skillEntry;

          if (skill && skill != selection['commandSkill'] && !skillsDictionary[style].has(skill)) {
            skillsDictionary[style].add(skill);
          }
        }
      });
    });
  });

  return skillsDictionary;
}
