import { Model } from '@vuex-orm/core'
import Player from './Player'

export default class Transfer extends Model {
  static entity = 'Transfer'

  static fields () {
    return {
      // Primary/Foreign keys
      id: this.number(0),
      player_id: this.number(0),

      // Database fields
      signed_on: this.string(''),
      moved_on: this.string(''),
      origin: this.string(''),
      destination: this.string(''),
      fee: this.number(null).nullable(),
      traded_player: this.string(null).nullable(),
      addon_clause: this.number(null).nullable(),
      loan: this.boolean(false),

      // Associations
      player: this.belongsTo(Player, 'player_id', 'id')
    }
  }

  get date () {
    return this.moved_on
  }

  get type () {
    return 'transfer'
  }
}
