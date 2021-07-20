import { Model } from '@vuex-orm/core'
import Match from './Match'
import Player from './Player'

export default class Booking extends Model {
  static entity = 'Booking'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      matchId: this.number(0),
      playerId: this.number(null).nullable(),

      // Database fields
      playerName: this.string(''),
      minute: this.number(0),
      redCard: this.boolean(false),
      createdAt: this.string(''),

      // Calculated fields
      home: this.boolean(true),

      // Associations
      match: this.belongsTo(Match, 'matchId'),
      player: this.belongsTo(Player, 'playerId')
    }
  }

  get type () {
    return 'booking'
  }
}
