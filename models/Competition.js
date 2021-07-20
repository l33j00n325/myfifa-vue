import { Model } from '@vuex-orm/core'
import Stage from './Stage'
import Team from './Team'

class Competition extends Model {
  static entity = 'Competition'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      teamId: this.number(0),

      // Database fields
      season: this.number(0),
      name: this.string(''),
      champion: this.string(null).nullable(),
      presetFormat: this.attr(null),
      numTeams: this.number(null).nullable(),
      numTeamsPerGroup: this.number(null).nullable(),
      numAdvancesFromGroup: this.number(null).nullable(),

      // Associations
      team: this.belongsTo(Team, 'teamId'),
      stages: this.hasMany(Stage, 'competitionId')
    }
  }

  get link () {
    return {
      name: 'teams-teamId-competitions-competitionId',
      params: {
        teamId: this.teamId,
        competitionId: this.id
      }
    }
  }

  get linkToSeason () {
    return {
      name: 'teams-teamId-seasons-season',
      params: {
        teamId: this.teamId,
        season: this.season
      }
    }
  }

  get statusIcon () {
    if (this.champion === this.team.name) {
      return 'mdi-trophy'
    } else if (this.champion) {
      return 'mdi-check'
    } else {
      return 'mdi-timelapse'
    }
  }

  get statusColor () {
    if (this.champion === this.team.name) {
      return 'yellow darken-2'
    } else if (this.champion) {
      return 'green'
    } else {
      return 'gray'
    }
  }

  get teamOptions () {
    let array = this.stages.reduce((arr, stage) => {
      return [
        ...arr,
        ...stage.tableRows.map(row => row.name),
        ...stage.fixtures.reduce((names, fixture) => {
          return [ ...names, fixture.homeTeam, fixture.awayTeam ]
        }, [])
      ]
    }, [])
    return [ ...new Set(array.filter(team => team !== null && team !== '')) ].sort()
  }
}

export default Competition
