import { addYears, differenceInYears, format, parseISO } from 'date-fns'

export default {
  computed: {
    teamId () {
      return parseInt(this.$route.params.teamId)
    },
    team () {
      return this.$store.$db().model('Team').find(this.teamId)
    },
    season () {
      const date = parseISO(this.team.startedOn)
      const currentDate = parseISO(this.team.currentlyOn)
      return differenceInYears(currentDate, date)
    },
    seasonStart () {
      const date = parseISO(this.team.startedOn)
      return format(addYears(date, this.season), 'yyyy-MM-dd')
    },
    seasonEnd () {
      const date = parseISO(this.seasonStart)
      return format(addYears(date, 1), 'yyyy-MM-dd')
    }
  },
  methods: {
    seasonLabel (season) {
      const start = addYears(parseISO(this.team.startedOn), season)
      const end = addYears(start, 1)
      return `${format(start, 'yyyy')} - ${format(end, 'yyyy')}`
    },
    linkTo (page) {
      return {
        name: `teams-teamId-${page}`,
        params: { teamId: this.team.id }
      }
    }
  }
}
