import { Vue, Component } from 'nuxt-property-decorator'
import { addYears, differenceInYears, format, parseISO } from 'date-fns'
import { Team } from '@/models'

@Component
export default class TeamAccessible extends Vue {
  get team () {
    return Team.find(this.$route.params.teamId)
  }

  get season () {
    const date = parseISO(this.team.started_on)
    const currentDate = parseISO(this.team.currently_on)
    return differenceInYears(currentDate, date)
  }

  get seasonStart () {
    const date = parseISO(this.team.started_on)
    return format(addYears(date, this.season), 'yyyy-MM-dd')
  }

  get seasonEnd () {
    const date = parseISO(this.seasonStart)
    return format(addYears(date, 1), 'yyyy-MM-dd')
  }

  seasonLabel (season) {
    const start = addYears(parseISO(this.team.started_on), season)
    const end = addYears(start, 1)
    return `${format(start, 'yyyy')} - ${format(end, 'yyyy')}`
  }

  linkTo (page) {
    return {
      name: `teams-teamId-${page}`,
      params: { teamId: this.team.id }
    }
  }
}
