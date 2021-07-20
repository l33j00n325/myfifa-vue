import { Model } from '@vuex-orm/core'
import Match from './Match'
import Player from './Player'

export default class Cap extends Model {
  static entity = 'Cap'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      matchId: this.number(0),
      playerId: this.number(0),

      // Database fields
      pos: this.string(''),
      start: this.number(0),
      stop: this.number(90),
      subbedOut: this.boolean(false),

      // Associations
      match: this.belongsTo(Match, 'matchId'),
      player: this.belongsTo(Player, 'playerId')
    }
  }
}
