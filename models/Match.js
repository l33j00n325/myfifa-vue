import { Model } from '@vuex-orm/core'
import { parseISO } from 'date-fns'
import PenaltyShootout from './PenaltyShootout'
import Goal from './Goal'
import Substitution from './Substitution'
import Booking from './Booking'
import Cap from './Cap'
import Player from './Player'

export default class Match extends Model {
  static entity = 'Match'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      teamId: this.number(0),

      // Database fields
      home: this.string(''),
      away: this.string(''),
      competition: this.string(''),
      stage: this.string('').nullable(),
      playedOn: this.string(''),
      extraTime: this.boolean(false),
      homeScore: this.number(0),
      awayScore: this.number(0),

      // Calculated fields
      score: this.string(''),
      teamResult: this.attr(null),

      // Associations
      penaltyShootout: this.hasOne(PenaltyShootout, 'matchId'),
      goals: this.hasMany(Goal, 'matchId'),
      substitutions: this.hasMany(Substitution, 'matchId'),
      bookings: this.hasMany(Booking, 'matchId'),
      caps: this.hasMany(Cap, 'matchId'),
      players: this.belongsToMany(Player, Cap, 'matchId', 'playerId')
    }
  }

  get link () {
    return {
      name: 'teams-teamId-matches-matchId',
      params: {
        teamId: this.teamId,
        matchId: this.id
      }
    }
  }

  get opponent () {
    return this.home === this.team.home
      ? this.away
      : this.home
  }

  get season () {
    const startDate = parseISO(this.team.startedOn)
    const datePlayed = parseISO(this.playedOn)
    return parseInt((datePlayed - startDate) / (525600 * 60 * 1000))
  }

  get resultColor () {
    switch (this.teamResult) {
      case 'win':
        return 'success'
      case 'draw':
        return 'warning'
      case 'loss':
        return 'red'
      default:
        return ''
    }
  }
}
