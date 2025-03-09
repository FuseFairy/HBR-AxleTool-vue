import { useSkillStore } from '@/store/axle'

export function getUsedTeams() {
	const teamsList = []
	const skillStore = useSkillStore()

	skillStore.skills.forEach((group) => {
		group.forEach((skillEntry) => {
			if (skillEntry.selectedTab != null && !teamsList.includes(skillEntry.selectedTab)) {
				teamsList.push(skillEntry.selectedTab)
			}
		})
	})

	return teamsList
}