import { Model } from '@vuex-orm/core'
import { nationalities, positions } from '@/constants'
import PlayerHistory from './PlayerHistory'
import Injury from './Injury'
import Loan from './Loan'
import Contract from './Contract'
import Transfer from './Transfer'
import Cap from './Cap'
import Match from './Match'
import Goal from './Goal'
import Booking from './Booking'

export default class Player extends Model {
  static entity = 'Player'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      teamId: this.number(0),

      // Database fields
      name: this.string(''),
      nationality: this.string('').nullable(),
      pos: this.string(''),
      secPos: this.attr([]),
      ovr: this.number(60),
      value: this.number(null).nullable(),
      status: this.string(null).nullable(),
      youth: this.boolean(false),
      kitNo: this.number(null).nullable(),

      // Calculated fields
      age: this.number(16),

      // Associations
      histories: this.hasMany(PlayerHistory, 'playerId'),
      injuries: this.hasMany(Injury, 'playerId'),
      loans: this.hasMany(Loan, 'playerId'),
      contracts: this.hasMany(Contract, 'playerId'),
      transfers: this.hasMany(Transfer, 'playerId'),
      caps: this.hasMany(Cap, 'playerId'),
      matches: this.belongsToMany(Match, Cap, 'playerId', 'matchId'),
      goals: this.hasMany(Goal, 'playerId'),
      assists: this.hasMany(Goal, 'assistId'),
      bookings: this.hasMany(Booking, 'playerId')
    }
  }

  get link () {
    return {
      name: 'teams-teamId-players-playerId',
      params: {
        teamId: this.teamId,
        playerId: this.id
      }
    }
  }

  get isActive () {
    return this.status && this.status.length > 0
  }

  get statusColor () {
    switch (this.status) {
      case 'Active':
        return 'light-green'
      case 'Loaned':
        return 'indigo'
      case 'Injured':
        return 'pink'
      case 'Pending':
        return 'deep-orange'
      default:
        return null
    }
  }

  get statusIcon () {
    switch (this.status) {
      case 'Active':
        return 'account-check'
      case 'Loaned':
        return 'transit-transfer'
      case 'Injured':
        return 'hospital'
      case 'Pending':
        return 'lock-clock'
      default:
        return 'minus'
    }
  }

  get posIdx () {
    return positions.indexOf(this.pos)
  }

  get flag () {
    return nationalities[this.nationality]
  }

  contract () {
    const contract = Contract
      .query()
      .where('playerId', this.id)
      .where('startedOn', date => date <= this.team.currentlyOn)
      .where('endedOn', date => this.team.currentlyOn < date)
      .last()
    return contract || {}
  }

  expiresOn () {
    return this.contract().endedOn
  }

  recordAt (date) {
    return PlayerHistory
      .query()
      .where('playerId', this.id)
      .where('recordedOn', recordedOn => recordedOn <= date)
      .last()
  }

  ovrAt (date) {
    return this.recordAt(date).ovr
  }

  valueAt (date) {
    return this.recordAt(date).value
  }
}
