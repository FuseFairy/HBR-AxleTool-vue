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
  });

  Object.keys(skillStore.skills).forEach((phaseId) => {
    skillStore.skills[phaseId].forEach((skillGroup) => {
      skillGroup.forEach((skillEntry) => {
        const style = skillEntry.style;
        const skill = skillEntry.skill;

        if (style && skillsDictionary[style] && skill) {
          skillsDictionary[style].add(skill);
        }
      });
    });
  });

  return skillsDictionary;
}