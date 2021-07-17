import { mapGetters } from 'vuex'
import TeamAccessible from './TeamAccessible'

export default {
  mixins: [
    TeamAccessible
  ],
  computed: {
    ...mapGetters({
      getCompetition: 'competitions/get',
      getStage: 'stages/get',
      getTableRow: 'tableRows/get',
      getFixture: 'fixtures/get'
    }),
    competitionId () {
      return this.$route.params.competitionId
    },
    competition () {
      const competition = { ...this.getCompetition(this.competitionId) }
      competition.stages = (competition.stagesIds || []).reduce((stages, stageId) => {
        const stage = { ...this.getStage(stageId) }
        if (stage) {
          stage.tableRows = (stage.tableRowsIds || []).reduce((tableRows, tableRowId) => {
            const tableRow = this.getTableRow(tableRowId)
            tableRow && tableRows.push(tableRow)
            return tableRows
          }, [])
          stage.fixtures = (stage.fixturesIds || []).reduce((fixtures, fixtureId) => {
            const fixture = this.getFixture(fixtureId)
            fixture && fixtures.push(fixture)
            return fixtures
          }, [])
          stages.push(stage)
        }
        return stages
      }, [])
      return competition
    },
    competitionTeams () {
      let array = this.competition.reduce((arr, stage) => {
        return [
          ...arr,
          ...stage.tableRows.map(row => row.name),
          ...stage.fixtures.reduce((names, fixture) => {
            return [...names, fixture.homeTeam, fixture.awayTeam]
          }, [])
        ]
      }, [])
      return [...new Set(array.filter(team => team !== null && team !== ''))].sort()
    }
  },
  methods: {
    teamClass (name) {
      switch (name) {
        case this.team.name:
          return 'primary--text'
        case this.competition.champion:
          return name ? 'red--text' : ''
        default:
          return ''
      }
    }
  }
}
