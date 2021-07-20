import { Model } from '@vuex-orm/core'
import { matchPositions } from '@/constants'
import Player from './Player'

export default class SquadPlayer extends Model {
  static entity = 'SquadPlayer'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      squadId: this.number(0),
      playerId: this.number(0),

      // Database fields
      pos: this.string(''),

      // Associations
      player: this.belongsTo(Player, 'playerId')
    }
  }

  get positionType () {
    return matchPositions[this.pos]
  }
}
