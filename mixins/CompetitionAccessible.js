import TeamAccessible from './TeamAccessible'

export default {
  mixins: [
    TeamAccessible
  ],
  computed: {
    competition () {
      return this.$store.$db().model('Competition')
        .query()
        .with('stages.table_rows|fixtures')
        .find(this.$route.params.competitionId)
    },
    competitionTeams () {
      return this.competition.teamOptions
    }
  },
  methods: {
    teamClass (name) {
      switch (name) {
        case this.team.title:
          return 'primary--text'
        case this.competition.champion:
          return name ? 'red--text' : ''
        default:
          return ''
      }
    }
  }
}
